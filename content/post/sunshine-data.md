---
date: 2020-03-30T12:30:37-0400
description: A brief walkthrough of the Sunshine uPMU dataset
featuredImage: '/assets/images/post/sunshine-data/sunshine-plot-1.png'
tags: ["data-descriptions", "ni4ai-data", "analytics", "sunshine-data"]
title: A brief walkthrough of the Sunshine uPMU dataset
author: sascha
---

The “Sunshine” dataset comes from a distribution system in a sunny climate with significant solar PV generation. The data were collected with micro-PMUs during an early research deployment. There are gaps in the data which correspond to outages as the team was experimenting with different system configurations and wireless communications. When fully connected, each PMU reports data at 120 frames per second on twelve channels: three-phase voltage and current, giving root-mean-square magnitude and phase angle for each.

The six sensor locations correspond to three substation buses, one large PV array, and two university buildings. While all six are within the same city, there are three separate distribution circuits, equipped with two sensors each:

```
PMU1 - PV array
PMU3 - Substation where this PV array is connected
```

```
PMU6 - Building
PMU4 - Substation where this building is connected
The impedance between PMUs 4 and 6 is estimated at
Pos seq 0.76 + j0.463
Neg seq 1.782 + j1.234
```

```
PMU2 - Building
PMU5 - Substation where this building is connected
The impedance between PMUs 2 and 5 is estimated at
Pos seq 0.489 + j0.59
Neg seq 0.971 + j1.476
```

The dataset was collected for academic power engineering research and has been anonymized to remove sensitive and location-specific information and it can be found in the `sunshine/` collection in the plotter.

In this post, we'll go over how to access the dataset using the [btrdb-python bindings](https://btrdb.readthedocs.io/en/latest/) and prepare to do power engineering analytics on it.

## Let's Explore the Data

Each uPMU's streams are stored in a PMU-specific collection, `sunshine/PMU1` through `sunshine/PMU6`. The best way to explore the data is to go to the [plotter](https://plot.ni4ai.org/) and enter `sunshine` into the "collection" filter. Each PMU is comprised of 13 related streams: the three phase voltage and current angle and magnitudes and a state stream. For example, here are the [3 voltage magnitude streams for sunhine/PMU3](https://plot.ni4ai.org/permalink/PnpvDZpOl).

The stream names look like "L1MAG" or "C3ANG". Here L refers to voltage and C to current, 1-3 refers to the phase, and MAG/ANG refers to if this is a magnitude or an angle stream. Units are either volts or amps for magnitudes or deg for "degrees" for angles. Each uPMU also has an LSTATE stream whose unit is "mask" that describes the state of the PMU over time. After you get started visually exploring the streams in the plotter, we can begin to access the data via Python and the btrdb-python bindings.

### Library Imports

To begin with, let's import all of the libraries we may want to use.

```python
import pandas as pd
from btrdb import connect
from btrdb.utils.timez import *
from tabulate import tabulate
```

The `connect` function will be used to create a handle to our database and the `btrdb.utils.timez` module contains a lot of useful convenience functions for working with datetimes in various formats.

We also import the `tabulate` function which we will use to create nicely formatted reports as well as the pandas library so we can turn the data into a `pandas.Series` object. Note that neither pandas nor tabulate are part of the Python standard library and will need to be installed with `pip` or `conda` to use them.

### Establishing a Connection

As usual when working with BTrDB, we will use the connect function to create a handle to our database.  The `info()` method can be called to verify you are able to communicate with the database.

```python
db = connect("api.ni4ai.org:4411", apikey="XXXXXXXXXXXXXXXXXXXXXX")
db.info()
```

```
{'majorVersion': 5, 'build': '5.7.2', 'proxy': {'proxyEndpoints': []}}
```

### Viewing the Collections

Data streams are organized into a hierarchichal tree of collections, so let's view the collections available for the Sunshine dataset using the `list_collections` method.

```python
db.list_collections("sunshine")
```

```
['sunshine/PMU1', 'sunshine/PMU2', 'sunshine/PMU3', 'sunshine/PMU4', 'sunshine/PMU5', 'sunshine/PMU6']
```

### Choosing Streams

Now let's assume we want to view the data in the `sunshine/PMU3` collection.  We can use the `streams_in_collection()` method to return all of the available streams (or we can use arguments to the method to return only specific streams).

```python
streams = db.streams_in_collection('sunshine/PMU3')
streams
```
```
[<Stream collection=sunshine/PMU3 name=C2ANG>, <Stream collection=sunshine/PMU3 name=C3MAG>, <Stream collection=sunshine/PMU3 name=L1ANG>, <Stream collection=sunshine/PMU3 name=C2MAG>, <Stream collection=sunshine/PMU3 name=C1ANG>, <Stream collection=sunshine/PMU3 name=L2ANG>, <Stream collection=sunshine/PMU3 name=L1MAG>, <Stream collection=sunshine/PMU3 name=C3ANG>, <Stream collection=sunshine/PMU3 name=C1MAG>, <Stream collection=sunshine/PMU3 name=L3ANG>, <Stream collection=sunshine/PMU3 name=L2MAG>, <Stream collection=sunshine/PMU3 name=L3MAG>, <Stream collection=sunshine/PMU3 name=LSTATE>]
```

This provides a nice array of [Stream](https://btrdb.readthedocs.io/en/latest/api/streams.html) objects.  Just for display purposes, let's use the `tabulate` function to view formatted details about each stream.

```python
def describe_streams(streams):
    table = [["Index", "Collection", "Name", "Units", "UUID"]]
    for idx, stream in enumerate(streams):
        tags = stream.tags()
        table.append([
            idx, stream.collection, stream.name, tags["unit"], stream.uuid
        ])
    return tabulate(table, headers="firstrow")

print(describe_streams(streams))
```

```
  Index  Collection     Name    Units    UUID
-------  -------------  ------  -------  ------------------------------------
      0  sunshine/PMU3  C2ANG   deg      c71f34d1-3cba-4959-b4b9-032ec078c66d
      1  sunshine/PMU3  C3MAG   amps     cd6d2be2-6b7b-4c46-be1e-8432990ef23c
      2  sunshine/PMU3  L1ANG   deg      bc73226c-c877-438a-ab37-7a6703cbfbce
      3  sunshine/PMU3  C2MAG   amps     47da9f9a-f8d9-4955-9e87-9c17dabde298
      4  sunshine/PMU3  C1ANG   deg      bc9d458c-9b54-4ad2-b837-53170a4d7331
      5  sunshine/PMU3  L2ANG   deg      f4b400e1-26f4-4ca9-b301-c2fbb7d77e87
      6  sunshine/PMU3  L1MAG   volts    0295f80f-6776-4384-b563-4582f7256600
      7  sunshine/PMU3  C3ANG   deg      b3ca2159-8fa7-4341-801d-d1228af675b7
      8  sunshine/PMU3  C1MAG   amps     1e641edc-d95a-494f-99f3-cbb991ef05bf
      9  sunshine/PMU3  L3ANG   deg      fabd1511-f6f8-4670-b336-7fbfe412e4a2
     10  sunshine/PMU3  L2MAG   volts    38d62795-6341-4069-96d3-fe74bffcac67
     11  sunshine/PMU3  L3MAG   volts    37539589-88aa-48b7-8cb4-1ea2f32c9e8d
     12  sunshine/PMU3  LSTATE  mask     b50e8372-6a6e-405a-a366-832f4c9b98f0
```

### Retrieving Stream Data

Now let's imagine we'd like to view some of the data in the `L1MAG` stream.  We can query for the the raw values using the Stream object's `values()` method and send in the start and end times for the query.  BTrDB naturally works at nanosecond precision (one billionth of a second or 10<sup>-9</sup>) so it will always ask for times in [epoch](https://en.wikipedia.org/wiki/Unix_time) nanoseconds.  However we don't have to convert datetime objects to nanoseconds manually as the `timez` module has the `to_nanoseconds` function that we can use.

```python
start = to_nanoseconds('2015-08-15 3:42:00')
end = to_nanoseconds('2015-08-15 3:47:00')
```

Now let's get the values from that Stream.

```python
s = streams[6]
data = s.values(start, end)
data[:2]
```

```
[(RawPoint(1439610120008333333, 7301.33935546875), 122091), (RawPoint(1439610120016666666, 7301.66796875), 122091)]
```

We can see that this method returns a list of tuples.  Each tuple contains a `RawPoint` as well as the version number of the stream at this time.  As a reminder, the data in each BTrDB stream is versioned and by querying for data without specifying an explicit version we were given the latest version at this time.

Each `RawPoint` is similar to a Python namedtuple and so we can easily split out its two properties: `time` and `value`.  In the code below we will split out the points and discard the version data, then split each RawPoint into an array of times and an array of values.  Finally we will create a new pandas `Series` using these two arrays.

```python
points, _ = zip(*data)
times, values = zip(*points)
series = pd.Series(values, index=times)
```

```
1439610120008333333    7301.339355
1439610120016666666    7301.667969
1439610120024999999    7302.258789
1439610120033333332    7302.352539
1439610120041666665    7302.297852
                          ...
1439610419966666628    7288.075195
1439610419974999961    7288.063965
1439610419983333294    7288.255859
1439610419991666627    7288.071777
1439610419999999960    7287.898438
Length: 36000, dtype: float64
```

### Visualizing the Data

Now that we're in a pandas Series object, we can use our familiar `plot()` method to visualize the data.

```python
series.plot()
```

![basic visualization](/assets/images/post/sunshine-data/sunshine-plot-1.png)


Of course, we can always pull in the `matplotlib` library to get more fine grained control over our visualization.

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

fig, ax = plt.subplots(figsize=(7,5))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M:%S'))
fig.autofmt_xdate()

ax.plot(pd.to_datetime(series.index), series.values, label="values")
ax.axhline(series.mean(), label="mean", c="m")
ax.set_ylabel("volts")
ax.set_xlabel("time")
ax.legend()

plt.title("Sunshine PMU3 L1MAG Voltage")
plt.show()
```

![improved visualization](/assets/images/post/sunshine-data/sunshine-plot-2.png)

## Wrapping It Up

We've seen how we can view collections, streams, and data but there is much more you can do with BTrDB and Python!  Check out our [tutorials and walkthroughs](https://btrdb.readthedocs.io/en/latest/working.html) to see more. In upcoming posts we'll discuss how to perform standard power engineering computations on these streams using Python and the bindings to query data directly from the platform.
