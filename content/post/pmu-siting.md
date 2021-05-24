---
date: '2021-02-21T01:00:00Z'
description: Wondering where to put PMUs? Here's a guide to siting and installation
featuredImage: '/assets/images/post/default.jpg'
tags:
- explainers
- ni4ai-data

title: Practical Guide to PMU Siting
author: laurel
---

Sensor siting affects the nature and quality of the data that’s generated. Dense sensor coverage can provide broad visibility, while reducing uncertainty associated with estimating state variables at different nodes on the system. Many applications, however, can be supported with data from only one sensor that’s strategically placed to provide data relevant to the problem at hand.


This blog post summarizes theoretical and practical considerations relevant to siting PMUs on a distribution grid.

# Theoretical Considerations
The main distinction between a transmission PMU and a distribution PMU (e.g., the microPMU) is that time synchronization on distribution PMUs must be more accurate in order to capture phase angle differences typical in distribution systems. The microPMU, for example, reports phase angles that are accurate down to 0.01 degrees. 

## Separation
The phase angle difference between two nodes on a distribution system depends on two characteristics of the network: 
1. Power flow
2. Line impedance
 
We can relate phase angle differences to these quantities using the power flow equations. Alternately, the LinDistFlow equations [1] offer a linear approximation of power flow based on assumptions characteristic of distribution systems:
$$\delta_a-\delta_{b} \approx xP-rQ$$
Where $\delta_a-\delta_{b}$ describes the phase angle difference between two nodes, $x+jr$ describes the impedance of the line between them, and $P+jQ$ describes power flow along the line. Given phase angle measurement precision of 0.01 degrees, the second equation coupled with what’s known about the impedance and power flow of the network to compute the minimum physical separation between sensors.

## Placement
When placing PMUs, it is convenient to think about the value of the current and voltage measurements independently. A current measurement provides visibility on a single, specific flow: that of the line or load being measured. A voltage measurement provides broader visibility across an area, since the voltage at one network node is affected by multiple current flows within the network. 

Consider, for example, a radial network with one PMU at the substation or root node, and one at a line end or leaf node. The voltage difference between these two PMUs will be affected by a change in load at any point in the network. Voltages at nearby nodes are highly correlated, therefore the value of placing two PMUs near each other comes from the additional current rather than voltage measurement. PMU voltage measurements spread out throughout a network, with one PMU per rough cluster of nodes, provide the greatest visibility on events occurring across the network. In radial networks, a measurement at the substation, and a comprehensive set of leaf measurements provides thorough visibility into load or network changes. When choosing an installation point within a cluster of nodes, or among the full set of leaves, the current measurement is a useful differentiator: preference should be given to locations where more important current measurements (of large or interesting flows) can be made.

## Measurement error
In distribution networks, estimating impedances from PMU measurements is bedeviled by transducer error. This further reduces the incentives for proximal installations---for example at two ends of a line. Instead, spreading PMUs through a network as described enables their high-resolution measurements to provide broad visibility into significant system changes. Depending on the precise installation configuration and coverage, changes can then be localized to specific parts of the network, with greater specificity as measurement coverage increases.

# Installation
PMUs can be installed on any current transformer, electrical panel, or wall outlet. Different deployment strategies can affect which quantities are measurable, as well as the nature of the dynamics that can be observed.

## On the Grid
PMUs can be connected directly to the grid at service voltages up to 750V (line-to-neutral). To monitor networks at a higher voltage, the sensor must be connected through a potential transformer (PT). It is important to note that measurements taken through the PT is an additional source of measurement noise. This should be taken into account in choosing a transformer, and in calibrating the sensor.


Current measurements are recorded by a high-precision current transformer (CT) purchased along with the sensor. Depending on the rated capacity of the grid, it may be necessary to connect the sensor’s CT to the secondary side of an existing CT installed for metering or protection. It is important to again note that placing a CT between the measurement site and the grid itself contributes to measurement noise.

## Electrical Panels
The sensor can be installed directly on an electrical panel to measure service voltage and current at the customer. For customers that receive single-phase service, measurements will of course be limited to single-phase voltage and current measurements.


Despite ease of installation, it is important to note that measurements recorded on secondary distribution may be much noisier than measurements recorded on medium-voltage grids due largely to volatility in load. Furthermore, signals that are interesting or relevant to monitor in one region of the network may be obfuscated by transformers. Sensors should be installed as close to the area of interest as possible, as sensors installed on secondary distribution may not capture dynamics relevant to distribution grid operation. Depending on the nature of the dynamics that are of interest to monitor, measurements that are sensitive to changes in customer load may make it difficult to differentiate changes in load from events on the grid.

## Wall Outlets
Sensors installed in a wall outlet measure single-phase voltage, but not current (as at the electrical panel). Sensors installed in wall outlets are also subject to the same limitations on data quality and measurement noise as sensors installed on electrical panels.


Wall outlet data can, however, be used to detect voltage sags or spikes happening on the distribution grid, which can be traced to arcs and faults related to risk factors like vegetation contact or equipment degradation. 


Wall outlet measurements can also provide insights valuable for wide-area monitoring purposes. Installing PMUs in wall outlets allows for independent grid monitoring efforts which circumvent institutional barriers to making data accessible across service territories. After filtering out measurement noise, wall outlet data can be used to monitoring frequency on the grid, and to study phase angle differences which indicate the direction of power flow across different regions of an interconnect.

# Practical considerations
Practically speaking, choosing where to site sensors and how many to install really depends on which applications you wish to enable, or what dynamics you want to be able to see.


While state estimation and fault location require dense sensor coverage, practitioners willing to accept some uncertainty may find that less coverage is sufficient for their purposes. For example, comparing measurements from sensors on different laterals may allow operators to determine in which general area of the grid a fault occurred, without locating it precisely.


For control and monitoring applications, the heuristics are much simpler. Control applications may require a PMU sited at each decision point on the network -- for example at each inverter, battery, or controllable device. Monitoring purposes may also be supported by simply installing a sensor in each area of the system that is of interest. Examples could include siting sensors at the substation, at each generator, and at each major branch point on the network.


# References
[1] Powerside. microPMU tech sheet (2020). https://powerside.com/wp-content/uploads/2020/12/MicroPMU-LV-Data-Sheet.V1_En.pdf
[2] A Ostfeld, K Brady, L Mehrmanesh and A von Meier. Reference document for microPMU installation (2018). https://www.naspi.org/sites/default/files/reference_documents/uPMU%20Installation%20Ref%20Manual%20Mar%2023%202018.pdf