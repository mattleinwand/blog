---
date: '2020-02-04T16:46:23-05:00'
description: A brief overview of training linear models with btrdb data
tags:
- Explainers
- NI4AI
- Distributed Computing
- Algorithms

title: Training General Linear Models with the PredictiveGrid™
author: ben
featuredImage: '/assets/images/post/default.jpg'
---

## Linear Modeling Process Overview

[BTrDB (the Berkeley Tree Database)](http://sdb.cs.berkeley.edu/sdb/btrdb.php#) is the core of the PredictiveGrid™ and implements a time series database API that is extremely effective for distributed analytics including the training of general linear models. To efficiently distribute storage to accommodate a high rate of data ingest from multiple sensors, data is stored in independent streams. As a result, univariate forecasting models are very easy to construct since, unlike querying a database table, queries are directly to measurement streams. Multivariate modeling usually takes two forms: either the expansion of features from a single stream (usually via FFT) or via an in-memory join of multiple streams that are time-aligned by the database.

The API supports raw values queries but also queries at arbitrary levels of time granularity with constant time aggregation. Moreover, the database has native support for windowing and time alignment queries, minimizing the work needed for pre-model data wrangling. We have bindings in multiple languages including [Julia](https://pingthingsio.github.io/BTrDB.jl/v5.6/) and [Python](https://btrdb.readthedocs.io/en/latest/). Queries in Python return data as NumPy arrays or pandas Series or DataFrames. These formats are well suited for immediate use by the SciPy stack including basic time series analysis with lag means, cumulative series, ARIMA, or other seasonality based forecasting methods. Linear models can be easily implemented with either [StatsModels](https://www.statsmodels.org/stable/index.html) or [scikit-learn.](https://scikit-learn.org/stable/) Generally, we’ve found that non-parametric models such as random forest or gradient boosting perform best with the random walk-like voltage and current measurements we typically work on. However, data returned from a query can be easily funneled into any pipeline that exposes the scikit-learn API including logistic or polynomial regressions, stochastic gradient descent, SVMs, etc.

To provide ease of use for these types of low-density, in-memory computations, the platform is deployed with a standard [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/) environment that is pre-configured with database connection details. Our JupyterHub is deployed using [Kubernetes](https://kubernetes.io/), so user pods can be variably sized to different compute and memory requirements and all user pods are isolated from other users. JupyterHub also allows us to provide a user interface to distributed computing environments such as [Ray](https://rise.cs.berkeley.edu/projects/ray/) and [TensorFlow.](https://www.tensorflow.org/)

For distributed analytics, we tend to prefer Ray, TensorFlow, and [DISTIL](https://escholarship.org/content/qt61w8z66w/qt61w8z66w.pdf), but have support for other distributed analytics frameworks such as Spark. Ray is a project currently in development at the UC Berkeley RISE Lab as a successor to [Spark.](https://spark.apache.org/) We parallelize data in two ways to Ray and Spark executor nodes. The first method is to use [Apache Arrow](https://arrow.apache.org/) and [Modin](https://modin.readthedocs.io/en/latest/) to distribute a DataFrame across executors a cluster, this method ensures that the user has complete control of the data parallelization but creates a bottleneck at the user notebook. The second way is to partition the query, typically by time range, so that each executor independently queries the database for its shard, allowing parallel data loading from the database. In Spark, this is handled with a custom RDD type and in Ray using a special query decorator.

We have also found that deep learning time series methods such as RNNs and LSTMS are also effective for linear models on the data we have used. We have implemented a BTrDB-specific Dataset that extends the TensorFlow 2.0 Dataset to allow ease of batching and graph parallelization. Currently, the Dataset also parallelizes data with a bottleneck at the notebook because generated code is required to extend the SQLDataset type. Because this type is experimental, we’ve opted for simpler, NumPy-based streaming with batch queries. However, because TensorFlow epochs are generally longer than data loading time, this loader hasn’t been a major blocker to our deep learning modeling efforts.

Finally, we’ve implemented a novel, platform-specific distributed computation system called DISTIL. DISTIL is used to apply idempotent computations on real-time data as its ingested and to historical data as fast as system resources will allow. DISTIL is able to take handle out-of-order and out-of-time data and acts similarly to micro-batch systems such as Spark Streaming. DISTIL is primarily used for large scale pre-computation of features that will be used to train linear models, or to apply a linear model in real-time for just-in-time forecasting.
