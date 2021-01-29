---
title: "Blue Cut Fire"
date: '2020-12-14T01:00:00+0000'
description: "Investigating grid frequency during an event"
tags: ["ni4ai-platform", "analytics"]
featuredImage: '/assets/images/post/blue-cut-fire/wecc_event.png'
author: miles
---

On August 16th, 2016, the Blue Cut Fire in Southern California caused a transmission line fault, which in turn caused the grid frequency to drop. This event was recorded by the Western Interconnection Frequency (shown in the figure below) and analyzed by the [North American Reliability Corporation](https://www.nerc.com/Pages/default.aspx) (NERC). In this blog post we will locate this event on the [Sunshine dataset](https://data.world/datasets/sunshine) and compare the event as reported by NERC, and as evidenced in the Sunshine data.

![Figure 1](/assets/images/post/blue-cut-fire/wecc_event.png)
[https://www.nerc.com/pa/rrm/ea/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_Interruption_Final.pdf](https://www.nerc.com/pa/rrm/ea/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_/1200_MW_Fault_Induced_Solar_Photovoltaic_Resource_Interruption_Final.pdf)


This drop in frequency caused solar inverters to trip offline. The solar inverters have a built-in phase-locked loop (PLL) to measure grid frequency and are programmed to automatically disconnect from the grid if the grid frequency is less than or equal to 57 Hz. However, from the reported frequency plot we see that the grid frequency remained above the 57 Hz threshold. The NERC report concludes that the solar inverters tripped offline because their PLLs overestimated the frequency deviation.


![Figure 2](/assets/images/post/blue-cut-fire/fire_location.png)

To compare how micro-PMUs reported the frequency, let us find the event in the Sunshine dataset. The transmission line fault caused by the Blue Cut fire occurred at 6:45pm (UTC), and we see that the sunshine dataset has PMU data reporting data during this event.

![Figure 3](/assets/images/post/blue-cut-fire/plotter.png)

## Calculating Frequency from Unwrapped Phase

Parts one and two of this blog post describe how to obtain and unwrap voltage phase data, and how to take a derivative to calculate the voltage frequency vs time.

Below, we show the phase angle and frequency during the event. We can see that the derivative of phase angle changes at around 16:18:45 UTC. The second figure shows a significant spike in frequency at that time.

![Figure 3](/assets/images/post/blue-cut-fire/phase_v_time.png)

![Figure 4](/assets/images/post/blue-cut-fire/frequency_v_time.png)


Zooming in to the event, we see that the frequency drops and then peaks before being restored to nominal. This happens within the span of about 0.1 seconds. 

![Figure 5](/assets/images/post/blue-cut-fire/event_profile.png)

In the real world, primary and secondary frequency response occur on the order of seconds and tens of seconds, respectively. What we are seeing is not the result of droop control, but a transient phenomenon during which the voltage signal does not appear sinusoidal. Therefore, the voltage phase angle and the frequency are ill defined during this transient event.

The short timescale of the event is exacerbated by the fact that the derivative is essentially a high-pass filter: the high-frequency components of the voltage phase signal are amplified by computing a numerical derivative. To get rid of the noise introduced by taking a derivative, we need to apply a low-pass filter to the signal. Below are the results of applying a [moving average filter](https://en.wikipedia.org/wiki/Moving_average) to the frequency using a 0.1 second window and a longer 0.5 second window. 

![Figure 6](/assets/images/post/blue-cut-fire/short_window.png)

![Figure 7](/assets/images/post/blue-cut-fire/long_window.png)

Now our data looks the same as the Western Interconnection Frequency reported by NERC, which provides us an idea of how the raw signal is processed. The frequency is not well defined during rapid disturbance events, but applying a low-pass filter will attenuate the high-frequency artifacts and yield a signal that is less likely to cause solar inverters to needlessly trip offline.


