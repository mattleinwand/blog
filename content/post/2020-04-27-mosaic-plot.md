---
title: "Visualize State of the Grid Using Mosaic Plot"
date: 2020-04-27T00:02:12-0700
description: "How to Visualize State of the Grid Using Mosaic Plot"
tags: ["btrdb", "python","plot","mosaic plot","analytics", "visualization"]
author: "brice"
---

Since the grid is interconnected, there may be value in analysing PMU streams data in association with the location of the PMUs if available.
A Pseudo Geographic Mosaic Plot [1] can be used to display the effects of an event detected on a PMU, on other PMUs and potentially determine relationships between PMUs based on their location or to just observe the state of the grid at any time.

## How it works 
 
A Pseudo Geographic Mosaic Plot sorts collections of PMUs by latitude, separates the collection in n columns, sorts each column by longitude before plotting each collection as a cell. The area of each cell relates to one variable (i.e mean VPHM) while the color of the cell relates to another variable (i.e mean IPHM).
Thanks to the location based sorting , every cell in a column represents a collection north of the cell below and south of the cell above, while every column is west of the columns on its right and east of the columns on its left.
A sample Mosaic plot is shown below, along with a plot showing the location of the PMUs collection.

![Sample Mosaic Plot](/media/post/2020-04-27-mosaic-plot/sample_plot_mosaic.png)
![Sample Collection Plot](/media/post/2020-04-27-mosaic-plot/sample_plot_clusters.png)


## Preparing the data

```python
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt, patches ,cm , colors
from colour import Color
import btrdb
```
The incoming data should be a Pandas Dataframe containing the following columns: "cluster_group" (the name of a PMU cluster that will be plotted as a cell), "latitude","longitude",area_var (the column in the pandas dataframe used to determine the area of each cell),color_var (the column in the pandas dataframe used to determine the color of each cell).

Note: values in the area_var column should all be positive.

Below is the head of our dataframe.
```python
df.head()
   cluster_group   latitude  longitude           mean      mean_i
0              0   8.070218   7.379529   47198.486804  110.769334
1              1   9.468417   5.715586   63682.359371   59.686781
2              2  10.608797   5.343275  123296.915415  273.363092
3              3  10.333213   4.154027  100576.912699  101.656060
4              4   8.752218   6.473883  119422.697092  290.830133
```
In our case the "mean" column represents the Voltage Phase Magnitude (VPHM) and will be the area_var while the "mean_i" column represents the Current Phase Magnitude and will be the color_var. 

The first step is to create the color gradient used to determine the color of each cell. 
Using the module  colour.Color (pip install color) we generate a list of 100 colour hexadecimal going from green to red.

A color hex is then assigned to each row in the dataframe from the color list. The color hex is assigned based on the value of the color_var in the row and two boundary values that would have the color green (lower bound of the color list, index of 0) and red (upper bound of the color list, index of 99).
We selected our lower and upper bounds to be the 10th and 90th quantile of the color_var respectively to prevent outlayers from shifting the colors of the graph too red or too green.

```python
def calculate_gradient_position(val,max_val,min_val):
    position=int(((val-min_val)/(max_val-min_val))*100)-1
    if position>99:
        return 99
    elif position<0:
        return 0
    else:
        return position

start_color=Color("green")
colors = list(start_color.range_to(Color("red"), 100))

max_val=df["mean_i"].quantile(q=0.90)
min_val=df["mean_i"].quantile(q=0.10)

df["color"]=df.apply(lambda row: colors[calculate_gradient_position(row["mean_i"],color_max,color_min)].hex,axis=1)
```

The dataframe is now ready to be plotted. 

## Generate the Plot

As mentioned previously the dataframe is: 
- sorted by longitude
- divided in n columns using numpy.array_split
- cells in each column are sorted by latitude 
- cells are plotted column by column 

The following code generates the plot. The Number of columns can be optimized in order to make the cells location reflect the geographic location as much as possible.
```python
n_columns=10
fig,ax=plt.subplots()
    # sort cells in columns by their longitude
df.sort_values(by="longitude", axis=0, inplace=True)

columns = np.array_split(df, n_columns)
total_area= df["mean"].sum()

# plotting rectangles
x_start=0
for column in columns:
    # sort cells in columns by their latitude
    column.sort_values(by="latitude",axis=0,inplace=True)
    # calculate area of column
    column_total=column["mean"].sum()
    
    column_width=column_total/total_area
    
    y_start=0
    for index, row in column.iterrows():
        cell_height=row["mean"]/column_total
        #plot rectangle
        ax.add_patch(plt.Rectangle(xy=(x_start,y_start),width=column_width,height=cell_height,fill=mosaic_has_colors,facecolor=row["color"],edgecolor="black"))
        center_y=(y_start+cell_height/2)
        # add cluster group on cell
        ax.annotate(row["cluster_group"],xy=(x_start+0.01,center_y))
            
        y_start+=cell_height
        
    x_start+=column_width

ax.axis("off")

# add color map to plot 
clist=[(0,0.5,0),(1,0,0)] #[rgb of colour module "green",rgb of colour module "red"]
cmap=colors.LinearSegmentedColormap.from_list('color_var', clist)
fig.colorbar(cm.ScalarMappable(norm=colors.Normalize(vmin=color_min, vmax=color_max),cmap=cmap))
```

## Work Directly with Btrdb 
We want to plot all the collections of a btrdb instance on mosaic plot with voltage phase magnitude as the area_var and current phase magnitude as a IPHM.  

Assuming that streams in the btrdb allocation have "latitude" and "longitude" data as part of their annotations and that collections are groups of streams in a specific location, data can be queried and prepared in the following way. 

- Imports
```python
from btrdb.utils.timez import to_nanoseconds
import math
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt, patches ,cm , colors
import btrdb
```

- Initiate btrdb connection
```python
conn=btrdb.connect(profile="")
```

- Get collections containing streams that have latitude and longitude as part of their annotations and VPHM or IPHM as their units
```python
stmt='''
select collection from streams 
where annotations ? "latitude" 
AND annotations ? "longitude" 
AND (unit = "VPHM" or unit ="IPHM")
'''

collections=conn.query(stmt)
collections=[collection["collection"] for collection in collections]
#remove duplicates collections
collections=list(dict.fromkeys(collections))
```

- Select the time window used to query the stream data and the windo
```python
start=to_nanoseconds("2020-04-27T12:50:0.0")
pointwidth=int(math.log(60*10**9,2)) #about 1 minutes windows
end=start+2**pointwidth #ensure a single stat point is returned for each stream
```

- Get streams metadata
The query only returns relevant streams (with geo location data and one of the two relevant units).
```python
stmt='''select * from streams 
        where annotations ? "latitude" 
        AND annotations ? "longitude" 
        AND (unit = "VPHM" or unit = "IPHM")
        AND collection in (%s)
        '''

collection_params=""
i=0
for collection in collections:
    collection_params+=",$"+str(i)
    i+=1
collection_params=collection_params[1:]

stmt=stmt%(collection_params)
streams=conn.query(stmt,[unit_1,unit_2,*collections])
```

- Get Stream data
```python
data=[]
for stream in streams:
    ann=stream.get("annotations",{})

    stream_data=conn.stream_from_uuid(stream.get("uuid",""))
    stream_data=stream_data.aligned_windows(start,end,pointwidth)

    row=[stream.get("collection",np.nan),
            stream.get("name",np.nan),
            stream.get("unit",np.nan),
            stream.get("uuid",np.nan),
            ann.get("latitude",np.nan),
            ann.get("longitude",np.nan),
            *(stream_data[0][0])
        ]
    data.append(row)      
```

- Set column names and remove incomplete rows
```python
columns=["collection","name","unit","uuid","latitude","longitude","time","min","mean","max","count","stddev"]
df=pd.DataFrame(data,columns=columns)

numeric_columns=["latitude","longitude","time","min","mean","max","count","stddev"]
df[numeric_columns]=df[numeric_columns].astype("float64")
df.dropna(inplace=True)
```

- Match rows with Current Phase Magnitude data to rows with Voltage Phase Magnitude data and
  group dataframe by collection
```python 
df["cluster_group"]=df["collection"] 
voltage_data=df[df["unit"]=="VPHM"].copy()
current_data=df[df["unit"]=="IPHM"].copy()

voltage_data=voltage_data.groupby("cluster_group").mean()
current_data=current_data.groupby("cluster_group").mean()

def get_matching_row:
    if row.name in df.index:
        return df.loc[row.name][["min","mean","max","count","stddev"]]
    else:
        return np.nan

# column with "_i" are part of the stat point from the current data
voltage_data[["min_i","mean_i","max_i","count_i","stddev_i"]]=voltage_data.apply(lambda row: get_matching_row(current_data,row),axis=1)

# remove incomplete rows
voltage_data.dropna(inplace=True)
```

- Finally, use the workflow in the Section "Generate Plot"

## References

[1] T. J. Overbye, J. Wert, A. Birchfield and J. D. Weber, "Wide-Area Electric Grid Visualization Using Pseudo-Geographic Mosaic Displays," 2019 North American Power Symposium (NAPS), Wichita, KS, USA, 2019, pp. 1-6.

