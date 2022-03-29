---
# Memory Efficient BTrDB Queries: Part 1

[The Berkeley Tree Database (BTrDB)](http://btrdb.io/) provides effective distributed storage of dense scalar-valued telemetry data. It can store data with nanosecond precision, and it supports reading and writing more than 10 million points per second per node. As a result it is an excellent tool for analyzing historical high-frequency (usually 30-240 Hz) sensor readings that produce gigabytes of data an hour.

When working with such large amounts of data, it is important to conduct queries in a manner that efficiently utilizes the main memory of your machine. While the BTrDB API supports streaming raw values and windows over large time ranges, it is often not necessary or wise to do so when most computations can be composed of batches and when such analytics require non-trivial computation time. BTrDB's unique tree structure was designed to support queries at arbitrary levels of time granularity with constant time aggregation. This structure can also be used to compose multiple queries, loading data into a computation on demand, while pruning away unnecessary data before it is retrieved from the database. Conducting queries in this way reduces the amount of the BTrDB tree that needs to be traversed and held in memory, thus greatly improving performance.

In this post we will introduce the concepts needed to understand how to conduct these memory efficient queries. These concepts include tree data structures, depth-first traversal and breadth-first traversal. We will then follow up in our next post to discuss how these concepts can be applied to conduct memory-efficient queries with the BTrDB.

## Tree Data Structures

The first step to understanding tree query algorithms is to understand the tree data structure. To simply illustrate this, we can implement a simple tree structure in Python as follows:

```python
class Node(object):
    """
    A tree node has a label that identifies it as well as children and a single parent.
    Any k-ary tree can be constructed using this simple data structure.
    """

    def __init__(self, label, children=None, parent=None):
        self.label = label
        self.parent = parent
        self.children = children or []
​
    def add_child(self, label):
        child = Node(label, [], self)
        self.children.append(child)
        return child
​
    def __iter__(self):
        for child in self.children:
            yield child
​
    def __len__(self):
        return len(self.children)
​
    def __str__(self):
        return self.label
```

Trees are constructed with `Node` objects that have a label, children, and a parent. The first node in the tree is called the _root node_ - it is the only node in the tree that does not have a parent. Nodes with children are called _interior nodes_ because they are in the middle of the tree. Nodes without children are called _leaf nodes_ because they are on the outside of the tree. The size of the tree is the number of nodes and the depth of the tree is the number of connections from the root to the farthest leaf node.

Consider the following example tree with size=11 and depth=3 that we will use throughout the rest of the post:

![An example tree with size=11 and depth=3](btrdb-queries-pt1/example_tree.png)

Creating this tree using a Python function is as follows:

```python
def make_tree():
    # Create root node and its children
    A = Node("A")
    B = A.add_child("B")
    C = A.add_child("C")

    # Add the second layer of the tree through B and C
    B.add_child("D")
    E = B.add_child("E")
    B.add_child("F")
    G = C.add_child("G")

    # Add the third layer of the tree via E and G
    E.add_child("J")
    E.add_child("K")
    G.add_child("H")
    G.add_child("I")

    # Return the root node of the tree
    return A

tree = make_tree()
```

To traverse this tree, we will start at the root and then _recursively_ access children. There are two primary methods of traversing trees: depth-first and breadth-first. In our examples using this tree we will consider a method that is designed to apply a function to each node in the tree. The function should return `True` if the traversal should continue or `False` if the traversal should stop (`break`). The most common example is to conduct a search, where we want to find a node that meets a specific criteria, once that criteria is found, we can stop our search.

### Depth-First

Depth-first traversal starts at the root and goes as deep to the left of the tree as possible before traversing back up the tree and down again. The goal of depth-first traversal is to access the leaf nodes in the tree as quickly as possible given the structure described above. This kind of traversal is implemented as follows:

```python
def depth_first(root, func):
    # If the node has children, traverse down into the chidren
    if len(root) > 0:
        for child in root:
            depth_first(child, func)

    # Apply the function to the node
    func(root)

# Start depth-first traversal with the root of the tree
depth_first(make_tree(), print)
```

The `depth_first()` function recursively applies a function, `func` to each node in the tree starting with the lowest left node. It does this by first applying the function to any children the node has, by traversing the children using the depth-first call. If the node does not have children (it is a leaf node) or the function has been applied to all children of the current node, the function is applied. This allows the function to quickly reach the bottom of the tree.

The expected print output from `depth_first()` is:

```
D
J
K
E
F
B
H
I
G
C
A
```

Depth-first traversal is commonly used because of its ease of implementation and the fact that it doesn't have book keeping requirements that might require increased memory usage. If the order of applying the function matters, e.g. if you're searching for a value and will stop when you find it, then it is important to consider the path the traversal takes. For example, in BTrDB where moving left to right across the tree means moving increasing time-order, depth-first traversal is the best way to find the _earliest_ example of something in time.

### Breadth-First

Breadth-first traversal prioritizes interior nodes rather than leaf nodes by traversing each level of the tree at a time. Starting at the root node, a breadth-first traversal collects all the children of the current level, then iterates accross them, collecting all of the children at the level below. The collection mechanism requires some extra bookkeeping, though we are still able to implement breadth-first search recursively.

Here is an example of a function that executes breadth-first to similarly apply a function, `func` to each node in the tree:

```python
def breadth_first(nodes, func):
    # Helper to make it easier to pass the root node
    if isinstance(nodes, Node):
        nodes = [nodes]

    # Quit if no more nodes
    if len(nodes) == 0:
        return

    # Get the current node and apply the function, stopping if it returns False
    current = nodes[0]
    func(current)

    # Append the children to the list of nodes to traverse and continue
    if len(current) > 0:
        nodes += list(current)

    return breadth_first(nodes[1:], func)

# Start breadth-first traversal with the root of the tree
breadth_first(make_tree(), print)
```

Instead of a single node object, the first argument to the recursive `breadth_first()` function is a list of nodes. To make passing the root node to the tree easier (the usual place where the traversal starts), the first step of the function is a check to convert a single node into a list of nodes. The recursive stop condition is to check if an empty list has been passed in. Otherwise, the first node in the list is fetched as the current node and the function applied to it. We then collect all of the children of the node and append them to the list, this ensures that the level below the current node is only started after the current level is completed and that traversal of the children in the level below happens in a left to right fashion. We can then continue to recurse on all of the children, omitting the current node from the next call.

The expected printed order of this function is

```
A
B
C
D
E
F
G
J
K
H
I
```

While breadth-first traversal is a bit trickier to implement, it is important to consider the tree traversal pattern. If you're searching for a value that is in the middle of the tree or to the far right of the tree, then breadth-first traversal could be a far better strategy. In the case of BTrDB, breadth-first traversal allows you to easily traverse all time at different time granularities, collecting statistical information about the values below. If you're looking for the latest window or all windows that meet certain criteria, breadth-first traversal might be the better strategy.

## Recap
In those post we introduced tree data structures as well as the two primary approaches for traversing them. Please stay tuned for Part II, which will detail how to apply these concepts to the BTrDB.
