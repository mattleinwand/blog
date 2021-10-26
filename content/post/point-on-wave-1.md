---
date: '2021-08-06T01:00:00Z'
description: Exploring point on wave data using spectral analysis
featuredImage: '/assets/images/post/point-on-wave-2/fig1.png'
tags: ["btrdb", "python", "angles", "wams", "analytics", "phasors"]

title: Point on Wave Data (Part 1)
author: miles
---


PMU phasor data is created from point-on-wave (POW) data, which is the raw voltage waveform of a node on the power grid. Below is a window of POW data from the GridSweep sensor, which has a sampling rate of 4.3kHz, measuring the voltage at a household outlet in Oakland, CA [1]. This means we are measuring the voltage at a node of the distribution grid in that area. This data can be found at POW/GridSweep in the NI4AI database. 

![png](/assets/images/post/point-on-wave-1/fig1.png)

As you can see, raw POW data is visually hard to interpret. One thing we can do is look at its frequency spectrum using the discrete fourier transform (DFT):

![png](/assets/images/post/point-on-wave-1/fig2.png)

From the spectrum, we see most of the signal power at the base frequency of 60Hz, as well as significant power in the odd harmonics at 180Hz, 300Hz, 420Hz, etc.

One thing we can do with point-on-wave data that we cannot do with phasor data is compute the harmonic distortion present in the voltage signal. The total harmonic distortion (THD) compares the power present in the fundamental frequency of 60Hz to the power present in the higher-order harmonics. The formula for THD is as follows: 

$$
THD = \sqrt{\frac{V_2^2 + V_3^2 + V_4^2 + ... + V_n^2}{V_1}}
$$

Where $V_1$, $V_2$, $V_n$ correspond to the 1st, 2nd, and nth harmonic, respectively.

To compute the THD, we need to look at the peaks of the signal’s DFT. To get a more accurate estimate of the peak magnitude, we interpolate between the DFT data points by fitting the data to cubic polynomials, as shown below. This is done using the [spline interpolation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.splrep.html) functions provided by scipy.

![png](/assets/images/post/point-on-wave-1/fig3.png)

The plot above of the 7th harmonic near 420Hz illustrates that the true maximum frequency lies somewhere between the discrete frequencies computed by the DFT. Using an interpolation allows us to get a closer estimate of the maximum. In this way, we find the 7th harmonic, $V_7$, of the formula for the THD above.

To compute the THD, we find the maximum amplitude for each harmonic in the spectrum. Computing the THD this way, we get the following value:

```python
THD = 0.038
```

Which means the total power in the harmonics are 3.8% of the power of the fundamental frequency of 60Hz.
