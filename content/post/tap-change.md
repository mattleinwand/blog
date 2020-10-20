---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/tap-change/sunshine-plot-1.png'
tags:
- ni4ai-community
- do-it-yourself
title: Do it yourself - Counting tap changer operations
author: ni4ai
---

## What a tap changer does
Tap changing is the process by which some transformers can adjust the voltage at the head of a distribution network by changing the coils ratio between their primary and secondary sides. Transformers with this capability are called load tap changers or LTCs. The power demand on a network rises and falls over the day, leading to an inverse rise and fall in the voltage drop along the network. LTCs compensate for this varying voltage drop by stepping the voltage at the head of the network up and down, to keep the voltage at the end of the network within permissible limits. 

A tap changer is a mechanism embedded in many transformers that operates to keep the service voltage within reasonable bounds. As pictured below, tap changers use a mechanical switch to adjust the turns ratio between the primary and secondary windings on the transformer. These adjustments occur in response to changes in loading conditions on the distribution grid.

![tap_changer_gif](/assets/images/post/tap-change/tap_changer.gif)

## What to look for in the data
Tap change events are characterized by a stepwise increase or decrease in voltage magnitude, such as the one pictured below. These events can easily be detected visually. The challenge here is to detect them computationally. 


![in_the_data](/assets/images/post/tap-change/sunshine-plot-1.png)

## Do it yourself
Write an algorithm for counting tap changer operations by looking for stepwise changes in voltage like the one pictured above.

Track how frequently tap changer operations occur. Can you determine whether tap changer operations occur more frequently at certain times of day compared with others?
Extra credit challenge
Can you determine if variable sunshine triggers more frequent tap change operations?

