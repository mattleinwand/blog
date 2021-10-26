---
date: '2021-08-06T01:00:00Z'
description: Visualizing point on wave data with spectrograms
featuredImage: '/assets/images/post/angle-differencing/angle_art.jpeg'
tags: ["btrdb", "python", "angles", "wams", "analytics", "phasors"]

title: Point on Wave Data (Part 2)
author: miles
---


We can also visualize how the spectrum changes in time by computing the spectrogram. After taking a spectrogram, we see

![png](/assets/images/post/point-on-wave-2/fig1.png)


We see the harmonics present in the spectrogram as well.

Additionally, because this data has a high sampling frequency as well as a long time window, we see the frequency domain with a high level of detail. Zooming into the low frequencies we see some interesting features:

![png](/assets/images/post/point-on-wave-2/fig2.png)


Horizontal lines are sustained oscillations, and we see some sustained oscillation at subharmonics 30Hz and 15Hz. Vertical lines are transient events that contain many frequency components over a short amount of time. 
We see pings which are transient events with frequencies centered around 20Hz.
We also see a sustained oscillation that changes its frequency in a seemingly random manner.
Since this data is initially unlabelled, a next step is to identify these different signals in the spectrogram. Having information about devices that may be affecting the local household voltage will help to associate these signals.


## References
[1] Data recorded during on-going U.S. Dept of Energy Project "GridSweep: Frequency Response of Low-Inertial Bulk Grids": 24 hours of GPS-time-stamped 4.3kHz point-on-wave sampling at 29-bit resolution, single-phase 120-volt nominal, recorded at Alex McEachern's residential kitchen in Alameda, California, USA on 2021/05/10 - 2021/05/11.
