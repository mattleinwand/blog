---
title: "Visualize State of the Grid Using Mosaic Plot"
date: 2020-04-27T00:02:12-0700
description: "How to Visualize State of the Grid Using Mosaic Plot"
tags: ["btrdb", "python","plot","mosaic plot","analytics", "visualization"]
author: "brice"
---

Since the grid is interconnected, there may be value in analysing PMU streams data in association with the location of the PMUs if available.

A Pseudo Geographic Mosaic Plot [1] can be used to display the effects of an event detected on a PMU, on other PMUs and potentially determine relationships between PMUs based on their location or to just observe the state of the grid at any time.

## The Plot
 
A Pseudo Geographic Mosaic Plot sorts collections of PMUs by latitude, separates the collection in n columns, sorts each column by longitude before plotting each collection as a cell. The area of each cell relates to one unit (i.e VPHM) while the color of the cell relates to another unit (i.e IPHM).
 Thanks to the location based sorting , every cell in a column represents a collection north of the cell below and south of the cell above, while every column is west of the columns on its right and east of the columns on its left. The plot approximates 
A sample Mosaic plot is shown below.

![Sample Mosaic Plot](/media/post/2020-04-27-mosaic-plot/sample_mosaic_plot.png)

## Implementation Using Dominion Streams

In this post we will use the dominion energy grid data to show how a Mosaic plot allows users to aggregate in a single graph data from all the PMUs on the grid and observe the change in the data through time.

In the dominion dataset, PMUs in the same collection share the same coordinates, PMU’s data were therefore aggregated by collection and each cell on the Mosaic plot will therefore represent a collection of PMU. 

The first step is to detect an event on a PMU stream, we selected a stream with a drop in voltage magnitude on november 03 2019 between 05:55AM and 06:05AM using the plotter.

![Sample Mosaic Plot](/media/post/2020-04-27-mosaic-plot/index_event_on_plotter.png)
![Sample Mosaic Plot](/media/post/2020-04-27-mosaic-plot/zoomed_event_on_plotter.png)

We then queried the Berkley Tree Database using stream.aligned_windows, ensuring that the start, end and pointwidth result in windows before,during and after the event occurred on the selected stream (start=”2019-11-03T05:55:0.0”, end=”2019-11-03T06:02:0.0”, pointwidth=35” which corresponds to 30 seconds windows). All streams with voltage phase magnitude and current phase magnitude were queried and aggregated by collection. 

![Sample Mosaic Plot](/media/post/2020-04-27-mosaic-plot/before_during_event.png)

The prior plots show the state of the grid in the window before and during the event. The black rectangle highlights the collection containing the PMU where the event was recorded on the plotter, the blue rectangles represent collections of PMUs that experience a similar drop in voltage and current phase magnitude in the time window of the event.

On the plot, the area of each cell is related to the voltage phase magnitude while the cell color is related to the current phase magnitude of the collection. 

## References

[1] T. J. Overbye, J. Wert, A. Birchfield and J. D. Weber, "Wide-Area Electric Grid Visualization Using Pseudo-Geographic Mosaic Displays," 2019 North American Power Symposium (NAPS), Wichita, KS, USA, 2019, pp. 1-6.

