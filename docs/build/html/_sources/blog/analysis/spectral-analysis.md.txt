# Spectral Analysis (part 1)
> Author: Miles Rusch
> 
> April 26, 2021
> 
> This post describes the use of spectral analysis to detect oscillations occurring at different frequencies on the grid.
---

As power electronic converters replace synchronous generators, the dynamics of the power grid are beginning to change. These changes are driven both by the controllers themselves, and by a decline in grid inertia which makes the system more responsive to events that would otherwise be subtle or short-lived.

Acute oscillations can become unstable which can lead to outages or damage to grid assets. Chronic low-level oscillations may also occur. These can lead to persistent stress on grid components and may undermine the ability of power electronic controllers to perform design functions. Under appropriate conditions, chronic oscillations may also become unstable. These low-level chronic oscillations can be challenging to detect visually in time series data, as the frequency or magnitude may be much less than other events present in the data.

This blog post describes how to generate and interpret a spectrogram, a powerful visualization tool for revealing periodic signals present in time series data streams.

The spectrogram is derived by taking the fourier transform at different points in time. The Fourier transform of a time-series signal reveals the frequencies present in the signal. Taking the Fourier transform at different points in time can shed light on when different frequencies are and are not present. Oscillations can appear in any data stream -- including voltage, current, power, or frequency.

The figure below shows an example of two temporary oscillations (or wavelets) that fade in and out at different points in time. Oscillations are often referred to as “frequency modes”, characterized by the frequency of the signal at times when the oscillation is present.

![](spectral-analysis/time-series.png)

Below is the power spectral density (PSD) of the data, which is related to the Fourier transform. The PSD is a measure of how the power of the signal is distributed over a range of frequencies[1]. The PSD plot below shows that there are two frequencies present in the signal (known as frequency modes). However, it does not tell us if or how the magnitude of each frequency mode changes with time.

![](spectral-analysis/voltage-psd.png)

The spectrogram below is derived by taking the Fourier transform across discrete time intervals. The color scale depicts the magnitude (or power density) of the signal in each frequency band (y-axis) as a function of time (x-axis). Below, the spectrogram of the two wavelets shows the separation of the two oscillation modes with respect to both frequency and time.

![](spectral-analysis/voltage-spectrogram.png)

The spectrogram allows us to visually determine if, when, and at what frequencies oscillations are present. Purple indicates time intervals and frequencies where there are no oscillations present. Visual examination reveals several observations about the oscillations present in the data:

-   At about t=0 seconds, we see a 1Hz oscillation mode begin to appear
-   The 1Hz mode reaches its peak power density at about t=15 seconds before fading back out; by t=25 seconds the oscillation mode is gone.
-   The 3Hz oscillation mode begins to appear at a little before t=30 seconds, peaks at about t=35 seconds and disappears by t=45 seconds.
-   There is more power in the 1Hz mode than the 3Hz mode because in the time domain, the amplitude of the 1Hz mode is greater than the amplitude of the 3Hz mode

### References
1. Stoica, P. and R. Moses. “Spectral Analysis Of Signals.” (2005).
