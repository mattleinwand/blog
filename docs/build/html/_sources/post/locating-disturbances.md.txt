---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/locating-disturbances/disturbance.png'
tags:
- ni4ai-community
- do-it-yourself
title: Do it yourself - Locating disturbances
author: ni4ai
---

Voltage sags can happen due to local events, or due to events that are far away. One way to differentiate the two is to look for signs that other data streams -- such as frequency or current -- were affected as well. 

## Locating disturbances
Looking for changes in the current (or lack thereof) can indicate whether an event occurred locally, or whether it originated from a disturbance that happened far away. Looking for changes in frequency (or lack thereof) can also help to locate an event, as the frequency tends to change regionally, and not due to events that are primarily local.
 
Do it yourself
In this exercise, you’ll use the sunshine dataset to examine voltage sags and spikes. Look for similarities and differences across recorded at the same sensor. A change in both the voltage and current could indicate that an event occurred locally.
 
No change in current could indicate that an event originated from elsewhere in the network. Explore data from other sensors to determine where in the system an event occurred.
Extra Credit Challenge
The collection “lndunn/transmission_events/” reports measurements for a network of 20+ sensors during three events that occurred on the transmission grid including one oscillation and two switching events. Look for similarities and differences across sensors. Can you determine which sensors were nearest to the event? 
