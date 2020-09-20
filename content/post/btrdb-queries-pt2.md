---
author: chestnut
date: '2020-02-14T16:55:21-05:00'
description: How to leverage the Berkeley Tree to create memory efficient queries
featuredImage: '/assets/images/post/default.jpg'
tags:
- Explainers
- NI4AI
- BTrDB
- Data structures
- Analytics
title: 'Memory Efficient BTrDB Queries: Part 2'
---

In Part I we introduced the tree data structure and discussed the two main algorithms for traversing them: depth-first and breadth-first. It is highly recommended that you review that post if these concepts are new to you, as Part II will build on them with more complicated examples using [the Berkeley Tree Database (BTrDB)](http://btrdb.io/).

In this post we will review three multi-query approaches for memory safety. First, we will explore chunked queries that allow us to scan across the database, loading fixed size chunks of memory at a time. Then, using this as a building block, we will explore tree based queries that execute at higher levels of time granularity (higher in the tree), only querying at lower levels when needed.

## Chunked Queries

Consider the problem where you would like to conduct an analysis over a month of data. At a 120 Hz sample rate, this query will collect 313,632,000 points of data, which at roughly 16 bytes per point is a total query size of 5.02 GB. Although most modern laptops can easily hold this in memory at a given time, consider that many computations may double or triple the memory requirements to produce a result, and if the computation takes a long time, holding a database cursor open for that long may lead to in-process failures which require restarting the whole computation.

One solution is to query only a week or a day at a time, yielding the materialized data to the computation before issuing the next query. This is a fairly simple function to write in Python:

```python
from btrdb.utils.timez import ns_delta, to_nanoseconds

def chunked_values(stream, start, end, chunk=ns_delta(days=1), version=0):
    # Convert start and end to nanoseconds to make range math easier.
    start, end = to_nanoseconds(start), to_nanoseconds(end)

    # Range over the chunk start times using the chunk step
    for time in range(start, end, chunk):
        # Perform the database query and yield it
        yield stream.values(time, time+chunk, version=version)

# Use the function to issue 4 queries
start = "2020-01-01T00:00:00.000Z"
end = "2020-01-31T00:00:00.000Z"
for result in chunked_values(stream, start, end, ns_delta(weeks=1)):
    for point, _ in result:
        # use point
```

Similar functions can be written for `windows` and `aligned_windows` as well.

There is a trade-off to using this function, although you are using a quarter of the memory than you would have by materializing an entire month of data, you do so at the increased latency of issuing 3 more queries to the database. Balance between the amount of data loaded per query and the number of queries issued is very important; when computing across a month of data you would only want to query no less than a few days at a time. Using this basic building block of issuing multiple queries across specific ranges of time, we will explore more complex queries that directly leverage the Berkeley Tree to only access data required for the computation, pruning away unnecessary queries.

## Tree Traversal Queries in BTrDB

BTrDB is a tree data structure that is not dissimilar from the tree structure saw in Part I. It's root and interior nodes are composed of `StatPoints` that describe a window of time with statistical aggregates and it's leaf nodes can be thought of as individual points. Although you cannot directly query the children of a stat point in the tree, a similar effect is possible using `windows` and `aligned_windows` queries where the `depth` and `pointwidth` arguments specify the level of the tree that is being traversed and the time range specified by the query can be directly fetched from the parent node (which is also true for `values` queries).

To demonstrate this, let's take a toy example where we want to find the _time of the minimum value_ in a stream. We will explore both depth-first and breadth-first traversal strategies to see which is more efficient. To start, note that it is very fast to get the _minimum value_ of a stream:

```python
def get_minimum_value(stream, version=0):
    # Get all of the stat points at the highest level of the tree as possible
    windows = stream.aligned_windows(
        start=btrdb.MINIMUM_TIME, end=btrdb.MAXIMUM_TIME, pointwidth=60, version=version
    )

    # Unless you have decades of data, this will likely only be one stat point
    values = [window.min for window, _ in windows]
    return min(values)
```

This function collects the root node of the tree by performing an `aligned_windows` query at `pointwidth=60`, which should return only one stat point unless you have decades of data stored in the database (for completeness, we still take the minimum of all returned windows if more than one is returned). Because a stat point is returned, we can directly fetch the minimum value from the point. However, what if we wanted to know _when_ that minimum value occurred?

Here is an example of how to answer that question with a depth-first approach:

```python
from btrdb.utils.general import pointwidth

def find_points_dfs(
    stream,
    value,
    start=btrdb.MINIMUM_TIME,
    end=btrdb.MAXIMUM_TIME,
    pw=48,
    version=0
):
    # Ensure pw is a pointwidth object
    pw = pointwidth(pw)

    # Begin by collecting all stat points at the specified pointwidth
    # Note that zip creates a list of windows and versions and we ignore the versions
    windows, _ = zip(*stream.aligned_windows(start, end, pw, version))

    # Traversing from left to right from the windows
    for window in windows:
        # Check to see if the value is in the window
        if window.min <= value <= window.max:
            # Get the time range of the current window
            wstart = window.time
            wend = window.time + pw.nanoseconds

            if pw <= 30:
                # If we are at a window length of a second, use values
                points, _ = zip(*stream.values(wstart, wend, version))
            else:
                # Otherwise, traverse the stat point children of this node
                points = find_points_dfs(stream, value, wstart, wend, pw-1, version)

            # Yield all points to the calling function
            for point in points:
                if point.value == value:
                    yield point

# Find the time of of the smallest value in the stream
value = get_minimum_value(stream)
for point in find_points_dfs(stream, value):
    print(point)
```

The `find_points_dfs()` function starts by performing an `aligned_windows` query to retrieve `StatPoints`, which are aggregated points from BTrDB at the provided pointwidth. It then iterates through each retrieved window and checks to see if it contains the desired minimum value. If it does, it either conducts another `aligned_windows()` query to move down one level in the tree (`pw` - 1) and recursively calls `find_points()`, or performs a `values()` query to return raw values which are iterated through in search of the minimum value. It is important to note that it is not necessary to traverse one pointwidth at a time, and in fact it may be a better strategy to skip multiple levels to reduce the latency by minimizing the number of calls to the database. This idea relates back to the trade-off between number of queries and amount of data returned from each query that we discussed earlier in this post. Once raw values are returned from the `values()` query, the function iterates through them and yields those that match the minimum value.

### Breadth-First Example
To compare the two approaches, we can look at an example of how we would solve the same problem of finding the time of our minimum value using a breadth-first approach:

```python
from collections import namedtuple

#Instantiating our namedtuple that will contain our aggregated windows
Window = namedtuple("Window", "time,min,max,pw")

def query_windows(stream, start, end=None, pw=48, version=0):
    """
    Returns a list of named tuples that contain agggregated windows to be added to our list of windows to traverse
    """
    if end is None:
        end = start + pointwidth(pw).nanoseconds

    points, _ = zip(*stream.aligned_windows(start, end, pointwidth(pw-1), version))

    return [
        Window(point.time, point.min, point.max, pointwidth(pw-1))
        for point in points
    ]

def find_points_bfs(
    stream,
    value,
    start=btrdb.MINIMUM_TIME,
    end=btrdb.MAXIMUM_TIME,
    pw=48,
    min_depth=30,
    version=0
):
    # Set up the bfs recursive call
    windows = query_windows(stream, start, end, pw, version)
    for point in _find_points_bfs_recursive(stream, value, windows, min_depth, version):
        yield point

def _find_points_bfs_recursive(
    stream,
    value,
    windows,
    min_depth,
    version,
):
    """
    This function implements recursive breadth-first traversal to find all points with the matching value.
    """
    # Stopping condition 1
    if len(windows) == 0:
        return

    current = windows[0]

    if isinstance(current, Window):

        # Check if the value we're looking for is in the window
        if current.min <= value <= current.max:

            # Append the child nodes to the traversal windows
            if current.pw > min_depth:
                windows.extend(query_windows(stream, current.time, pw=current.pw, version=version))
            else:
                # Append raw points to the windows if we've reached the minimum pontwidth
                points, _ = zip(*stream.values(current.time, current.time+current.pw.nanoseconds, version))
                windows.extend(points)

        # Recurse into the children, omitting current
        for point in _find_points_bfs_recursive(stream, value, windows[1:], min_depth, version):
            yield point
    else:
        # Stopping condition 2: every point from hereafter is going to be a raw point
        for point in windows:
            if point.value == value:
                yield point

# Using the function from the last example to get the minimum value in the stream
value = get_minimum_value(stream)
for point in find_points_bfs(stream, value):
    print(point)
```

There are a couple of important differences between this function and the depth-first approach. The first is that once it identifies a window that contains the desired value, it issues another `aligned_windows()` query and adds the resulting windows to the _end_ of the list of windows to traverse before recursively calling `find_points_bfs()`, rather than immediately jumping down a level in the tree, as you would with depth-first. The second difference is that with this approach it is important to track the pointwidth of each window as the function progresses so we know when to issue a `values()` query and examine raw values once we reach our `max_depth` (poinwidth of 30 in this case). This is done by storing each window as a tuple that contains the statpoint and the pointwidth that was used to retreive that statpoint. The end of the function looks similar though; once it receives raw values it iterates through them and yields those that match our criteria.

## Conclusion
The question of which approach is better largely depends on the problem that you are trying to solve. Depth-first is generally preferred when you are searching for a single value, as we were in our toy example, while breadth-first is more suitable for tasks such as finding all values below a certain threshold, or within a certain range of values.

The key concept to understand is that both `find_points_dfs()` and `find_points_bfs()` only traverse to child nodes when their parents contain the target minimum value, while ignoring those that do not. This allows us to prune away unnecessary data and conduct memory efficient and better performing queries.
