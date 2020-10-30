---
date: '2100-01-01T14:00:00+0000'
description: Collections hosted in NI4AI and how to find them
featuredImage: '/assets/images/post/data-quality/brownout.png'
tags:
- ni4ai-data
title: NI4AI Data Collections
author: ni4ai
---

This blog post lists datasets hosted in NI4AI by collection name, and links to relevant documentation and blog posts.

## Streaming PMU data

#### Collection: "ni4ai/"

This collection includes streaming sensors deployed as part of NI4AI. Sensors are deployed in wall outlets, and report single phase voltage magnitude and angle, as well as frequency. Metadata for sensors in the collection give additional information about siting, sensors, and about the grid they are connected to.

#### Collection: "texas_pmus/"
https://blog.ni4ai.org/post/2020-10-11-texas-pmus/

This collection includes three sensors deployed as part of the Texas Synchrophasor Network. The data includes one sensor  on each interconnection. Anyone using the data is requested to cite the following publication.

Mack Grady and David Costello. "Implementation and Application of an Independent Texas Synchrophasor Network." *SEL Journal of Reliable Power*. Vol. 2, No. 2. May, 2011. URL: http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.857.5454&rep=rep1&type=pdf


## Archived PMU data

#### Collection: "sunshine/"
https://blog.ni4ai.org/post/2020-03-30-sunshine-data/

This collection includes archived data for 6 distribution PMUs deployed as part of a pilot program that ran for 18 months. The pilot was run as part of an ARPA-E project funded under Open 2012 which resulted in the development of the micro-PMU.

Streams: 78
Points: 331,983,600,006

#### Collection: "events/"

This collection gives 1-minute snapshots of three wide-area events across a network of 23 PMUs each with a sampling rate of 30 samples per second. The sensors located on the transmission grid and the data are fully anonymized. In other words, the time stamps have been masked and the geographic locations of the sensors removed.

Streams: 1,311
Points: 2,361,111

#### Collection: "brownout/"
This dataset gives 1 hour of PMU data recorded on September 6, 2020 between 5 and 6PM Pacific. One of the ni4ai sensors saw a frequency disturbance during that time, and we reached out to the Texas Synchrophasor Network to see if their sensors had seen it as well. The event occurred in WECC, and forms the basis of an exercise on data quality assessment (link).

Streams: 9
Points: 971,631

#### Collection: “EPFL/BESS”
https://github.com/DESL-EPFL/Point-on-wave-Data-of-EPFL-campus-Distribution-Network 

The data was collected by three point on wave sensors as part of an experiment run on the grid that serves the EPFL university campus in Switzerland. The grid includes a 560 kWh lithium-ion battery. The data report six discrete events, including baseline measurements, and measurements recorded during five charging and discharging events. Each event lasts 2 seconds with measurements reported every 20us (sampling rate of 50 kHz).

Streams: 12
Points: 7,200,000

#### Collection: “USGS/GEOMAG”
https://www.usgs.gov/natural-hazards/geomagnetism/science/instrumentation?qt-science_center_objects=0#qt-science_center_objects

This dataset reports geomagnetic field measurements taken at 14 different latitudes on the surface of the earth from 2013 to 2019. Each measurement is reported as a vector quantity with coordinates in the North/South, East/West and vertical dimensions. Data are reported as a 1-second average derived from a 100Hz geomagnetic field sensor. Additional information about the measurement infrastructure and data format are available at the link above. 

Streams: 56
Points: 10,826,130,797


## Other time series data
#### Collection: “Health/EKG/”
https://blog.ni4ai.org/post/2020-05-06-ekg-data/ 

This data reports EKG measurements for one patient. EKG (short for electrocardiogram) measurements for an 81 year old female. Metadata fields include additional information about the patient's medical history.

Streams: 15
Points: 1,728,000

## Finding data in the platform
<iframe width="560" height="315" src="https://www.youtube.com/embed/cqnaSlqPuGU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>