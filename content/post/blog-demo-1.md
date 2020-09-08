---
title: Demo 1 “Sure I can log in but What's Next?”
date: '2020-07-28T00:26:38+0000'
description: This page is dedicated to new users. WELCOME to the NI4AI platform
featuredImage: '/assets/images/post/blog-demo-1/ni4ai-login.png'
tags: ["Set-up", "Visualization", "NI4AI-platform"]
author: nica
---

This page is dedicated to new users. WELCOME to the NI4AI platform! 

The fact that you are reading this blog means you have successfully signed up with the NI4AI and are ready to dive in.

Let’s use a PMU data set called “Sunshine”  to demonstrate how to interact with data in the platform.

## How to find data 

All NI4AI data is listed under “All Streams”. You can find the “sunshine” data by typing “Sunshine” in the “COLLECTION” field.  You can select single or multiple streams to explore. 

Each stream comes with metadata. Metadata includes details about what type of measurement it is, or whatever details can be reported about the measurement location. Metadata are reported in json in the bottom right corner of the screen. Each stream includes a metadata field called “UUID” that gives a unique ID used for querying the database. Metadata fields offer whatever information data providers are willing and able to disclose. Data providers may choose to withhold certain information due to privacy or security concerns. 

![LOGIN](/assets/images/post/blog-demo-1/login.gif)

## Save your work by creating a permanent link

Once you select one or more streams to visualize, you can create a permanent link that saves your selection, allowing you to come back to it at any time or share it with collaborators.

![SAVE WORK](/assets/images/post/blog-demo-1/save-work.gif)

## Three ways to export data and visualizations 

### Save your plot as an image 

You can use the plotter to zoom in on specific events or time intervals in the data. To share a visualization, you can simply save the graph as an image, or  copy and paste.

![SAVE IMAGE](/assets/images/post/blog-demo-1/save-as-image.gif)

### Download as a CSV file 

If you would like to dig further in excel or upload into other applications, you can export data to CSV. Use “Aggregated Data” to reduce the file volume. You can control how you aggregate.

![CSV](/assets/images/post/blog-demo-1/csv.gif)

### Export to Jupyter Notebook (Python)  

You can also interact with the data directly through the Python API to do analysis or to generate visualizations of your own. The “Export to Jupyter” button generates a code snippet you can copy and paste directly into a Jupyter notebook or Python script. 

![Jupyter](/assets/images/post/blog-demo-1/Jupyter.gif)

You will need to install BTrDB package to access BTrDB database, and you can find more information [here](https://btrdb.readthedocs.io/en/latest/installing.html). 


Useful tips and code samples are available on our blogs and in the [BTrDB docs](https://btrdb.readthedocs.io/en/latest/quick-start.html) .

Stay tuned for more demos, and happy analyzing! 
