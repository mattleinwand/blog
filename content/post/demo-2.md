---
title: "Demo 2: When NI４AI meets your Jupytr Notebook..."
date: '2020-07-30T02:13:47+0000'
description: This page is for users interested in exporting the data from the NI4AI platform to Jupyter Notebook or Python script for further analysis.
featuredImage: '/assets/images/post/demo-2/feature.png'
tags: ["ni-4-ai", "ai", "python", "data-analysis", "visualization", "btrdb"]
author: nica
---

Hello, welcome back to the NI4AI platform! 

This page is for users interested in exporting the data from the NI4AI platform to Jupyter Notebook or Python script for further analysis.

Our engineers, data scientists and UC Berkeley team frequently publish useful information and analysis examples on our [blogs](https://blog.ni4ai.org/) for you to explore.

To demonstrate how to get started, I will replicate the blog “[A brief walkthrough of the Sunshine uPMU dataset](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/)” by Prof. Sascha von Meier of UC Berkeley that introduced some basic visualization of the data available in the NI4AI platform (see [demo 1](https://blog.ni4ai.org/post/2020-07-27-blog-demo-1/) to find the Sunshine dataset). 

Let’s walk through using Jupyter Notebook.

We will introduce two ways in this blog:

## Jupyter Notebook via Google Colaboratory 

Google Colaboratory is like a Google Doc; you can run code and share work with others. If you don’t want to have Jupyter Notebook installed on your machine, this is the way to go for you! If you have a Google account, just open our Jupyter Notebook from [this link](https://drive.google.com/file/d/1DAecP25WQKm9K2LDZgu-s1x8ZKKcPloU/view?usp=sharing) and select open with “Colaboratory,” you are ready to run code on the notebook. 

If this is your first time using Colaboratory, you may have to add in. 

![Jupyter 1](/assets/images/post/demo-2/jupyter1.gif)

## Jupyter Notebook in your machine

If you wish to run Jupyter Notebook locally, here is some step-by-step guidance.
### Step 1.Install Jupyter Notebook (skip if you already have one)
You can install via Anaconda or via Pip (more info [here](https://jupyter.readthedocs.io/en/latest/install.html)). This demo is for a Jupyter Notebook via Anaconda. Once installed on your machine, open Jupyter Notebook and create a new page.

### Step 2. Install the btrdb package 
Our data is stored in the [BTrDB](https://blog.ni4ai.org/post/2019-12-12-btrdb-explained/) (pronounced “Better DB”) server. All you need is to install the btrdb package to access the database. 

If you are using Jupyter Notebook, simply install by entering “conda install -c pingthings btrdb”  Otherwise you can do a pip install with  “$ pip install btrdb ”
Detailed installation guidance can be found [on the btrdb site](https://btrdb.readthedocs.io/en/latest/installing.html)

### Step 3. Calling btrdb
After installation, all you need to do is use an “import” statement to make sure that BTrDB is ready to be called in every notebook that you use going forward. 

![Jupyter 2](/assets/images/post/demo-2/jupyter2.gif)

### Step 4. Exploring the Data
Now let’s try out [coding from Sacha](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/) to explore Sunshine Data. To save you time, [here](https://drive.google.com/file/d/1DAecP25WQKm9K2LDZgu-s1x8ZKKcPloU/view?usp=sharing) is the Jupyter Notebook with her coding. 

All you need to do in the notebook is:

Update the API key (enter yours, shown under “profile”)
If you have not installed the package called “tabulate”, install just like you installed “btrdb” - use this code “conda install -c conda-forge tabulate” - (for Anaconda users)

API key can be found under your Profile.

![API KEY](/assets/images/post/demo-2/apikey.png)
Once those two things are updated, click on Run.
All the outputs should come up just as Sacha describes in her blog, Voilà!

If you want to change your selection of stream, you can simply replace uuid and the appropriate information like start and end time etc

## Ready for your own analysis!

There is more interesting analysis with sample coding available here:
[Our Blogs](https://blog.ni4ai.org/): our world class data science and UC Berkeley teams can offer you sample analysis and show you what NI4AI is capable of. Any content questions or feedback please feel free to contact us at [NI4AI@info.io](NI4AI@info.io)
[Btrdb Documentation](https://btrdb.readthedocs.io/en/latest/quick-start.html#viewing-a-stream-s-data): How to get started with the Btrdb database and coding tips Github [btrdb-python](https://github.com/BTrDB/btrdb-python)

Happy Analyzing!
