---
date: '2021-06-23T14:00:00+0000'
description: This blog post explores how to maximize your efficiency in working with large datasetes using `windows`, `aligned_windows` and `values` queries (Photo credit Roald Dahl). 
featuredImage: '/assets/images/post/windows/bfg_book.png'
tags:
- ni4ai-tutorials
title: Working with big data
author: laurel
---


# Windows, aligned windows, and values

This tutorial offers a guide on using the PredictiveGrid to work wtih VERY big data sets.

When working with high-resolution time series data, seemingly simple tasks can quickly become intractable. The reason for this is that the volume of data exceeds the computational limits of most most computing environments.

Here, we'll describe three methods for querying data in PredictiveGrid. In practice none of these is "better" than another -- there is a time and a place for each. This post will weigh the relative advantages of each approach.

### Functions used
- `stream.values()`
- `stream.windows()`
- `stream.aligned_windows()`


```python
import btrdb
import pandas as pd
import numpy as np
from btrdb.utils.timez import *
from datetime import datetime, timedelta

from matplotlib import pyplot as plt
```


```python
db = btrdb.connect()
```

### What is "Big Data"?

One definition of the term "Big Data" helps to put the problem in context:
> The term “big data” refers to data that is so large, fast or complex that it’s difficult or impossible to process using traditional methods. 

Let's dig into what this means by looking at the size of the `sunshine` data set.


```python
n_points = 0
for stream in db.streams_in_collection('sunshine'):
    n_points += stream.count()
    
print('Thats a total of %.2f Billion points!'%(n_points/1e9))
```

    Thats a total of 279.60 Billion points!


### How much data is that?

To illustrate what's meant by `BIG DATA`, let's investigate the very simple task of querying data from a single stream.

Your first thought might be to say: `Give me all the data!` But what will that yield?


```python
streams = db.streams_in_collection('sunshine/PMU1', tags={'name': 'L1MAG'})
stream = streams[0]
print('collection:\t', stream.collection)
print('stream name:\t', stream.name)

# How many points is that?
print('num points:\t', stream.count()/1e9, 'Billion')
```

    collection:	 sunshine/PMU1
    stream name:	 L1MAG
    num points:	 5.143168296 Billion



```python
# What is that in gigabytes?
print('%.2f Billion points is %.2f gigabytes of data!'%(stream.count()/1e9, stream.count()*64*2/8/1e9))
```

    5.14 Billion points is 82.29 gigabytes of data!


### That's a lot of data!
That volume of data will almost certainly overload your local computing environment. Even if you're working in the cloud, it would be expensive to maintain an envrionment with that much memory. It's worth checking that you need that much data before asking for an environment large enough to get it.

Most importantly, it'll likely take quite a long time to get the data back to you. **Waiting for data is NOT worth your time**.

##### What are the alternatives?

Below, we've included a helper function for issuing different types of queries.

# Windows Queries

Windows queries provide *statistical aggregates* or "summary statistics" of raw data points in a give ntime interval. A windows query will return a time series of `StatPoint` objetcs, which can be used to explore summary statistics of raw values over time.

#### New to `StatPoints`? 
Start here: https://github.com/PingThingsIO/ni4ai-notebooks/blob/main/tutorials/5%20-%20Working%20with%20StatPoints.ipynb


```python
t0 = currently_as_ns()

start, _ = stream.earliest()
end, _ = stream.latest()

window = ns_delta(days=5)
statpoints = stream.windows(start.time, end.time, window)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 1.45 seconds


### What just happened?

The query `stream.windows()` scanned through 18 months of data to return `StatPoint` objects in intervals specified by `window`. Let's visualize the restults. 

It took less than 10 MICROseconds to run through all 18 months of data.

***That's pretty fast***

# What happens if we zoom in?


```python
t0 = currently_as_ns()

window = ns_delta(days=1)
statpoints = stream.windows(start.time, end.time, window)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 5.99 seconds



```python
t0 = currently_as_ns()
window = ns_delta(hours=6)
statpoints = stream.windows(start.time, end.time, window)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 26.49 seconds


That one took a while! Don't worry, there's a better way.

# Aligned windows

Aligned windows return results that look very much like windows queries. The only differece, is that time stamps are adjusted to align with time windows stored inherently in the database. Where `windows` queries may need to re-compute statistical aggregates over the time window requested, `aligned_windows` queries can leverage pre-computed values.


Let's look at the difference in performance.


```python
window = ns_delta(hours=6)
pw = np.log2(window)

t0 = currently_as_ns()
statpoints = stream.aligned_windows(start.time, end.time, pointwidth=pw)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 0.04 seconds


That's much faster! The only thing to note is that the time increment in an `aligned_windows` query is rounded to the nearest time increment that matches the inherent structure of the database.


```python
print(btrdb.utils.general.pointwidth(pw))
```

    Increment requested: 6 hours
    Increment used: 4.89 hours


### This may seem counter-intuitive at first but ...

It is wortwhile to become familiar with `aligned_windows` queries because they can be much faster. 

If you don't care whether or not aggregates are returned in precisely 1-hour increments (for example), `aligned_windows` queries will allow you to query more data in finer time increments than you would be able to do using `windows` queries.


```python
window = ns_delta(hours=6)
pw = np.log2(window)

t0 = currently_as_ns()
statpoints = stream.aligned_windows(start.time, end.time, pointwidth=pw)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 0.05 seconds



```python
window = ns_delta(minutes=30)
pw = np.log2(window)

t0 = currently_as_ns()
statpoints = stream.aligned_windows(start.time, end.time, pointwidth=pw)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 1.74 seconds



```python
window = ns_delta(minutes=1)
pw = np.log2(window)

t0 = currently_as_ns()
statpoints = stream.aligned_windows(start.time, end.time, pointwidth=pw)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 60.34 seconds


That last query took a while! Let's make note of that...


```python
dt = (end.time-start.time)/1e9/3600/24
pw = btrdb.utils.general.pointwidth(pw)
print("Note to self: Don't try to query %i days of data at %i second granularity"%(dt, pw))
```

    Note to self: Don't try to query 561 days of data at 35 second granularity


# When to use `values`

Many analytics can be done using StatPoints to summarize steady state characteristics of the data at the time-scale that is of interest, or to identify intervals in the data where there is an "event" in the data. 

Here, we'll simply explore at what point values queries become intractable to perform.


```python
window = ns_delta(minutes=1)
start_time = start.time
end_time = start_time + window

t0 = currently_as_ns()
statpoints = stream.values(start_time, end_time)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 0.27 seconds



```python
window = ns_delta(minutes=10)
start_time = start.time
end_time = start_time + window

t0 = currently_as_ns()
statpoints = stream.values(start_time, end_time)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 0.23 seconds



```python
window = ns_delta(hours=1)
start_time = start.time
end_time = start_time + window

t0 = currently_as_ns()
statpoints = stream.values(start_time, end_time)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 1.15 seconds



```python
window = ns_delta(hours=6)
start_time = start.time
end_time = start_time + window

t0 = currently_as_ns()
statpoints = stream.values(start_time, end_time)
print('Runtime: %.2f seconds'%((currently_as_ns()-t0)/1e9))
```

    Runtime: 6.86 seconds


### One last note to self...

When running values queries, be sure to check how much working memory you have available in your jupyterhub instance. Bringing large amounts of data into memory can easily crash your jupyter server! You may need to shut down and move to a larger instance if your kernel crashes repeatedly.

### `aligned_windows` queries in action 
Here are some examples where we use statpoints to hone in on time intervals that are known (or likely) to be of interest for a given analytic:
- Voltage sags: https://github.com/PingThingsIO/ni4ai-notebooks/blob/main/demo/Voltage%20Sag%20Exploration.ipynb
- Tap changes: https://github.com/PingThingsIO/ni4ai-notebooks/blob/main/demo/Voltage%20Change%20Detection.ipynb

### `values` queries in action

Here are examples where we use values queries to examine events that warrant full-resolution queries:
- Spectral analysis: https://github.com/PingThingsIO/ni4ai-notebooks/blob/main/demo/PV_spectrogram.ipynb
- Phase angle differencing: https://github.com/PingThingsIO/ni4ai-notebooks/blob/main/demo/Phase%20Angle%20Monitoring.ipynb

