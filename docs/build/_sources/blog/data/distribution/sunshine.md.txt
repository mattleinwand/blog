---
# Sunshine

The `sunshine` collection provides several months of continuous monitoring data from six distribution PMUs (or synchrophasors) deployed on a grid with significant solar PV generation. The dataset has been anonymized to remove sensitive and location-specific information.

The data were collected with micro-PMUs during an early research deployment. Each PMU reports data at 120 frames per second on twelve channels: three-phase voltage and current, giving root-mean-square magnitude and phase angle for each. Gaps in the data correspond to outages as the team was experimenting with different system configurations and wireless communications.

While all six are within the same city, there are three separate distribution circuits, equipped with two sensors each. The dataset was collected for academic power engineering research and has been anonymized to remove sensitive and location-specific information.

The six sensor locations correspond to three substation buses, one large PV array, and two university buildings. 

```
PMU1 - PV array
PMU3 - Substation where this PV array is connected
```

```
PMU6 - Building
PMU4 - Substation where this building is connected
The impedance between PMUs 4 and 6 is estimated at
Pos seq 0.76 + j0.463
Neg seq 1.782 + j1.234
```

```
PMU2 - Building
PMU5 - Substation where this building is connected
The impedance between PMUs 2 and 5 is estimated at
Pos seq 0.489 + j0.59
Neg seq 0.971 + j1.476
```


## Related Blog Posts

- Exploring the Sunshine data
- Spectral analysis
- Solar disaggregation
- Blue Cut Fire
- Power factor analysis
- Voltage Sag Safari