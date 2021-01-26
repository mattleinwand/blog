---
title: "What's the angle? (Part 3)"
date: '2020-12-14T01:00:00+0000'
description: "Processing Frequency Data"
tags: ["ni4ai-platform", "analytics"]
featuredImage: '/assets/images/post/symmetrical-components/sym_comps.png'
author: miles
---
On August 16th, 2016, the Blue Cut Fire in Southern California caused a transmission line fault, which in turn caused the grid frequency to drop. This event was recorded by the Western Interconnection Frequency (shown in the figure below) and analyzed by the [North American Reliability Corporation](https://www.nerc.com/Pages/default.aspx) (NERC). In this blog post we will locate this event on the [Sunshine dataset](https://data.world/datasets/sunshine) and compare the event as reported by NERC, and as evidenced in the Sunshine data.

![Figure 1](/assets/images/post/what-is-the-angle-part-3/wecc_event.png)
[https://www.nerc.com/pa/rrm/ea/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_Interruption_Final.pdf](https://www.nerc.com/pa/rrm/ea/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_Interruption_Final.pdf)


This drop in frequency caused solar inverters to trip offline. The solar inverters have a built-in phase-locked loop (PLL) to measure grid frequency and are programmed to automatically disconnect from the grid if the grid frequency is less than or equal to 57 Hz. However, from the reported frequency plot we see that the grid frequency remained above the 57 Hz threshold. The NERC report concludes that the solar inverters tripped offline because their PLLs overestimated the frequency deviation.


![Figure 2](/assets/images/post/what-is-the-angle-part-3/fire_location.png)

To compare how micro-PMUs reported the frequency, let us find the event in the Sunshine dataset. The transmission line fault caused by the Blue Cut fire occurred at 6:45pm (UTC), and we see that the sunshine dataset has PMU data reporting data during this event.



![Figure 3](/assets/images/post/what-is-the-angle-part-3/plotter.png)
