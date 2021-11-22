---
date: '2021-04-26T01:00:00Z'
description: How should we understand voltage angles in a network
featuredImage: '/assets/images/post/angle-differencing/angle_art.jpeg'
tags: ["btrdb", "python", "angles", "wams", "analytics", "phasors"]

title: All the Angles
author: mohini
---

Beautiful angles by [Koola Adams](https://www.saatchiart.com/art/Painting-Right-Angle-East-of-Blue/764852/7000043/view). Angles in the electric grid can be just as exciting and interesting. 

In [prior blog posts](https://blog.ni4ai.org/post/2020-07-30-what-is-the-angle/), we discussed the fundamental nature of phasor angle measurements. Now we are ready to abstract away the phasor measurement process, take the angle produced at face value (only for the duration of this post!) and consider its physical meaning in the electrical network. Angle measurements are important because they reflect the values of more material quantities---specifically power flows and impedances---that may not or can not be measured directly. This blog post explains how to interpret and use the angles of the voltage phasors at network nodes, sharing some examples of operational tools from industry that use angle measurements.

Part I uses a simple example to provide mathematical and physical intuition for voltage angles in a.c. electrical circuits. If you are impatient to see some data and real-world examples, skip to Part II.

## Part I: Angles & Ohm’s Law

Consider two voltage phasors, $V_a$ and $V_b$, at two ends of a line named $ab$, somewhere in the electric grid.

![Figure 1: Line ab](/assets/images/post/angle-differencing/line_ab.png)
Figure 1: Line $ab$ somewhere in the electric grid, with impedance $Z_{ab}$, current flow $I_{ab}$, and terminal voltages $V_a$ and $V_b$.

Current phasor $I_{ab}$ flows along the line. All three phasors can be represented by complex numbers, and drawn on the complex plane. The line impedance $Z_{ab}$ is also a complex number---though not a phasor---with the real part corresponding to resistance, and the imaginary part corresponding to reactance (in the most cursory terms, resistance leads to differences in voltage magnitude, while reactance leads to differences in voltage phase, ie time delays). We can visualize the relationship of Ohm’s Law on the complex plane for typical values of $Z_{ab}$ and $I_{ab}$: 
$$
V_a - V_b = Z_{ab}I_{ab}.
$$
To keep things simple, we will need to make several assumptions: all reasonable and commonplace. In transmission system analysis, it is ubiquitous to assume that power line impedances are dominated by reactance and have little resistance. We will neglect the resistance of line $ab$, so that $Z_{ab}$ is purely imaginary, lying on the imaginary axis of the complex plane. In a.c. networks, two types of power are present: real power and reactive power, denoted $P$ and $Q$ respectively. Together, they constitute complex power $S = P + jQ$. The angle of $S$ in the complex plane is the power angle, and indicates the relative quantities of real and reactive power. We will assume that current $I_{ab}$ is a proxy for complex power demanded by the loads, such that the current angle equals the power angle delivered to the load. Finally, we assume that $V_a$ is purely real; since only voltage differences carry physical meaning, we can always set one reference voltage arbitrarily.

First, assume only real power is flowing through the line, so $I_{ab}$ lies along the real axis in the complex plane (Fig. 2 Real Power Flow). Drawing out the voltage-current-impedance relationship across the line from Ohm’s Law, we see that the resulting voltage drop is purely imaginary. Given the relative magnitudes of the $Z_{ab}$, $I_{ab}$, $V_{a}$ and $V_{b}$ phasors, the preponderant effect of the voltage drop is an angle shift between the terminal voltages. That is, $V_{a}$ and $V_{b}$ have essentially equal magnitudes, but significantly different angles.

Now, assume only reactive power is flowing through the line, so $I_{ab}$ lies along the imaginary axis in the complex plane (Fig. 2 Reactive Power Flow). Redrawing Ohm’s Law, we see that $V_{a}$ and $V_{b}$ differ only in magnitude, with equal angle.

The implication of this exercise is that, in the transmission context, where lines are mostly inductive, real power flows lead to differences in voltage angles, while reactive power flows produce differences in voltage magnitudes.

![Figure 2: Phasor Diagrams](/assets/images/post/angle-differencing/phasor_diagrams.png)
Figure 2: The relationship between voltages, current, and impedance across line ab visualized in the complex plane for the case of purely real power (left) and purely reactive power (right).

As it turns out, this result can be extended to voltages across entire networks, which are not directly connected by a single line. The angle difference between two arbitrary nodes in a large system can not be associated with a single line impedance and single power flow, but more comprehensively reflects the aggregated impedances and real power flows between the two nodes. This is the basis for the real world angle difference monitoring applications discussed next.

## Part II: Angles in the wild

Applications which look at angle differences to understand real power flows through a system are widespread. In general, these applications present the user with measured voltage angles from across the system, in a variety of visualizations.

The website of the FNET project, out of the University of Tennessee, uses a heatmap to visualize voltage angles from synchrophasor sensors across the Eastern Interconnection. The map is accessible [here](http://fnetpublic.utk.edu/anglecontour.html) and is updated continually but---for security reasons---lagging real time. At the time of writing, I can look at angles across the Eastern Interconnection at 10:20 pm (Fig. 3). The rapid angle gradient around the large cities of the north east is especially conspicuous, reflecting the large power flows into this high-demand region from across the system. This map strikingly illustrates the relationship between voltage angles and power flows through an electric network.

![Figure 3: FNET](/assets/images/post/angle-differencing/fnet.png)
Figure 3: Screen grab of the FNET angle difference map, showing voltage angles measured by synchrophasors scattered through the Eastern Interconnection.

Utilities monitor angle differences in their control rooms to detect unusual angle differences that could indicate overloading, line outages, or faults. Angles are often presented in a phasor visualization like that shown in Figure 4. This and other applications and visualizations of angle difference monitoring in use at utilities are described in [1].

![Figure 4: Dominion Angles](/assets/images/post/angle-differencing/dominion_angles.png)
Figure 4: The voltage angle monitoring interface at Dominion [1].

We can also look at voltage angle differences in the open access sunshine dataset available through the NI4AI project. Let us look at the voltage angle difference between PMU 1, at a PV array, and PMU 3, at the substation above the array.

First, I query the voltage angle measurements on phase A at PMU 1 and PMU 3---it is important to look at matching phases when considering angle differences. The raw angle measurements from two hours starting at 10 pm on October 20, 2016 are plotted in Figure 5. Notice the familiar wrapping of the angles between 0 and 360 degrees (for more on wrapping, see [this prior post](https://blog.ni4ai.org/post/2020-07-29-what-is-the-angle-part-2/)).

![Figure 5: Raw Angles](/assets/images/post/angle-differencing/raw_angles_1_3.png)
Figure 5: Two hours of wrapped voltage angle measurements at PMU 1 and 3.

After unwrapping the two angle streams, we obtain the data in Figure 6. The angles are close, and the two time series appear to overlap.

![Figure 6: Unwrapped angles](/assets/images/post/angle-differencing/unwrapped_angles_1_3.png)
Figure 6: Two hours of unwrapped voltage angle measurements at PMUs 1 and 3.

Taking the difference between the angle at PMU 1 and that at 3, we obtain the plot in Figure 7.

![Figure 7: Raw difference](/assets/images/post/angle-differencing/angle_diff_1_3.png)
Figure 7: Voltage angle difference between PMU 1 and PMU 3.

Oh no! What are those strange spikes? Unnatural patterns like this are a sign of bad data: erroneous values that have been introduced by the sensor, communication network, or some other element in the measurement pipeline. Wrangling with bad data is an unavoidable joy of working with real measurements. Since the bad data points lie about a degree off from the true time series, we can easily filter them out in Python to obtain the cleaned angle difference. For this particular time series, I simply throw out all angle difference values above 0 degrees to obtain the result in Figure 8. Much better!
  
![Figure 8: Cleaned Differences](/assets/images/post/angle-differencing/clean_angle_diff_1_3.png)
Figure 8: Clean voltage angle difference between PMU 1 and PMU 3 over the hours from 10pm to midnight on October 10, 2016.

Through a similar set of steps, we obtain the voltage angle difference between PMUs 1 and 3 earlier on the same day: two hours beginning at 4 pm. The clean difference is plotted in Figure 9.

![Figure 9: Another example](/assets/images/post/angle-differencing/clean_angle_diff_1_3_example2.png)
Figure 9: Clean voltage angle difference between PMU 1 and PMU 3 over the hours from 4pm to 6pm on October 10, 2016.

In both time periods, the voltage angle separation between PMUs 1 and 3 is increasing. However, the difference is increasing in opposite directions, reflecting changing directions of power flow through the network.

## References

1.  Using Synchrophasor Data for Phase Angle Monitoring. NASPI Control Room Solutions Task Team Paper. https://www.naspi.org/sites/default/files/reference_documents/0.pdf?fileID=1567
