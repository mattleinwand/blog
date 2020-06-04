---
title: "Basic Power Engineering Computations"
date: 2020-06-04T08:20:17-0400
description: "Getting started on the analysis of three phase power with Python."
tags: ["power engineering", "Python", "timeseries", "complex power"]
---

## Stream Selection and Data

The first step with any power engineering computation is to identify the target streams and PMUs for your analysis. This blog post will focus on the analytics for a single PMU, `sunshine/PMU6` and will require all three phases of power of both voltage and current. For demonstration purposes we will query the data into a time indexed data frame with column labels that will help us easily identify each stream.

```python
import btrdb
from tabulate import tabulate
from btrdb.utils.timez import ns_to_datetime


# Connect to the database
db = btrdb.compute("api.ni4ai.org:4411", APIKEY)
db.info()


def stream_info(streams):
    table = [["Name", "Unit", "location", "latest", "version"]]
    for stream in streams:
        tags = stream.tags()
        meta, _ = stream.annotations()
        latest, version  = stream.latest()
        table.append([
            tags["name"],
            tags["unit"],
            meta.get("location"),
            ns_to_datetime(latest.time),
            version,
        ])

    print(tabulate(table, headers="firstrow", tablefmt="simple"))


stream_info(db.streams_in_collection("sunshine/PMU6"))
```

```
Name    Unit    location    latest                              version
------  ------  ----------  --------------------------------  ---------
C3ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
L2ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
C1ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
L2MAG   volts   building    2016-05-31 23:53:50.333333+00:00      18999
L3MAG   volts   building    2016-05-31 23:53:50.333333+00:00      18999
L1ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
C3MAG   amps    building    2016-05-31 23:53:50.333333+00:00      18999
L1MAG   volts   building    2016-05-31 23:53:50.333333+00:00      18999
C1MAG   amps    building    2016-05-31 23:53:50.333333+00:00      18999
L3ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
C2MAG   amps    building    2016-05-31 23:53:50.333333+00:00      18999
C2ANG   deg     building    2016-05-31 23:53:50.333333+00:00      18999
LSTATE  mask                2016-05-31 23:53:50.333333+00:00      18999
```

Now that we've identified the streams that we need want to work with, we can query a sample of the data into a time-indexed data frame as follows:

```python
def get_data(streams, start, end, version=0):
    series = []
    for stream in streams:
        times, values = [], []
        points, _ = zip(*stream.values(start, end, version))
        for point in points:
            times.append(np.datetime64(point.time, "[ns]"))
            values.append(point.value)

        series.append(pd.Series(values, index=times, name=stream.tags()["name"]))

    return pd.concat(series, axis=1)


streams = [
  s for s in db.streams_in_collection("sunshine/PMU6")
  if s.tags()["name"] != "LSTATE"
]
df = get_data(streams, "2016-05-31 15:05:00", "2016-05-31 15:06:00")
df.head()
```

![DataFrame](/media/post/2020-06-04-basic-power-engineering-computations/dataframe.png)