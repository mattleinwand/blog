---
date: '2020-10-11T19:42:13.181361Z'
description: NI4AI is bringing together data from existing sensor networks
featuredImage: '/assets/images/post/texas-pmus/interconnects.png'
tags:
- ni4ai-community
- ni4ai-data
title: Onboarding sensors from the Texas Synchrophasor Network
author: laurel
---

NI4AI onboarded three new sensors this week.
These sensors are part of a deployment called the **Texas Synchrophasor Network**, led by Professor Mack Grady out of Baylor University in Texas.

## Texas Synchrophasor Network
The [Texas Synchrophasor Network](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.857.5454&rep=rep1&type=pdf) is an independent grid monitoring network.
The network consists of several PMUs which report voltage angle and magnitude in 120 volt wall outlets.
The frequency of the grid is calculated from these measurements.
Sensors are strategically located to measure conditions in areas where interesting dynamics can occur.

The project releases reports describing interesting events and conditions on the grid.
These reports pull in information from other data streams to draw connections between PMU data and load characteristics, renewables generation, or supply issues.

Three of the sensors in the network are now streaming data into NI4AI.
These sensors are located in White Sands, NM (WECC), Conroe, TX (Eastern Interconnect), and in Central Texas (ERCOT).


## What is independent grid monitoring?
Independent grid monitoring refers to sensor networks that record grid measurements independently of the utility.
Without access to the grid, these sensors typically can only measure voltage (not current).
However, easy installation expands the realm of possible measurement points and eliminates the need for an electrician.


## The case for independent grid monitoring
The advantage of independent grid monitoring is that the data are not subject to the same restrictions as they would be if they were collected by a utility.
Independent grid sensors can stream directly to a central repository -- regardless of which service territory they are located in.

The benefit is that disturbances can easily be tracked across broad geographic areas.
Here's an example showing the frequency of the grid after a generator trip that happened in Florida in 2008.
The event led to frequency deviations that spanned the entire Eastern Interconnect!

Independent monitors simplify the logistics of tracking down the origin of an event like this, and monitoring the impacts on other service territories.



<iframe width="803" height="502" src="https://www.youtube.com/embed/bdBB4byrZ6U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<!-- [![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=bdBB4byrZ6U) -->