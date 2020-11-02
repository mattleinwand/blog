---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/data-quality/brownout.png'
tags:
- do-it-yourself
title: Do it yourself - Data quality assessment
author: ni4ai
---

Synchrophasors measure voltage and current waveforms, and represent these waveforms in polar coordinates -- or phasors.

These polar coordinates come from fitting a sinusoidal curve to current and voltage waveform measurements.
But transients, harmonics, faults, and other conditions on the grid can cause waveforms to become non-sinusoidal. 
When these deviations are large enough, the phasor representation breaks down.

## See it in the data
On September 6, one our sensors reported a voltage sag and a frequency deviation of about 1.5 Hz.
Further investigation showed that other sensors on WECC did not report the same frequency deviation.
Changes in frequency, however, typically are not local events.
This suggests that the reported deviation could be an artifact of the data.

## Physical intuition saves the day
Transient events such as faults or switching can cause the voltage or current to change on very short timescales -- e.g., less than a cycle. This can cause phasors to become untrustworthy. 
Physical intuition, however, can help us to judge whether what we’re seeing in the data is accurate. 
Looking at changes in quantities like frequency can provide more context about data quality. 

A change in frequency indicates that rotating generators are speeding up or slowing down. But generators have rotating inertia which prevents them from starting or stopping instantaneously. Unlike voltage and current, changes in frequency don’t tend to happen instantaneously. 

Another thing to consider is the geographic extent of the disturbance. Frequency deviations typically affect large geographic areas, whereas voltage events can be much more localized. If two PMUs in different areas of the grid report very different frequencies at the same moment in time, this could be indicative of bad data quality.

## Do it yourself
We saw the voltage sag on a sensor collection called “ni4ai/weld” on September 07, 2020 just before 12:37 AM (UTC). We acquired data for a second sensor on WECC called “/texas_pmus/whitesands” during the same period in time. 

Your challenge is to look for similarities and differences in voltage measurements and in the frequency reported at the two locations. Can you detect times when the data quality is suspect? Can you pick up on any events that were primarily local, or on events that affected a wider area of the grid?

## Want to learn more?
This post was inspired by a panel discussion about grid frequency delivered at the NASPI working group meeting in April, 2020. 

[https://www.naspi.org/node/823](https://www.naspi.org/node/823).


