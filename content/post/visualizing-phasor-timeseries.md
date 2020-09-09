---
title: Visualizing Phasor Timeseries with matplotlib
date: 2020-04-25T07:45:15-0400
description: How to discover voltage sags with efficient BTrDB queries
featuredImage: '/assets/images/post/visualizing-phasor-timeseries/gallery.png'
tags: ["explainers", "visualization", "use-cases", "sunshine-data"]
author: ben
---

![Gallery](/assets/images/post/visualizing-phasor-timeseries/gallery.png)

A _phasor_ is a complex number that represents a sinusoidal function by decomposing points in the sine wave into the product of a complex constant (the phasor) and a factor that encapsulates frequency. Phasors are often used in power and electrical engineering because electricity generation involves rotating copper windings which creates a sine waveform that can be measured in electricity transmission. Moreover, multi-phase power creates multiple sine waves with the same frequency, but different amplitudes and phases. As a result, power engineering computations can be transformed into algebraic equations rather than a system of differential equations by dropping the shared frequency factor.

Phasors are often described by their polar coordinates, the magnitude and an angle of the vector from the origin to the point in the sine wave. Phasor measurement units (PMUs) sample the phasor of electrical transmission at a constant rate (usually between 30Hz and 240Hz) creating two time series streams for the magnitude and angle per observation. PMUs that measure three phase power create these two streams for both voltage and current samples across all three phases, generating 12 total time series streams. Synchrophasors are time-synchronized PMUs that ensure the sampling across different busses (e.g. at two ends of a line) happen at the same time, usually via GPS timestamps.

The analytics challenge for handling this data is that modeling is not necessarily made simpler in the complex form, particularly as multiple independent series of data ends up being represented multi-dimensionally in a data frame. This post tackles one of those challenges: how do we effectively visualize timeseries of phasors in order to better understand the domain we're working in and create intuitive visual analytics?

## Stream Selection

In this post we will work with the [sunshine dataset](/post/2020-03-30-sunshine-data/), focusing on a minutes worth of data from the phase 1 current of PMU1:

```python
%matplotlib notebook

import btrdb
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from btrdb.utils.timez import ns_delta, ns_to_datetime

db = btrdb.connect("api.ni4ai.org:4411", apikey="[YOURAPIKEYHERE]")

# Query Range
START = "2016-09-20 17:26:47.020667Z"
END = "2016-09-20 17:27:47.687080Z"

# Current Phasor
C1ANG = "d625793b-721f-46e2-8b8c-18f882366eeb"
C1MAG = "1187af71-2d54-49d4-9027-bae5d23c4bda"

# View dataset
streams = db.streams(C1MAG, C1ANG)
streams.filter(start=START, end=END).to_dataframe().head()
```

|                time |   sunshine/PMU1/C1MAG |   sunshine/PMU1/C1ANG |
|--------------------:|----------------------:|----------------------:|
| 1474392407024999999 |               117.84  |               212.306 |
| 1474392407033333332 |               117.865 |               212.437 |
| 1474392407041666665 |               117.812 |               212.549 |
| 1474392407049999998 |               117.816 |               212.574 |
| 1474392407058333331 |               117.874 |               212.558 |


We're going to do a bit of data wrangling to get this data frame into a form that will be simpler to use, parsing the timestamps and renaming the columns to "amps" and "deg" so that it will be easier to access our phasor components. We will therefore directly query the database and create our own data frame rather than relying on the stream set:

```python
def get_phasor_timeseries(mag_uuid, ang_uuid, start=START, end=END):
    mag = db.stream_from_uuid(mag_uuid)
    ang = db.stream_from_uuid(ang_uuid)

    # Create time series
    series = []
    for stream in (mag, ang):
        points, _ = zip(*stream.values(start, end))
        times, values = [], []

        for point in points:
            times.append(np.datetime64(point.time, "ns"))
            values.append(point.value)

        units = stream.tags()["unit"]
        series.append(pd.Series(values, index=times, name=units))

    return pd.concat(series, axis=1)


df = get_phasor_timeseries(C1MAG, C1ANG)
df.head()
```

|                               |    amps |     deg |
|:------------------------------|--------:|--------:|
| 2016-09-20 17:26:47.024999999 | 117.84  | 212.306 |
| 2016-09-20 17:26:47.033333332 | 117.865 | 212.437 |
| 2016-09-20 17:26:47.041666665 | 117.812 | 212.549 |
| 2016-09-20 17:26:47.049999998 | 117.816 | 212.574 |
| 2016-09-20 17:26:47.058333331 | 117.874 | 212.558 |

## Polar Plots

Our first step will be to directly visualize our magnitudes and angles using the matplotlib polar plot, which takes an array `theta`, our angles (in either degrees or radians) and an array `r`, our magnitudes. The challenge is representing time in a 2-dimensional plot, since time is essentially our third dimension. There are multiple ways to accomplish this using line thicknesses, directional arrows, etc. In this case, I've chosen to use color to represent time, where lighter yellow colors represent older points and darker blue points represent new points. The code to produce the plot is as follows:

```python
def plot_polar(mag, ang):
    fig = plt.figure(figsize=(9,6))
    ax = fig.add_subplot(projection='polar')

    # Plot color by time
    times = mag.index.astype(np.int64).values

    cm = plt.get_cmap('cividis_r')
    im = ax.scatter(ang, mag, c=times, cmap=cm, s=10)

    cbar = fig.colorbar(im, ticks=[times[0], times[len(times)//2], times[-1]])
    cbar.ax.set_yticklabels([mag.index[0], mag.index[len(times)//2], mag.index[-1]])

    fig.tight_layout()
    return ax


_ = plot_polar(df["amps"], df["deg"])
```

![Polar Plot](/assets/images/post/visualizing-phasor-timeseries/polar_plot.png)

The polar plot directly draws the points from the sine wave where the angle determines the position of the point around the circle, and the magnitude represents the distance of the point from the origin. The points travel in circles that represent the sine wave and the variability in the distance from the origin shows us the variability of the current over time. This plot can also be used to show the offset between different phases and detect if there are phase shifts that could indicate equipment problems.

## Plotting Complex Numbers

The polar plot allows us to directly visualize our PMU data, but the plot is cluttered since it will always only draw circles. To detect variations or changes of interest, or to compare multiple streams, it is useful to visualize the phasors in their rectangular, rather than polar form.

To do this, we first need to convert the PMU data to their complex representation:

```python
def to_complex(mag, ang, is_degrees=True, name=None):
    if is_degrees:
        ang = np.radians(ang)

    r = mag * np.cos(ang)
    i = mag * np.sin(ang)

    name = name or "complex phasor"
    return pd.Series(r + 1j * i, index=mag.index, name=name)


phasor = to_complex(df["amps"], df["deg"], name="Phase A Current Phasor")
```

This function takes two `pd.Series`, the first for the magnitudes and the second for the angles. It also two takes optional arguments - if `is_degrees` is true, the angles will be converted from degrees to radians and the name can be used to specify the name of the output series, which is useful for visualizations later. The function computes the real component of the complex vector `r` as the product of the magnitude and the cosine of the angle and the imaginary component `i` as the product of the magnitude and the sine of the angle. It then constructs a new `pd.Series` whose dtype is `np.complex128` using the `r + 1j * i` syntax to create complex numbers.

> Note that the time index is maintained for the resulting `pd.Series` and that the name allows us to easily identify the series as we continue processing our data.

Complex numbers are represented by two floating point components, a real and imaginary component. The simplest way to visualize this data is to plot each component on their own axis. We will create a function `extract_real_imaginary` that decomposes the complex number into these component series. However, this takes up both our plotting dimensions, so we once again have to use color to visualize change over time:

```python
def extract_real_imaginary(phasor):
    real = pd.Series(np.real(phasor), index=phasor.index, name="real")
    imag = pd.Series(np.imag(phasor), index=phasor.index, name="imaginary")
    return real, imag


def plot_real_imaginary(phasor):
    fig = plt.figure(figsize=(9,6))
    ax = fig.add_subplot()

    real, imag = extract_real_imaginary(phasor)
    times = phasor.index.astype(np.int64).values

    cm = plt.get_cmap('cividis_r')
    im = ax.scatter(real, imag, c=times, cmap=cm, s=10)

    ax.set_xlabel("real component")
    ax.set_ylabel("imaginary component")

    cbar = fig.colorbar(im, ticks=[times[0], times[len(times)//2], times[-1]])
    cbar.ax.set_yticklabels([phasor.index[0], phasor.index[len(times)//2], phasor.index[-1]])

    fig.tight_layout()
    return ax

_ = plot_real_imaginary(phasor)
```

![Complex Plot](/assets/images/post/visualizing-phasor-timeseries/complex_plot.png)

This plot is certainly very useful for visualizing single complex streams, e.g. a single phase. But what if we want to plot all three phases? In two dimensions, we couldn't use color to differentiate each individual stream, so we'd have to use different marker shapes, but that may be difficult to visualize. Alternatively, we could plot each phase in its own axes and line them up, but again, that might be tough to compare phases. To solve this problem, we can use a 3D plot to plot the real and imaginary components as well as the time component each on their own axes, then use color to represent different phases or streams.


```python
from mpl_toolkits.mplot3d import Axes3D

def plot_real_imaginary_3d(phasor):
    fig = plt.figure(figsize=(9,6))
    ax = fig.add_subplot(projection='3d')

    real, imag = extract_real_imaginary(phasor)
    times = phasor.index.astype(np.int64)

    ax.plot(times, real, imag, label=phasor.name)
    ax.set_ylabel("real component")
    ax.set_zlabel("imaginary component")

    ax.set_xticks([times[0], times[len(times)//2], times[-1]])
    ax.set_xticklabels([phasor.index[0], phasor.index[len(times)//2], phasor.index[-1]])

    ax.legend()
    fig.tight_layout()
    return ax


_ = plot_real_imaginary_3d(phasor)
```

![3D Complex Plot](/assets/images/post/visualizing-phasor-timeseries/3d_complex.png)

Given enough time series data it may be possible to use 3D plots to visualize [voltage sags](/post/2020-04-15-voltage-sags/), angle divergence, changes in impedance, changes in load and demand, variability due to oscillations, or other events on the electric grid that may be useful to detect using machine learning and AI methods.

## Conclusion

Although the phasor is the primary unit of measurement for electricity transmission and distribution, it poses a challenge to data scientists who may not be used to dealing with complex numbers in their modeling and analytical activities. In this post we explored several techniques for visualizing phasor data and demonstrated that even single phasors are multi-dimensional and require slightly more advanced visualization techniques.
