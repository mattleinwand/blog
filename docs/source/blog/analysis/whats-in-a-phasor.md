# What is a Phasor?
*Author: Miles Rusch*

In an ideal world, voltages and currents on the grid are perfect sinusoids, oscillating at a frequency of 60Hz. In practice, any minute imbalance between generation and load causes the frequency of the grid to change. This means that waveforms may deviate slightly from 60Hz. Conventional generators speed up or slow down to compensate for these fluctuations. In a grid dominated by devices -- such as batteries, solar panels, and wind turbines -- that cannot just speed up to slow to adjust their power output, waveform measurement is vital to quickly detecting and correcting frequency deviations.

  

Yet the amount of data needed to capture all of these deviations is immense. Sensors designed to capture sub-cycle dynamics often record measurements at a rate of 256 samples per second or even faster. With millions of nodes, streaming and storing measurements at such a rate simply would not be feasible. The cost to store such data would also be immense.

  

A solution that’s often employed is to stream continuous real-time data, but to do so using compressed representations of waveforms rather than streaming raw waveform data itself. Waveforms are represented as [phasors](https://en.wikipedia.org/wiki/Phasor), or vector projections in the complex plane. Consider the equation for voltage:

  

$v(t) = v_{max} sin(\omega t + \phi)$

  
Phasors approximate sinusoidal waveforms by making the assumption that the magnitude ($v_{max}$), frequency ($\omega$), and phase angle ($\phi$) are fixed. Phasor measurement units (or PMUs) compute phasors by fitting a sinusoid to raw measurement data, and report the result 30, 60, or 120 times per second. While the [IEEE Standard for Synchrophasor Measurements for Power Systems](https://ieeexplore.ieee.org/document/6111219) provide requirements for minimum error of measured phasor parameters, standards notably lack any kind of guidance on how to compute the phasor itself [1]. In fact, methods tend to be proprietary, which means that best practices for computing phasors are not well established. See the references below for some academic papers detailing phasor estimation techniques.

### References

[1] S. Schuster, S. Scheiblhofer and A. Stelzer, "The Influence of Windowing on Bias and Variance of DFT-Based Frequency and Phase Estimation," in IEEE Transactions on Instrumentation and Measurement, vol. 58, no. 6, pp. 1975-1990, June 2009, doi: 10.1109/TIM.2008.2006131.

[2] D. Agrez, "Weighted multipoint interpolated DFT to improve amplitude estimation of multifrequency signal," in IEEE Transactions on Instrumentation and Measurement, vol. 51, no. 2, pp. 287-292, April 2002, doi: 10.1109/19.997826.