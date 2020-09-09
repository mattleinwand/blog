---
author: mohini
date: '2020-04-15T00:02:12-0700'
description: How to discover voltage sags with efficient BTrDB queries
featuredImage: '/assets/images/post/voltage-sags/btrdb_sags.png'
tags:
- explainers
- use-cases
- ni4ai-community
- visualization

title: 'Voltage Sag Safari: Exploring Voltage Sags with BTrDB'
---

_Voltage sags_ are significant transient dips in the network voltage, lasting for less than a cycle to several seconds. They can be caused by faults, motor starts, equipment misoperation, or fast reclosing operation of circuit breakers and are relatively common events in distribution and transmission networks. Large, long, or frequent voltage sags can be problematic for utilities, as they can cause sensitive loads to turn off, motors to stall, or solar photovoltaic inverters to trip offline. Load trips can be a serious nuisance, with substantial economic losses particularly for commercial customers. Large numbers of simultaneous inverter trips could lead to broader system instability.

There are also safety implications, as a voltage sag may indicate a momentary fault that was not recognized and cleared by protection systems (also known as a high-impedance fault) — for example, momentary contact between distribution conductors and trees. Such faults can be precursors to even more dangerous conditions, such as wildfire ignition. Distribution PMU measurements, sampled at 120 Hz, give unprecedented visibility of voltage sags, capturing even the small, brief dips that would be invisible in most other measurements. BTrDB then allows us to easily find, extract, and analyze these sags from a large measurement stream to gain system insights.

In this post, we use the simple BTrDB search functions introduced [previously](/post/2020-02-14-btrdb-queries-pt2/) to find voltage sags. We then use Python's wonderful data visualization libraries to visually analyze and discover patterns in the sags and to share our findings. Along the way, we learn some interesting facts about voltage sags!

## Finding Voltage Sags

To find voltage sags, we must recognize them. Large voltage sags are distinctly visible in BTrDB voltage measurements as sharp, long deviations from mostly flat voltage profiles:

![Voltage sags are clearly visible in BTrDB](/assets/images/post/voltage-sags/btrdb_sags.png)

According to one definition, a voltage sag is "a decrease in the rms ac voltage between 0.1 and 0.9 p.u. at the power frequency for a duration of 0.5 cycles to 1 min" [[1]](#references). The magnitude and duration thresholds differ in other definitions. For flexibility, we will define a voltage sag as a drop in voltage below $\tau$, which will generally be some fraction of the nominal voltage, $V_{nom}$. The following function uses an efficient depth first search to find all voltage measurement points below $\tau$, which we term _sag points_. It is a slightly modified version of the DFS function introduced [previously](/post/btrdb-queries-pt2/).

```python
def find_vsags_dfs(
    stream,
    tau,
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
        if window.min <= tau:
            # Get the time range of the current window
            wstart = window.time
            wend = window.time + pw.nanoseconds
            # If we are at a window length of a second, use values
            if pw <= 30:
                points, _ = zip(*stream.values(wstart, wend, version))
            # Otherwise, traverse the stat point children of this node
            else:
                points = find_vsags_dfs(stream, tau, wstart, wend, pw-1, version)
            # Yield all points to the calling function
            for point in points:
                if point.value <= tau:
                    yield point
```

The function `find_vsags_dfs` returns a _generator_ which will output sag points when queried.  We can easily obtain the time series of a voltage sag by applying `find_vsags_dfs` to a stream over a short time period and then querying a window of raw measurements about the first sag point.

```python
sags = find_vsags_dfs(stream, thresh, start=start, end=end)
# Get the first sag point
sag_point = next(sags)
# A utility function which queries a window of data around a point
sag_data = get_event(stream, sag_point[0])
# Plot the results
plt.figure(); plt.plot(sag_data)
plt.title('Sample Voltage Sag')
plt.xlabel('Time Index')
plt.ylabel('Voltage Magnitude')
```
The resulting voltage sag is shown below:

![Example voltage sag](/assets/images/post/voltage-sags/example_sag.png)

## Counting Voltage Sags

The generator returns every sag point, but several of these points will belong to a single voltage sag. We write another function, `sag_survey`, which processes the points returned by the generator to determine the starting time, the duration, and the minimum magnitude of every voltage sag in the time period of interest. We choose 1 s. to be the minimum separation between distinct voltage sags.

```python
def sag_survey(sags, verbose=False, limit=100):
    # Initialize sag information
    starts = []
    durations = []
    magnitudes = []
    # Get the first sag
    sag = safe_next(sags)
    if sag==None:
        print("No voltage sags found.")
    else:
        if verbose: print("Voltage sag found!")
        start, mag = sag
        dur = 0

    count = 0
    while sag:
        sag = safe_next(sags)
        # If we are on the last sag
        if (sag == None) or (count > limit):
            starts.append(start)
            durations.append(dur)
            magnitudes.append(mag)
            sag = None
        else:
            sag_time, sag_value = sag
            # Check if this is a different sag
            # More than 1 s after last sag point
            if sag_time - (start + dur) > 1e9:
                if verbose: print("Voltage sag found!")
                # Save last sag
                starts.append(start)
                durations.append(dur)
                magnitudes.append(mag)
                # Increment sag count
                count += 1
                # Initialize next sag
                start = sag_time
                mag = sag_value
                dur = 0
            # Otherwise update properties of this sag
            else:
                dur = sag_time - start
                mag = min(mag, sag_value)

    return np.array(starts), np.array(durations), np.array(magnitudes)
# A convenience for iterating through a generator
def safe_next(iterable):
    try:
        first = next(iterable)
    except StopIteration:
        return None
    return first
```

Notice the `safe_next` helper function through which we query the sag point generator. The generator will throw a `StopIteration` exception after returning the last sag point. Since we don't know the number of sag points apriori, `safe_next` enables us to properly handle the end of the generator and avoid an exception.

We run `sag_survey` on one month of PMU measurements, choosing a sag threshold of $\tau = 0.99V_{nom}$:

```python
# Choose the stream
stream = streams["35bdb8dc-bf18-4523-85ca-8ebe384bd9b5"]
# Get nominal voltage of stream
vnom = get_mean_value(stream)
# Start and end times of period to study
start = "2016-11-20T00:00:00.000Z"
end = "2016-12-20T00:00:00.000Z"
# Threshold below which data is considered a voltage sag
thresh = 0.99 * vnom
# Find voltage sag data points
sags = find_vsags_dfs(stream, thresh, start=start, end=end)
# Get features of voltage sags
starts, durs, mags = sag_survey(sags, verbose=False)

# Print magnitudes of sags
print(mags)
```

The search is over more than a 150 _million_ points, and runs in 12 _seconds_! It finds seven sags with the following minimium magnitudes:

```python
[6769.92675781 6753.34423828 6851.39550781 6591.23486328 6911.60888672
 6875.84033203 6891.41845703]
```

## Exploring Voltage Sags

Now we are ready to do some exploration. The most basic features of voltage sags are their size and duration. The combination of these features determines the extent of their detrimental impact on sensitive loads [[2]](#references). To understand the size and duration of voltage sags at one location, we use `sag_survey` to search for voltage sags across _three months_ of measurements. We create a scatter plot showing the size and duration of each sag.

```python
# Find voltage sag data points
sags = find_vsags_dfs(stream, thresh, start=start, end=end)
# Get features of voltage sags
starts, durs, mags = sag_survey(sags, verbose=False)
plt.scatter(durs / 1e9, mags / vnom)
plt.title('Size vs. Duration of Voltage Sags')
plt.xlabel('Durations (s.)')
plt.ylabel('Minimum magnitude (V)')
```

![Magnitude and duration of sags over 3 months](/assets/images/post/voltage-sags/size_vs_durs.png)

Smaller, shorter sags form the cluster in the top left corner and are the most frequent. We see that this location doesn't have any large long sags, which would show up as points in the bottom right and be the most problematic.

An interesting result in the literature says that the normalized frequency of sags with magnitude $V$ will be proportional to $\frac{V}{1-V}$. This formula emerges from a highly simplified model of fault induced sags [[3]](#references). To see how well it applies to our empirical data, we transform our scatter plot into a histogram and overlay the appropriately scaled $\frac{V}{1-V}$ curve.

```python
# Plot a histogram of the sag magnitudes
pmags = mags / vnom
plt.hist(pmags, density=True)
# Plot normalized V / (1-V)
x, y = freq_vs_size(0.8, 0.99)
plt.plot(x, y, label = r'$\frac{V}{1-V}$')

# Add keys
plt.legend(fontsize=20)
plt.title('Frequency vs Magnitude of Voltage Sags')
plt.xlabel('Magnitude')
plt.ylabel('Normalized Frequency')
```

![Sag frequency as a function of magnitude](/assets/images/post/voltage-sags/freq_vs_voltage.png)

The fit is pretty good!

An open question in the literature is the impact of distributed generation (DG) on the size and frequency of voltage sags. There is hesitant speculation that DG may mitigate the impacts of sags by supporting the local voltage during a sag [[4]](#references). We can study this question on a dataset of 4 PMU measurements from a system with a PV installation. The measurements are at a common voltage level, but are not all on the same feeder. PMU 1 measures at the coupling point of a large PV array, PMU 3 is at the substation above the PV site, while PMUs 4 and 5 are at a substation some distance away.

![DG impacts on voltage sag](/assets/images/post/voltage-sags/sag_comparison.png)

In the scatter plot, points indicate individual voltage sags, while stars show the average sag magnitude and duration at each PMU. We see that PMU 1, directly at the PV site, has the smallest average sag magnitude. PMU 3, at the substation above the PV site, experiences larger average sags than PMU 1, but still smaller than PMUs 4 or 5. This cursory analysis suggests that the presence of DG may indeed reduce the size of voltage sags, though of course there are a plethora of other factors they may be behind the observed differences.

Voltage sag frequencies can show strong temporal dependences, such as seasonal or weekly patterns [[5]](#references). This reflects the temporal patterns of the underlying causes of the sags. For example, sags due to vegetation contact faults may mostly occur during windy times of year, while sags caused by the operation of certain industrial equipment may occur only on weekdays. We explore any weekly patterns in the voltage sags at PMUs 4 and 5 with the following script:

```python
from btrdb.utils.timez import ns_to_datetime
def get_day_counts(times):
    counts = np.zeros(7)
    for time in times:
        dt = ns_to_datetime(time)
        day = int(dt.weekday())
        counts[day] += 1
    return counts

daysofweek = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']
counts1 = get_day_counts(starts1)
counts2 = get_day_counts(starts2)
plt.figure(figsize=(14, 7))
plt.subplot(1, 2, 1)
plt.bar(daysofweek, counts1, align='center')
plt.title('Sags at PMU 4')
plt.ylabel('Count', fontsize=20)

plt.subplot(1, 2, 2)
plt.bar(daysofweek, counts2, align='center')
plt.title('Sags at PMU 5')
```

Notice in this script we use the `ns_to_datetime` function from `btrdb.utils.timez`. BTrDB deals in nanoseconds and returns timestamps as _nanoseconds since the epoch_. `btrdb.utils.timez`, documented [here](https://btrdb.readthedocs.io/en/latest/api/utils-timez.html), contains helpful functions to convert between these nanosecond timestamps and more human-friendly ones. The `ns_to_datetime` function returns a Python `datetime` object with many useful properties, which you can explore [here](https://docs.python.org/3/library/datetime.html).

After running this script on several months of data with $\tau = 0.98V_{nom}$, we obtain the following bar plots.

![sag frequency by day of week](/assets/images/post/voltage-sags/sags_by_day.png)

Note that our choice of $\tau$ is high, so many of these sags will be small. Yet certain days dominate in the occurrence of sags. Other explorations would be necessary to determine why this is so.


## References

[1] Milanovic, J. V., Aung, M. T., & Gupta, C. P. (2005). The influence of fault distribution on stochastic prediction of voltage sags. IEEE Transactions on Power Delivery, 20(1), 278-285.

[2] Shen, C. C., & Lu, C. N. (2007). A voltage sag index considering compatibility between equipment and supply. IEEE Transactions on Power Delivery, 22(2), 996-1002.

[3] Bollen, M. H. (1996). Voltage sags: effects, mitigation and prediction. Power Engineering Journal, 10(3), 129-135.

[4] McDermott, T. E., & Dugan, R. C. (2002, May). Distributed generation impact on reliability and power quality indices. In 2002 Rural Electric Power Conference. Papers Presented at the 46th Annual Conference (Cat. No. 02CH37360) (pp. D3-1). IEEE.

[5]Herath, H. C., & McHardy, S. (2008, October). Power quality trends in energy Australia distribution network. In 2008 13th International Conference on Harmonics and Quality of Power (pp. 1-6). IEEE.
