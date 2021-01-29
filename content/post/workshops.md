---
date: '2020-11-01T01:00:00+0000'
description: Familiarizing new users with PMU data, database bindings, and analytical use cases
featuredImage: '/assets/images/post/default.jpg'
tags:
- ni4ai-platform
- ni4ai-data
- ni4ai-community
title: Workshop on PMU data analytics
author: ni4ai
---

This Fall, NI4AI hosted a series of workshops about time series data on the grid.
The purpose of these talks was to familiarize new users with concepts and methods relevant to working with time series grid data.
This blog post gives a short summary of each talk, and a link to the recording on YouTube.

Have questions? Send questions to info@ni4ai.org.

## Understanding PMU Data
*Dr. Alexandra "Sascha" von Meier*

This talk provides an introduction to PMU measurements to help data analysts make sense of PMU data. The talks discusses the physics relevant to interpreting data in the context of what's happening on the grid.

https://youtu.be/qRAPYVtC2zM

## Use Cases and Applications
*Dr. Kevin Jones*

This talk describe use cases and lessons learned from Kevin's experience building the synchrophasor data program at Dominion Energy. 
The program is founded upon the premise that making it fast and efficient to explore new use cases for PMU data will lead to the discovery of new use cases. 
The talk describes practical applications for PMU data that have been developed and deployed using PredictiveGrid. 

https://youtu.be/RwIh6-dSpfE

## The Power of Data
*Sean Murphy*

This talk outlines how digitalization has transformed the way we everything from shopping to taking photos to operating the electric power grid. Sean Murphy, CEO of PingThings, lays out a powerful vision for how continuous grid monitoring coupled with machine learning could help the industry to become more proactive in responding to early indicators of emerging risks that could escalate if left unresolved.

https://youtu.be/bagZhgj2GAI

## Voltage Sag Detection
*Mohini Bariya*

The tutorial describes an algorithm for detecting and analyzing voltage sags recorded in time series voltage measurements recorded by a distribution synchrophasor (a micro-PMU). The algorithm leverages the database structure of the Berkeley Tree Database (BTrDB) by querying summary statistics of measurements recorded across different time intervals to identify and narrow in on intervals during which voltage sags occurred. The algorithm discusses the implications and characteristics of voltage sags, as well as efficient methods for working with long time histories of data using BTrDB.

https://www.youtube.com/watch?v=qPBeAjwlQ-s&t=2s

## Exploring Frequency and Phase
*Miles Rusch*

This tutorial describes how to use phasor data to compute the frequency of the grid. Phasors are a compressed representation of a sinusoidal waveform. Frequency deviations are evidenced by changes in the phase angle over time. Miles describes a common data processing technique which uses the change in phase angle over time to derive the frequency. The talk also points to some fundamental limitations with using phasors to represent waveforms when they *aren't* perfectly sinusoidal. The limitations of phasor data discussed are a key motivator behind the industry's growing interest in *point on wave* data.

https://www.youtube.com/watch?v=oNAPNDo0vBw

