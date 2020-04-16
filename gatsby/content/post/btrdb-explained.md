---
date: "2019-12-12T19:42:13.181361Z"
description: A brief description of the Berkeley Tree Database (BTrDB)
tags:
- btrdb
- timeseries
- analytics
- database
title: BTrDB Explained
---

**BTrDB is a next-gen timeseries database for high-precision, dense telemetry.**

> The Berkeley Tree DataBase (BTrDB) is pronounced "**Better DB**".

**Problem:** Existing timeseries databases are poorly equipped for a new generation of ultra-fast sensor telemetry. Specifically, millions of high-precision power meters are to be deployed throughout the power grid to help analyze and prevent blackouts. Thus, new software must be built to facilitate the storage and analysis of its data.

**Baseline:** We need at least 1.4M inserts/s and 5x that in reads if we are to support 1000 [micro-synchrophasors] per server node. No timeseries database can do this.

[micro-synchrophasors]:https://arxiv.org/abs/1605.02813

## Summary

**Goals:** Develop a multi-resolution storage and query engine for many 100+ Hz streams at nanosecond precision—and operate at the full line rate of underlying network or storage infrastructure for affordable cluster sizes (less than six).

Developed at The University of California Berkeley, BTrDB offers new ways to support the aforementioned high throughput demands and allows efficient querying over large ranges.

**Fast writes/reads**

Measured on a 4-node cluster (large EC2 nodes):

- 53 million inserted values per second
- 119 million queried values per second

**Fast analysis**

In under _200ms_, it can query a year of data at nanosecond-precision (2.1 trillion points) at any desired window—returning statistical summary points at any desired resolution (containing a min/max/mean per point).

![zoom](/assets/images/post/btrdb-explained/ui_zoom.gif)

**High compression**

Data is compressed by 2.93x—a significant improvement for high-precision nanosecond streams. To achieve this, a modified version of _run-length encoding_ was created to encode the _jitter_ of delta values rather than the delta values themselves.  Incidentally, this  outperforms the popular audio codec [FLAC] which was the original inspiration for this technique.

[FLAC]:https://xiph.org/flac/

**Efficient Versioning**

Data is version-annotated to allow queries of data as it existed at a certain time.  This allows reproducible query results that might otherwise change due to newer realtime data coming in.  Structural sharing of data between versions is done to make this process as efficient as possible.

## The Tree Structure

BTrDB stores its data in a time-partitioned tree.

All nodes represent a given time slot. A node can describe all points within its time slot at a resolution corresponding to its depth in the tree.

The root node covers ~146 years. With a branching factor of 64, bottom nodes at ten levels down cover 4ns each.

<table class="table table-sm table-striped table-bordered">
<thead>
<tr>
<th>level</th>
<th>node width</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>2<sup>62</sup> ns  (~146 years)</td>
</tr>
<tr>
<td>2</td>
<td>2<sup>56</sup> ns  (~2.28 years)</td>
</tr>
<tr>
<td>3</td>
<td>2<sup>50</sup> ns  (~13.03 days)</td>
</tr>
<tr>
<td>4</td>
<td>2<sup>44</sup> ns  (~4.88 hours)</td>
</tr>
<tr>
<td>5</td>
<td>2<sup>38</sup> ns  (~4.58 min)</td>
</tr>
<tr>
<td>6</td>
<td>2<sup>32</sup> ns  (~4.29 s)</td>
</tr>
<tr>
<td>7</td>
<td>2<sup>26</sup> ns  (~67.11 ms)</td>
</tr>
<tr>
<td>8</td>
<td>2<sup>20</sup> ns  (~1.05 ms)</td>
</tr>
<tr>
<td>9</td>
<td>2<sup>14</sup> ns  (~16.38 µs)</td>
</tr>
<tr>
<td>10</td>
<td>2<sup>8</sup> ns   (256 ns)</td>
</tr>
<tr>
<td>11</td>
<td>2<sup>2</sup> ns   (4 ns)</td>
</tr>
</tbody>
</table>

A node starts as a **vector node**, storing raw points in a vector of size 1024. This is considered a leaf node, since it does not point to any child nodes.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                           VECTOR NODE                           │
│                     (holds 1024 raw points)                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . │ <- raw points
└─────────────────────────────────────────────────────────────────┘
```

Once this vector is full and more points need to be inserted into its time slot, the node is converted to a **core node** by time-partitioning itself into 64 "statistical" points.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                            CORE NODE                            │
│                   (holds 64 statistical points)                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ │ <- stat points
└─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┘
  ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼  <- child node pointers
```

A **statistical point** represents a 1/64 slice of its parent's time slot. It
holds the min, max, mean, standard deviation, and count of all points inside its time slot, and points to a new node holding extra details.  When a vector node is first converted to a core node, the raw points are pushed into new vector nodes pointed to by the new statistical points.

<table class="table table-sm table-striped table-bordered">
<thead>
<tr>
<th>level</th>
<th>node width</th>
<th>stat point width</th>
<th>total nodes</th>
<th>total stat points</th>
</tr>
</thead>

<tbody>
<tr>
<td>1</td>
<td>2<sup>62</sup> ns  (~146 years)</td>
<td>2<sup>56</sup> ns  (~2.28 years)</td>
<td>2<sup>0</sup> nodes</td>
<td>2<sup>6</sup> points</td>
</tr>

<tr>
<td>2</td>
<td>2<sup>56</sup> ns  (~2.28 years)</td>
<td>2<sup>50</sup> ns  (~13.03 days)</td>
<td>2<sup>6</sup> nodes</td>
<td>2<sup>12</sup> points</td>
</tr>

<tr>
<td>3</td>
<td>2<sup>50</sup> ns  (~13.03 days)</td>
<td>2<sup>44</sup> ns  (~4.88 hours)</td>
<td>2<sup>12</sup> nodes</td>
<td>2<sup>18</sup> points</td>
</tr>

<tr>
<td>4</td>
<td>2<sup>44</sup> ns  (~4.88 hours)</td>
<td>2<sup>38</sup> ns  (~4.58 min)</td>
<td>2<sup>18</sup> nodes</td>
<td>2<sup>24</sup> points</td>
</tr>

<tr>
<td>5</td>
<td>2<sup>38</sup> ns  (~4.58 min)</td>
<td>2<sup>32</sup> ns  (~4.29 s)</td>
<td>2<sup>24</sup> nodes</td>
<td>2<sup>30</sup> points</td>
</tr>

<tr>
<td>6</td>
<td>2<sup>32</sup> ns  (~4.29 s)</td>
<td>2<sup>26</sup> ns  (~67.11 ms)</td>
<td>2<sup>30</sup> nodes</td>
<td>2<sup>36</sup> points</td>
</tr>

<tr>
<td>7</td>
<td>2<sup>26</sup> ns  (~67.11 ms)</td>
<td>2<sup>20</sup> ns  (~1.05 ms)</td>
<td>2<sup>36</sup> nodes</td>
<td>2<sup>42</sup> points</td>
</tr>

<tr>
<td>8</td>
<td>2<sup>20</sup> ns  (~1.05 ms)</td>
<td>2<sup>14</sup> ns  (~16.38 µs)</td>
<td>2<sup>42</sup> nodes</td>
<td>2<sup>48</sup> points</td>
</tr>

<tr>
<td>9</td>
<td>2<sup>14</sup> ns  (~16.38 µs)</td>
<td>2<sup>8</sup> ns   (256 ns)</td>
<td>2<sup>48</sup> nodes</td>
<td>2<sup>54</sup> points</td>
</tr>

<tr>
<td>10</td>
<td>2<sup>8</sup> ns   (256 ns)</td>
<td>2<sup>2</sup> ns   (4 ns)</td>
<td>2<sup>54</sup> nodes</td>
<td>2<sup>60</sup> points</td>
</tr>

<tr>
<td>11</td>
<td>2<sup>2</sup> ns   (4 ns)</td>
<td></td>
<td>2<sup>60</sup> nodes</td>
<td></td>
</tr>
</tbody>
</table>

The sampling rate of the data at different moments will determine how deep the tree will be during those slices of time. Regardless of the depth of the actual data, the time spent querying at some higher level (lower resolution) will remain fixed (quick) due to summaries provided by parent nodes.

## Appendix

This page is written based on the following sources:

- [Homepage](http://btrdb.io/)
- [Whitepaper](https://www.usenix.org/system/files/conference/fast16/fast16-papers-andersen.pdf)
- [Code](https://github.com/BTrDB/btrdb-server)
