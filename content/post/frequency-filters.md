---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/frequency-filters/imbalance.png'
tags:
- ni4ai-community
- do-it-yourself
title: Do it yourself - Frequency filters
author: ni4ai
---

The nominal frequency of the grid is 60 Hz. In practice, however, the frequency changes subtly due to fluctuations in supply and demand.

## Why frequency deviates from 60 Hz
Frequency deviations occur due to a magnetic coupling between synchronous generators and variable loads within distribution networks. In the same way that exerting more torque on a generator increases the amount of transmission line current, a change in line current changes the amount of torque exerted on the generator. This coupling causes generators to speed up or slow down in response to changes in load.

This means that subtle changes in load lead to subtle changes in frequency on the grid. The system tends to exhibit “self stabilizing” properties, however, as long as the operating state of the system stays within certain bounds. The implication is that most near-term fluctuations in frequency have tended not to be particularly important from an operating perspective.

## Frequency and renewables integration
Increasing penetration of renewables, however, means that fluctuations in frequency are not driven exclusively by changes in load. Changes in power production due to cloud cover or shadowing may also contribute to changes in frequency. The implication is that the operating reserves needed to keep the grid operating at 60 Hz may not be enough.

It is important for grid operators to understand how an increase in renewables production could alter the frequency of the grid, as operating reserves may need to increase in order to manage increased variability due to intermittent generation.

## What is the frequency?
Because the frequency of the grid is always changing, we would traditionally use filtering techniques to smooth out near-term fluctuations. Understanding the implications of renewables integration, however, requires a more nuanced understanding. Here, we challenge you to explore different techniques for determining the frequency of the grid.

## Do it yourself
Define filters to measure the frequency over different timescales. How different is the frequency if measured instantaneously, as compared with calculating it using moving average filters with window duration of 10 sec, 5 sec, or less? How do the instantaneous frequencies compare across PMUs at different locations? How do the filtered frequencies compare? How do moving average filters compare with your favorite low-pass filter?

## Extra credit challenge
Find a period when a disturbance occurred, and compare the frequency of the grid during that time with a period when the grid is at steady state.
