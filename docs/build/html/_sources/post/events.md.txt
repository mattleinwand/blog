---
date: '2020-12-01T14:00:00+0000'
description: Anonymized event snapshots to study wide area dynamics
featuredImage: '/assets/images/post/data-quality/brownout.png'
tags:
- ni4ai-data
title: About the "events" data collection
author: ni4ai
---

The "events" collection includes measurement data recorded by transmission PMUs during various events on the transmission grid. 

These data have been anonymized by removing details about the geography of the sensors or the assets they're connected to. We've changed the time stamps, so the events themselves can't be identified.

The data can be used to explore signal processing techniques for detecting events and for studying how events propagate across a broad geographic area of the grid.

For each event, the data includes two minutes of PMU measurements recorded across 23 sensors. The sensors report three-phase voltage and current at each measurement node. The data set includes two switching events and an oscillation.
