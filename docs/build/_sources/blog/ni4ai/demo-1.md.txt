# Demo (Part 2): Exploring Data in "The Plotter"
> Author: Nica Campbell
> 
> Date: July 28, 2020
> 
> This post gives a demo for new users to learn about various features of our front end interface called "The Plotter". Here, we'll describe how to search for data streams, access metadata, and generate "permalinks" for sharing data with your colleagues.

---

This post aims to familiarize new users with a few different ways of interacting with data using "The Plotter".
The plotter offers the following features:
- A searchable table for finding and selecting data in the platform
- Metadata about each data stream
- A visualization tool for viewing the selected data

There are a few options for saving and sharing work you do in the plotter:
- [Generate a "permalink"](#permalink) to the visual you generated
- [Save and export images](#imageexport)
<!-- - [Export summary statistics](#csvexport) to CSV  -->
- [Export Python code](#python) to move your analysis from the Plotter into a Jupyter notebook

We'll use the "Sunshine" dataset as an example. 
Here's a blog post you can read to learn more about [the data](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/).


## Navigating the plotter
<a name="navigation"></a>

The “All Streams” table lists all of the data streams available on NI4AI. 
If you know what you're looking for, you can find it by typing the search terms in the "COLLECTION" box. 
For example, if you type “Sunshine” you'll see data streams reporting current, voltage, and angle measurements for six PMUs.

A "stream" is sequence of time series values. 
Each value in the stream is a data point with a time stamp associated with it. Each stream comes with [metadata](https://en.wikipedia.org/wiki/Metadata) (i.e., data about the data). 
Metadata is reported in [JSON format](https://en.wikipedia.org/wiki/JSON) in the bottom right corner of the screen. Metadata fields provide context relevant to interpreting the data -- such as the units, measurement location, or things to look for in the data. Metadata fields may differ from one stream to another depending on what is measured, and depending on what information a particular data provider was willing and able to share.

Every stream includes a metadata field called “UUID” that gives a unique ID used for querying the database. This UUID is relevant to specifying streams when querying the API. We say more on this in a blog post about [interacting with our API](https://blog.ni4ai.org/post/2020-07-29-demo-2/).

![LOGIN](blog-demo-1/login.gif)

## Share your work by creating a permanent link or "permalink"
<a name="permalink"></a>

Once you select which streams you want to visualize, you can create a permanent link that saves your selection. You can use this to come back to the visualization at any time, or to share what you're looking at with collaborators.

![SAVE WORK](blog-demo-1/save-work.gif)

## Save your plot as an image
<a name="imageexport"></a>

You can use the plotter to zoom in on specific events or time intervals in the data. To share a visualization, you can either save the graph as an image, or copy and paste.

![SAVE IMAGE](blog-demo-1/save-as-image.gif)

<!-- ### Download summary statistics to a CSV
<a name="csvexport"></a>

If you would like to dig further in excel or upload into other applications, you can export data to CSV. Use “Aggregated Data” to reduce the file volume. You can control how you aggregate.

![CSV](/assets/images/post/blog-demo-1/csv.gif) -->

## Transition your analysis to a Jupyter Notebook

<a name="python"></a>

You can also interact with the data directly through the Python API to do analysis or to generate visualizations of your own. The “Export to Jupyter” button generates a code snippet you can copy and paste directly into a Jupyter notebook or Python script.

![Jupyter](blog-demo-1/Jupyter.gif)

You will need to install the btrdb python package to connect to the database. You can find more information [here](https://btrdb.readthedocs.io/en/latest/installing.html). 

Useful tips and code samples are available on our blogs and in the [BTrDB docs](https://btrdb.readthedocs.io/en/latest/quick-start.html).

Stay tuned for more demos, and happy analyzing!
