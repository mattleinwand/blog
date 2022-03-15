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

Further investigation showed that other sensors on WECC did not report the same deviation.
Changes in frequency, however, typically are not local events!
This suggested to us that we might be dealing with bad data.
What we need now is a good way to figure it out.

## Physical intuition saves the day
Transient events such as faults or switching can cause the voltage or current to change on very short timescales -- e.g., less than a cycle. This can cause phasors to become untrustworthy. 
Using physical intuition, we can begin to judge whether what we’re seeing in the data is accurate. 

Changes in frequency happen due to magnetic coupling between synchronous generators and the grid.
When the load (or generation) on the system changes, this magnetic coupling causes synchronous generators to speed up or slow down. 
But these generators have a great deal of rotating inertia which prevents them from starting or stopping instantaneously. 
While voltage and current may change instantaneously due to faults, switching, or other events -- the frequency of the grid tends to change much more gradually as generators speed up and slow down.

Another thing to consider is the geographic extent of the disturbance. 
Frequency deviations tend to affect large geographic areas, whereas voltage events can be much more localized. 
Data shared by the Texas Synchrophasor Network indicated that their sensors had not witnessed the same frequency event, raising the flag that this could be bad data.

## Do it yourself
We saw the voltage sag on a sensor collection called “ni4ai/weld” on September 07, 2020 just before 12:37 AM (UTC). We acquired data for a second sensor on WECC called “/texas_pmus/whitesands” during the same period in time. 

Your challenge is to look for similarities and differences in voltage measurements and in the frequency reported at the two locations. Can you detect times when the data quality is suspect? Can you pick up on any events that were primarily local, or on events that affected a wider area of the grid?

## Want to learn more?
This post was inspired by a panel discussion about grid frequency delivered at the NASPI working group meeting in April, 2020. 

[https://www.naspi.org/node/823](https://www.naspi.org/node/823).


