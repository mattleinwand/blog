---
date: '2021-07-02T14:00:00+0000'
description: Metadata about streams can help to put the data in context. Here's a tutorial showing various ways of interacting with metadata in the platfrom    .
featuredImage: '/assets/images/post/metadata/metadata.png'
tags:
- ni4ai-tutorials
title: Querying Metadata
author: laurel
---

This blog post offers a tutorial demonstrating various options for querying and interacting with metadata about streams. A copy of the code is available in our [github repository](https://github.com/PingThingsIO/ni4ai-notebooks/tree/main/tutorials).


### What is Metadata?

Metadata reports high-level information about data that is in a stream, such as where it was collected or how it relates to other streams in the database. This tutorial illustrates various functions for interacting with metadata in the database. 

### Functions covered in this tutorial:

- [`db.streams_in_collection()`](https://btrdb.readthedocs.io/en/latest/api/conn.html#btrdb.conn.BTrDB.streams_in_collection)
- [`db.collection_metadata()`](https://btrdb.readthedocs.io/en/latest/api/conn.html#btrdb.conn.BTrDB.collection_metadata)
- [`db.query()`](https://btrdb.readthedocs.io/en/latest/api/conn.html#btrdb.conn.BTrDB.query)


```python
import btrdb
import pandas as pd
from matplotlib import pyplot as plt
```


```python
db = btrdb.connect()
```

### About the data
This tutorial uses a data collection ``POW/signatures`` which includes time series data from upwards of 200 events captured by digital fault recorders (DFRs) on the grid. The raw data set includes a 2-second snapshot of the raw waveform data recorded during each fault, as well as information collected after the fact to document what had caused the fault.


```python
collection = 'POW/signatures'
streams = db.streams_in_collection(collection)
```

# Accessing metadata fields

Each stream includes two types of metadata:
- **Tags** describe required fields, such as the stream name and units
- **Annotations**: describe optional fields which are specified by the user.

Different types of metadata can be retrieved using [`stream.tags()`](https://btrdb.readthedocs.io/en/latest/api/streams.html#btrdb.stream.Stream.tags) and [`stream.annotations()`](https://btrdb.readthedocs.io/en/latest/api/streams.html#btrdb.stream.Stream.annotations).


```python
stream = streams[1]

print('COLLECTION:', stream.collection)

print('\n#################')
print('   TAGS')
print(pd.Series(stream.tags()))

print('\n#################')
print('   ANNOTATIONS')
pd.Series(stream.annotations()[0])
```

    COLLECTION: POW/signatures/event2907
    
    #################
       TAGS
    ingress           
    distiller         
    name            Vb
    unit         volts
    dtype: object
    
    #################
       ANNOTATIONS





    Weather                                                         Major Storm
    DataSource                              https://pqmon.epri.com/see_all.html
    Phase                                                                     2
    EventId                                                                2907
    FailedEquipmentCode                                                 Unknown
    IsolationEquipmentCode                                             Recloser
    Cause                                                             Lightning
    FeederId                                                          F_0000026
    SiteName                                                           Site0010
    EventTime                                        2006-08-01 18:07:56.609000
    Details                   A lightning strike caused a recloser on  F_000...
    dtype: object



## Birds eye view

One can get a high-level overview of metadata fields available for streams in a given collection using [`db.collection_metadata`](https://btrdb.readthedocs.io/en/latest/api/conn.html#btrdb.conn.BTrDB.collection_metadata).


```python
metadata = db.collection_metadata(collection)
metadata
```




    ({'ingress': 0, 'distiller': 0, 'name': 0, 'unit': 0},
     {'Cause': 1773,
      'DataSource': 1773,
      'Details': 1773,
      'EventId': 1773,
      'EventTime': 1773,
      'FailedEquipmentCode': 1773,
      'FeederId': 1773,
      'IsolationEquipmentCode': 1773,
      'Phase': 1773,
      'SiteName': 1773,
      'Weather': 1773})



# Filtering on metadata contents

Metadata can provide a useful mechanism for determining what streams are relevant to a particular analysis. Two examples of filtering streams based on metadata contents are provided below.


```python
# Find all voltage streams for a given event
event_name = stream.collection
print(event_name)
streams = db.streams_in_collection(event_name, 
                                   tags={'unit':'volts'})
streams
```

    POW/signatures/event2907





    [<Stream collection=POW/signatures/event2907 name=Vb>,
     <Stream collection=POW/signatures/event2907 name=Va>,
     <Stream collection=POW/signatures/event2907 name=Vc>]




```python
# Find all fault events caused by lightning during a major storm
annotations = {'Cause': 'Lightning',
              'Weather': 'Major Storm'}
streams = db.streams_in_collection(collection, 
                                   annotations=annotations)

print("%i streams selected from across %i collections"
      %(len(streams), len(list(set([s.collection for s in streams])))))
```

    63 streams selected from across 9 collections


# Using SQL to query metadata

Above, we used dictionaries to specify filtering criteria in terms of tags and annotations we wished to filter upon. You can achieve the same results using the `db.query()` function which allows you to pass any arbitrary SQL query. That query is applied to the database table that stores metadata, and offers much greater flexibility for specifying complex search criteria.


```python
##################
# Specify query
query = """SELECT uuid, name, unit from streams 
            WHERE collection LIKE $1 and unit='volts'"""

params = ['%%event%s'%(stream.annotations()[0]['EventId'])]

##################
# Find Streams
streams_dict = db.query(query, params)
streams = db.streams(*[s['uuid'] for s in streams_dict])


##################
# Get data!
start = min([s.time for s in streams.earliest()])
end = max([s.time for s in streams.latest()])
df = streams.filter(start=start, end=end).to_dataframe()


```

# Doc strings for functions used


```python
print(db.streams_in_collection.__doc__)
```

    
            Search for streams matching given parameters
    
            This function allows for searching
    
            Parameters
            ----------
            collection: str
                collections to use when searching for streams, case sensitive.
            is_collection_prefix: bool
                Whether the collection is a prefix.
            tags: Dict[str, str]
                The tags to identify the stream.
            annotations: Dict[str, str]
                The annotations to identify the stream.
    
            Returns
            ------
            list
                A list of stream objects found with the provided search arguments.
    
            



```python
print(db.streams_in_collection.__doc__)
```

    
            Search for streams matching given parameters
    
            This function allows for searching
    
            Parameters
            ----------
            collection: str
                collections to use when searching for streams, case sensitive.
            is_collection_prefix: bool
                Whether the collection is a prefix.
            tags: Dict[str, str]
                The tags to identify the stream.
            annotations: Dict[str, str]
                The annotations to identify the stream.
    
            Returns
            ------
            list
                A list of stream objects found with the provided search arguments.
    
            



```python
print(db.query.__doc__)
```

    
            Performs a SQL query on the database metadata and returns a list of
            dictionaries from the resulting cursor.
    
            Parameters
            ----------
            stmt: str
                a SQL statement to be executed on the BTrDB metadata.  Available
                tables are noted below.  To sanitize inputs use a `$1` style parameter such as
                `select * from streams where name = $1 or name = $2`.
            params: list or tuple
                a list of parameter values to be sanitized and interpolated into the
                SQL statement. Using parameters forces value/type checking and is
                considered a best practice at the very least.
    
            Returns
            -------
            list
                a list of dictionary object representing the cursor results.
    
    
            Notes
            -------
            Parameters will be inserted into the SQL statement as noted by the
            paramter number such as `$1`, `$2`, or `$3`.  The `streams` table is
            available for `SELECT` statements only.
    
            See https://btrdb.readthedocs.io/en/latest/ for more info.
            



```python

```


```python

```
