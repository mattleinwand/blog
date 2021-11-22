# Choosing where to site distribution PMUs
*Author: Sascha von Meier*

One frequently asked question about micro-PMUs is where best to install them on a distribution system. There are two kinds of answers: theoretical and practical.

A growing academic literature deals with the subject of optimal sensor placement from a mathematical perspective. The general question here is how to provide the most system observability with the fewest sensors. Observability basically means that we know all the relevant voltages and currents for the system as we have defined it: a voltage for each identified node and a current for each branch in the network, in steady-state operation. This information can be conveyed either with a combination of voltages and currents, or with a complete set of voltage phasors (magnitude and angle) along with all the network impedances. From this, we can find real and reactive power flows on every branch. 

Note that there are subtleties in how we model the system under study. For example, it could be characterized in full detail as a three-phase unbalanced network, or it could be simplified into a single-line representation (as is common for transmission systems). Also, there might be an explicit node at every service transformer, or the network could be represented in terms of larger circuit sections with aggregated loads. Naturally, the level of detail we wish to observe informs the granularity of measurements needed.

If we measure voltage at every node and current on every branch of the system as we have modeled it, and all our measurements are accurate and reliable, our knowledge is complete. In reality, though, we may have to interpolate or infer some quantities for locations where there are no direct data. Conversely, we may have extra measurements, but leverage this redundancy to correct for errors or bad data in a state estimation calculation, which checks the collective set of measurements against the laws of physics. 

Not all measurements may be available with the same time resolution. For example, smart meter data typically comes in 15-minute averages. To make the most of the available information, such data can be formatted as somewhat more uncertain pseudo-measurements to combine with explicit sensor data for each time step desired.

A general theme for improving system observability is that there is a trade-off between the quality of sensor data and the density of deployment. For example, a uPMU reporting ultra-precise voltage and current phasors twice per cycle will support some reasonable inference about what is happening at nearby locations. By contrast, 15-minute customer meter data are only useful because of the very dense coverage they provide. 

Also, different kinds of measurements will offer information about different things. Historically, meter data were only intended for financial settlement purposes and to recognize outages -- which explains why smart meters weren’t designed to communicate more detailed information such as voltage. In a world of constrained communication bandwidth and data handling, questions about power quality (such as voltage fluctuations) were addressed by taking a special meter to a specific location, not by continuous blanket monitoring of the network. 

Although it is quite feasible today to stream and process high-resolution sensor data from many locations, the number of sensors that a utility would want to install on a given distribution circuit is still constrained by cost and the practical considerations of performing installations. 

So, how to prioritize?
One approach is to focus on known problem areas. For example, if there is a large solar installation or variable load whose impact on the circuit we are concerned about, we would simply want to get a uPMU as close as possible to it. Alternatively, we may care more about an overview of the entire circuit.

For monitoring the total circuit load, we would want a uPMU at the substation. Monitoring the voltage would be more interesting farther away, where it will vary as a function of net load and circuit impedance. Typically, we’d like to know two things: where the steady-state voltage magnitude lies within the tolerance band, and what kinds of disturbances are occurring that would indicate faults or equipment issues. Neither of these requires extreme accuracy. Information about the steady-state voltage will be quite useful and actionable within about 0.01 per-unit, or one percent of nominal. At this level, we can usefully extrapolate along a distribution circuit section from one uPMU measurement at a nearby location. To recognize if there are voltage violations occurring, it would generally be enough to deploy one uPMU on each major branch of a distribution circuit (say, 2 to 5).

For analyzing disturbances, we are more interested in the shape of the evolution than the absolute magnitude (say, the exact minimum value of a voltage sag). This mostly requires precision and resolution to differentiate along the time series. Again, uPMU measurements from one location will offer insight into the wider neighborhood. A disturbance such as a high-impedance fault anywhere on a distribution circuit should be detectable with a single uPMU anywhere on the circuit -- in terms of voltage downstream, or current upstream. 

Beyond detecting disturbances, though, it is useful to know approximately where they occurred. Here we will need to deploy a number of sensors consistent with the granularity at which we want to localize events. For example, one uPMU on each major circuit branch would allow us to easily narrow down a fault location to a given branch. (One can do better with advanced algorithms that take exact network impedances into account.) Depending on the size and layout of the circuit, 2 to 10 devices would offer a reasonable level of blanket coverage to drastically reduce the time required for locating problems in the field.

But where, specifically, to put a uPMU?

In practice, this will be driven by the physical installation logistics.

Most important to consider is that the uPMU input is limited to secondary voltage levels, up to 690V line-to-line. This means that voltages at a customer site or on the secondary side of a transformer can be measured directly, simply by plugging them into a single- or three-phase outlet at the residential, commercial or industrial service voltage. Measuring current at a secondary service location will require a small current transformer (CT), which wraps around the line and converts the current to a small signal for the uPMU with high precision.

To measure primary distribution voltages on the order of 10 kV, it is necessary to connect through a potential transformer (PT). Likewise, current measurements require connecting through a CT to isolate the uPMU, which is small and human-accessible, from hazardous power flows. 

Instrument transformers for primary distribution systems are large, depending on the rated voltage and current, and expensive to install. Typically, utilities would have PTs and CTs for each distribution feeder within a substation, and out along the feeder wherever there is controllable equipment such as capacitor banks, voltage regulators, or smart reclosers. The first step in a field deployment of uPMUs is to consider where there are existing PTs and CTs. It is relatively simple to extend sensor leads from the low-voltage or low-current side of these transformers. The only caveat is that it is often preferred to leave safety-critical protection systems alone, lest there be any unintended interference. 

Space for a uPMU can usually be found -- whether mounted on a DIN rail inside a substation or cabinet, or pole-mounted in a weatherproof enclosure. Since it is in the nature of switchgear and voltage regulating equipment to be spatially spread out over the area covered by a distribution feeder, these natural tie-in locations will often provide fair observability over all circuit branches. 

Besides connecting to the source they are measuring, there are other practical considerations for uPMU placement. The GPS receiver requires a relatively unobstructed view of the sky, to maintain contact with four or more satellites. Indoors, it is often sufficient to place the GPS receiver outward facing in a window, especially when there are few trees or other buildings blocking the view. On some structures, it is necessary to run a GPS antenna cable outdoors; in this case, the roof penetration may be the crux of the installation.

Finally, unless the plan is to manually collect batches of data from an SD card (a resilient option that preserves valuable data in case of a major outage event!), the uPMU must communicate its data through some cable or wireless connection. In field locations where Ethernet or dedicated lines are not available, uPMU data have been successfully streamed over 3G or 4G cellular service. In this case, the continuity of available signal at the installation location should be checked.

One advantage of the PredictiveGrid platform is the ease of adding data streams to an existing fleet, and editing analytics to incorporate data from new sensors. This modularity means that a utility wishing to instrument a distribution circuit can start with just a few sensors, and decide on additional locations after evaluating the first data. 


