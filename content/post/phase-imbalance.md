---
date: '2020-10-19T21:42:13.181361Z'
description: 
featuredImage: '/assets/images/post/phase-imbalance/imbalance.png'
tags:
- ni4ai-community
- do-it-yourself
title: Do it yourself: Phase imbalance
author: laurel
---

In a balanced system, voltage and current magnitudes are the same across all three phases, and phase angles are offset by 120 degrees. The sunshine and EPFL datasets both include three-phase measurements of voltage and current that can be used to study phase imbalance.

## What to look for in the data
In practice, conditions such as faults, power theft, distributed generation, and malfunctioning equipment can lead to imbalance across the three phases. Looking for imbalance -- or for changes in balance over time -- could indicate if and where there are issues.

## Do it Yourself
Examine phase imbalance for data streams in the sunshine and EPFL datasets. Compare current magnitudes, voltage magnitudes, and the angle differences across each phase. Come up with a metric (or metrics) for evaluating how “balanced” the system is.

## Extra Credit Challenge
Three phase systems are often decomposed into "[symetrical components](https://en.wikipedia.org/wiki/Symmetrical_components)" which represent each phasor as the sum of three vectors called positive, negative and zero sequence vectors. The positive sequence vectors represent a balanced system, while negative and zero sequence vectors capture imbalance.

Compute these sequence vectors using real data. How much information is lost by looking at positive sequence vectors compared with the raw phasor measurements?

![symmetrical_components](/assets/images/post/phase-imbalance/symmetrical_components.jpg)
