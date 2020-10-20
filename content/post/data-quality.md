---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/frequency-filters/imbalance.png'
tags:
- ni4ai-community
- do-it-yourself
title: Do it yourself - Data quality assessment
author: ni4ai
---

Synchrophasors measure voltage and current waveforms and reported a “compressed” representation of these waveforms using polar coordinates. 

This change in coordinates is founded on the premise that waveforms are approximately sinusoidal. But in practice, this is not always the case! Transients, harmonics, faults, and other conditions on the grid can cause waveforms to deviate from sinusoids. When these deviations are large enough, the phasor representation breaks down.

This issue came to our attention when one of our sensors experienced a voltage sag on September 6. We found out about it because the sensor host reported a brownout. The data show a frequency deviation of about XX Hz that coincided with the event, and we started asking around to see if others had witnessed the event. Experts in phasor measurements called into question the quality of the phasors.

## Physical intuition saves the day
Transient events such as faults or switching can cause the voltage or current on very short timescales -- e.g., less than a cycle. This can cause phasors to report untrustworthy data, but physical intuition can help us to judge whether what we’re seeing is accurate. Looking at changes in quantities derived from phasors -- such as frequency -- can provide more context to suggest if and where the data are bad. 

Unlike voltage and current, changes in frequency don’t tend to happen instantaneously. A change in frequency indicates that rotating generators are speeding up or slowing down. These generators have a lot of inertia which prevents them from starting or stopping instantaneously.

Another thing to consider is the geographic extent of the disturbance. Frequency deviations typically affect large geographic areas, whereas voltage events can be much more localized. If two PMUs in different areas of the grid report very different frequencies at the same moment in time, this could be indicative of bad data quality.

## Do it yourself
We saw the voltage sag on a sensor collection called “ni4ai/weld” on September 07, 2020 just before 12:37 AM (UTC). We acquired data for a second sensor on WECC called “/lndunn/texas_pmus/whitesands” during the same period in time. 

Your challenge is to look for similarities and differences in voltage measurements and in the frequency reported at the two locations. Can you detect times when the data quality is suspect? Can you pick up on any events that were primarily local, or on events that affected a wider area of the grid?
Want to learn more?
This post was inspired by a panel discussion about grid frequency delivered at the NASPI working group meeting in April, 2020. Here’s a link to the talk.

https://www.naspi.org/node/823 
