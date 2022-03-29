# Demo (Part 2): Establishing an API Connection
> Author: Nica Campbell
> 
> Date: July 30, 2020
> 
> This blog post offers a step-by-step tutorial for new users to connect to our API using the Python bindings.
---

Hello, and welcome back!


Here, we'll use the blog post “A brief walkthrough of the Sunshine uPMU dataset" ([here](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/)) as a demo to show you how you can access the API. 

Here, we show you how to run a jupyter notebook in Google Colaboratory, and on your own machine.
Google Colaboratory is like a Google Doc for sharing Jupyter notebooks. 
Colab notebooks run on a virtual machine in the cloud, which means you can run them without having install python or other packages locally. 
You'll need a Google account to run colab notebooks in the cloud, but you can still download the notebook and run it locally without an account.

You can access our Colab Notebook [here](https://drive.google.com/file/d/1DAecP25WQKm9K2LDZgu-s1x8ZKKcPloU/view?usp=sharing). Select "Open with Google Colaboratory” and it'll open up a new tab allowing you to run code directly in your browser. You may need to install the Google Colaboratory add in if you haven't done so already.

Because colab notebooks run on virtual machines, you'll need to run: 

`!pip install btrdb` 

every time you open up a new notebook server. This installs the btrdb python package (more on this later) on the new virtual machine.

![Jupyter 1](demo-2/jupyter1.gif)

## Running a Jupyter Notebook on Your Machine
### Step 1. Install Jupyter Notebooks
You can install Jupyter Notebooks using Anaconda or pip (more info [here](https://jupyter.readthedocs.io/en/latest/install.html)).

### Step 2. Install the btrdb python package 
The NI4AI database is built on [BTrDB](https://blog.ni4ai.org/post/2019-12-12-btrdb-explained/) (pronounced “Better DB”). 
You'll use the "btrdb" python library to connect to the database, and to make queries. You can find the install guide on the [btrdb website](https://btrdb.readthedocs.io/en/latest/installing.html).

### Step 3. Getting Your API Key
All of the code we post on the blog has a place for you to enter your own API key. 
Your API key is a randomly generated 24-digit alpha numberic code that lets us know who you are.
This allows us to keep track of how many people are using the API and how often.
It also lets us know what data you have access to.
Any of the data you see listed in the plotter is data you can access through the API.

You can find your API key by logging in at ni4ai.org. 
It'll be listed under your "Profile" in the top right corner of the screen.

Once you have your key, the syntax for connecting to the database looks like this:

```python 
YOUR_API_KEY = 'copy_and_paste_your_api_key_here'
db = btrdb.connect("api.ni4ai.org:4411", apikey=YOUR_API_KEY)
```


![API KEY](demo-2/apikey.png)


## Developing Data Analytics
Once you have an API key and a jupyter notebook, you'll be able to copy code from any of our blog posts and run it locally on your machine.

For example, you can run code from Sascha's [blog post](https://blog.ni4ai.org/post/2020-03-30-sunshine-data/).
You can download the colab notebook [here](https://drive.google.com/file/d/1DAecP25WQKm9K2LDZgu-s1x8ZKKcPloU/view?usp=sharing). 

These blog posts are just intended to get you started. 
We encourage you to become familiar with the code on our blog, and then to keep exploring questions of your own.

For ideas about what you can do with the data we host, we encourage you to read our blog post [here](https://blog.ni4ai.org/post/2020-07-31-expertise-for-expert/) which lists resources that will help you learn more about the grid and about the data.