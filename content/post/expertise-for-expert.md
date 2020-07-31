---
title: "Expertise for Experts: What do you need to know about PMU data?"
date: '2020-07-31T07:12:06+0000'
description: NI4AI is building bridges between different areas of expertise.
featuredImage: '/assets/images/post/expertise-for-expert/chalkboard.jpg'
tags: ["ni-4-ai", "ai", "python", "data-analysis", "visualization", "btrdb"]
author: laurel
---

Veteran power systems engineers spend decades learning to excel in their jobs through learning that happens in school, professional training, and from real-world experience. Becoming a skilled data scientist involves practice, and often an advanced degree complete with a gruelling course load and more than a few all-nighters. For most people it simply is not practical to become experts in both fields. 

NI4AI is building bridges between different areas of expertise. An important pillar of the project is to make grid data more accessible so that anyone and everyone can develop analytics. Historically, limited understanding of computer science has prevented power systems engineers from getting the most out of their data. At the same time, restrictions around data sharing and access prevents data scientists from trying their hand at using AI to solve grid problems.

NI4AI wants you to begin analyzing grid data by providing the [data](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/), [visualization](https://blog.ni4ai.org/post/2020-07-27-blog-demo-1/) and [API](https://blog.ni4ai.org/post/2020-02-12-btrdb-queries-pt1/) that will set you up to query [unfathomable volumes of data](https://blog.ni4ai.org/post/2019-12-12-btrdb-explained/) at [record speed](https://blog.ni4ai.org/post/2019-12-17-benchmarking-results/).

This blog post, however, is intended to help you build expertise to begin to interpret the data. What physical quantities do these data streams represent? What do they measure? What do they tell us about the underlying physics of the grid? This is the first of many geared at connecting experts with introductory materials they need to understand and interpret the data. Below we offer recommendations for experts in both data science and power systems engineering to learn the fundamentals they need to begin applying their expertise.

Have questions or ideas for new analytics and content? Please get in touch! [info@ni4ai.org](info@ni4ai.org)

### For data scientists:
We want to connect you with resources that will help you learn what you need to know to begin working with grid data. We’ll be posting video tutorials about synchrophasor measurement data to start. The talks explain what synchrophasors measure and what information they report. You can get experience working with synchrophasor data by analyzing the “Sunshine” dataset.

Tutorials were recorded by Sascha von Meier, a professor in Electrical Engineering at UC Berkeley and regular contributor to our blog. Sascha teaches an introductory course on electric power systems covering both legacy grid technologies and smart grids. Her textbook “Electric Power Systems: A Conceptual Introduction” is a great introduction for anyone trying to learn more about how the grid works.

### To readers who are power systems engineers:
The lectures above will provide a refresher about how synchrophasor data relate to the physics of the grid. In the Sunshine data alone, you will find evidence in the data of frequency deviations, voltage sags, tap-changes and phase imbalance. The challenge is to develop the software to detect these events and to use these insights to help you better understand what is happening on your system. These insights can help you (or your boss) make better decisions that will make you look good.

We have started to develop some of the analytical tools that will set you up for success. Our blog hosts code you can use to analyze data in NI4AI -- or can copy to apply to your own datasets. We will be offering crash course tutorials to help you use these analytics in your own work, and to begin developing analytics of your own. Our next tutorial will be a 3-hour session at [IEEE SmartGridConn](https://sgc2020.ieee-smartgridcomm.org/) on November 11-13.

For more updates about tutorials and events, [subscribe to our newsletter](https://forms.gle/WzDCbWo13fADieKG6).