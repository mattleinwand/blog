# Power Factor Analysis
> Author: Mohini Bariya
> 
> Date: June 20, 2021
> 
> This blog post describes how to calculate power factors from phasor data.
---

## Complex Power & Power Factor
In ac electric power systems, voltages and currents oscillate sinusoidally, at equal frequencies but with possibly differing phase shifts. Their common frequency is the grid frequency---everywhere either 50 or 60 Hz---which originates from the rotational frequency of turbines at large generators. The phase shift of these signals is also termed their _angle_, in reference to its representation in the phasor domain (for more on the phasor representation of oscillating signals in ac grids, read [this blog post](https://blog.ni4ai.org/post/2020-07-30-what-is-the-angle/)).  

Fig. 1 shows an example voltage and current waveform with a  non-zero phase shift between them, conspicuous in the misaligned peaks and troughs. Fig. 2 shows the same waveforms represented as phasors, where the explicit time domain is jettisoned and only the two free parameters---amplitude and angle---are retained. In the phasor domain, the phase shift between voltage and current is even more visually pronounced: it is the angular gap between the two vectors in complex plane. 

![Figure 1](power_factor/voltage_current_example.png)
Figure 1: Examples of an ac voltage and current waveform
![Figure 2](power_factor/voltage_current_example_phasor.png)
Figure 2: The ac voltage and current of Fig. 1 represented in the phasor domain

Instantaneous power is the product of voltage and current at each moment in time. Taking the product of the voltage and current waveforms in Fig. 1, we obtain the instantaneous power waveform in Fig. 3. This quantity also oscillates, but at twice the system frequency. Note too that, unlike voltage and current, the instantaneous power waveform is asymmetric about the x-axis. 

![Figure 3](power_factor/inst_power_example.png)
Figure 3: The instantaneous power resulting from the ac voltage and current of Fig. 1.

In fact, this asymmetric signal can always be decomposed into two components obeying strict criteria. The real power component remains on one side of the x-axis: everywhere either positive or negative.  Over one full cycle, this component must have a non-zero mean and a non-zero integral. The reactive power component is symmetric about the x-axis, resulting in a mean and integral of zero over one cycle. The relative presence of the real and reactive components---quantified by their amplitude---hinges on the angle separation between the original voltage and current waveforms. We denote this angle separation $\theta$. When $\theta = 0$, voltage and current are perfectly in phase and only the real power component is present, with reactive power uniformly zero. At the other extreme, when $\theta = 90^o$, only reactive power is present. 

Fig. 4 visualizes the real and reactive power decomposition. Each row considers a different $\theta$ value. The voltage and current waveforms are show in the plots at left. The corresponding instantaneous power is show at right, alongside the constituent real and reactive components. 

![Figure 4](power_factor/complex_power_decomp.png)
Figure 4: A comparison of the relative presence of real and reactive power for different angle separations between voltage and current.

What is the physical interpretation of real and reactive power? Energy, which is the consequential quantity in that it enables the execution of useful work, is the integral of power over time. This means that over a full cycle, while the real power component leads to energy transfer, the reactive power component transfers no energy. Instead, reactive power swings back and forth through the system, transferring energy from one place to another... and then back again, leading to no net energy transfer over a cycle. This moving energy is temporarily stored in electric or magnetic fields, before being returned. In practical systems, reactive power is worse than ineffectual: while it does no useful work, by flowing through lines with non-zero resistance, it does contribute to loading and wasted heat. Real power is denoted $P$ and measured in _watts_, while reactive power is denoted $Q$ and measured in _vars_ (Fig. 5).
 
 ![Figure 5](power_factor/p_vs_q.png)

 Figure 5: Real ($P$) and reactive ($Q$) power personified in two paintings. Credits: (left) [Diana Dean](http://dianadean.com/woman-pushing-rock-uphill/) and (right) [Jean-Honore Fragonard](https://en.wikipedia.org/wiki/Jean-Honor%C3%A9_Fragonard)

As mentioned, $\theta$, the angle between voltage and current, is the defining quantity in determining the relative prevalence of real and reactive power. We have been visualizing instantaneous, real, and reactive power in the time domain, but, like voltage and current they can be represented as phasors and drawn in the complex plane, as shown in Fig. 6. $S$ is the instantaneous (also called complex) power vector, which can be decomposed into a real component (the real power $P$) and an imaginary component (the reactive power $Q$).  The lengths of these component vectors reflects the amplitude of the real and reactive waveforms in the time domain. $\theta$ is the angle $S$ makes with the x-axis, which provides another way to intuit its critical role in deciding the balance of $P$ and $Q$.

![Figure 6](power_factor/complex_power_phasor.png)
Figure 6: Complex ($S$), real ($P$), and reactive ($Q$) power visualized as phasors in the complex plane, with critical angle $\theta$ marked.

Another way to express the relative presence of $P$ and $Q$ is in terms of the power factor, a unit-less quantity denoted $pf$ and defined as: 

$$
pf = \cos \theta = \frac{P}{S}
$$

It is common to record the power factor of a load or set of loads, to indicate the relative amounts of real and reactive power they draw. Utilities are also interested in the power factor. For example, for a given distribution network, a utility would like the power factor of aggregated loads to be as close to $1$ as possible, to minimize the flow of reactive power, which contributes to system stress while doing no useful work. Most real loads are inductive rather than capacitive, meaning that they consume $Q$ rather than producing it. One way utilities can drive network power factors toward $1$ is by installing capacitors to supply $Q$ to loads. This is the motivation for capacitor banks, which are commonly installed in transmission and distribution systems. 
 
## Power Factors in the Wild
Having established what the power factor is, we can look at power factors in real systems using sensor data. We will use distribution PMU measurements from the [sunshine dataset](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/). This public dataset contains measurements from several PMUs across multiple nearby distribution networks, including one PMU measuring the interconnection point of a large PV array. Fig. 7 is a schematic of the connectivity of the PMUs whose data we will use here. 

![Figure 7](power_factor/sunshine_map.png)
Figure 7: PMUs 1, 3, 4, and 5 in the sunshine dataset. PMUs 3 & 4 are at the heads of two separate feeders. PMU 1 measures the interconnection of a PV array below PMU 3. PMU 5 measures the interconnection of a building below PMU 4.

We choose to compute the power factor on phase $A$ at each PMU. A power factor is the property of a _flow_ and we must be precise about which flow we are considering. At PMUs 3 and 4, the power factor is that of the power flow between the distribution networks and the bulk grid, and reflects the aggregated power factor across all components on the network. At PMU 1, the computed power factor corresponds to the power factor of the PV array's power injection. At PMU 5 it is the power factor of the building load. 

To compute the power factor on phase $A$ at a given PMU, we query only two data streams: the voltage angle $\psi$ and the current angle $\phi$. From these, the power factor is computed as: 

$$
pf = \cos\theta = \cos(\psi - \phi)
$$

One great benefit of working with the power factor is that we do not need to deal with the hassle of angle unwrapping. Wrapped angle can be plugged into this equation directly. 

We compute the power factor across one full minute of data sampled from the start of each hour of every day over several weeks. Taking the average over the minute produces a power factor sample for this hour. The resulting power factor samples are plotted in a scatter plot with days of the week on the x-axis. This allows us to visually discern any daily or weekly trends. Let us consider the results for each PMU one by one. 

![Figure 8](power_factor/pf_pmu4.png)
Figure 8: Power factor samples at PMU 4. Colors indicate the day of week of the sample. Multiple scatter points at a given hour correspond to samples from the same time during different weeks.

Fig. 8 shows the power factor samples at PMU 4. The power factor has a distinctive daily cycle: close to $1$ during day time hours, it drops during the night. The full range is generally between $0.9$ and $1$. The day to night change in power factor likely reflects a change in the aggregate load composition of the feeder from daytime to nighttime.  

![Figure 9](power_factor/pf_pmu5.png)
Figure 9: Power factor samples at PMU 5, monitoring a building

Fig. 9 shows the power factor samples at PMU 5, which is measuring the flow to a building. The power factor remains relatively flat, staying between $0.88$ and $0.92$, with no clear daily or weekly cycle. This likely indicates a consistency in the load of the building. 

Now we move on to the more interesting PMUs! 

![Figure 10](power_factor/pf_pmu3.png)
Figure 10: Power factor samples at PMU 3, monitoring the interconnection of a distribution network with significant PV installation

Fig. 10 shows the power factor samples at PMU 3 which measures the power flow at the interconnection between the bulk grid and a distribution feeder with a significant PV installation.  Here we see a dramatic daily trend, with the power factor flipping from $+1$ during the dark hours to $-1$ during daylight hours. If you have an inkling that this pattern arises from the solar generation, you're correct! The _absolute value_ of the power factor consistently near $1$ indicates that the power flow at the interconnection is always predominantly real, with almost no reactive power exchange. The change in sign of the power factor indicates a change in the _direction_ of power flow. At night, when the power factor is $+1$, power is flowing into the feeder to serve the load. In the day, when the power factor is negative, there is actually real power flowing out of the feeder and into the bulk grid. This implies that the PV generation on the feeder exceeds the daytime load, leading to excess power that is pushed back into the system, in a phenomenon termed _reverse power flow_. 

![Figure 11](power_factor/pf_pmu1.png)
Figure 11: Power factor samples at PMU 2, monitoring the interconnection point of the PV installation

We obtain another perspective on this phenomenon by looking at the power factor at PMU 1 (Fig. 11), monitoring the PV interconnection. Here we see another clear trend, with a power factor of $1$ during daytime hours and a rather erratic power factor at night. The power factor near $1$ captures the purely real power injection of the PV when generating during the day (for now, inverters interfacing between PV systems and the grid produce only real power and no reactive power). The positive sign is perhaps surprising given our study of the power factor at PMU 3, but it reflects the directionality of the current measurement, which is arbitrary. It is our prior knowledge of PMU 1's siting at a PV interconnection that enables us to infer that this power factor corresponds to real power generation rather than real power load. 

The erratic power factor behavior during the night is confusing. What is happening? Overlaying the power factor sample time series with current magnitude measurements at PMU 1 clarifies the situation (Fig. 12). 

![Figure 12](power_factor/pmu1_pf_vs_imag.png)
Figure 12: A comparison of power factor and current magnitude data from PMU 1.

Notice the unmistakable daily pattern in the current magnitude reflecting solar irradiation and consequently PV output. The afternoon peak in generation is clearly visible. We also see current magnitude dropping to $0$ at night, during which time there is $0$ power flow at PMU 1. From the mathematical definition of power factor, we see that it becomes ill-defined for very low values of $S$. This is why we observe the noisy, and essentially meaningless nighttime power factor at PMU 1. 

![Figure 13](power_factor/med_pfs.png)
Figure 13: A comparison of median hourly power factors across PMUs 1, 3, 4 and 5.

Finally, Fig. 13 compares the median of hourly power factor samples across all PMUs. Power factor remains relatively flat at PMU 4, which is monitoring a feeder with no PV. On the other hand, power factor changes dramatically at PMU 3, monitoring the feeder with a PV installation. 

In a following blog post, we will connect power factor measurements to an important application in distribution networks: solar disaggregation. 
