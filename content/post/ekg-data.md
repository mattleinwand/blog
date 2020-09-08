---
title: EKG Data
date: '2020-05-06T09:27:32-0400'
description: Exploring EKG data in the PredictiveGrid
featuredImage: '/assets/images/post/ekg-data/ekg.png'
tags: ["Data Descriptions", "NI4AI-data", "Visualization", "EKG Data"]
author: sascha
---

While the connection between cardiology and power systems might not be immediately obvious, the study of medical electrocardiograms (ECG or EKG, from the original German) in fact shares important similarities with the study of grid data such as synchrophasors. In each case, we are looking at a time-series of voltage measurements. An EKG measures the voltage across the heart, which corresponds to the polarization of muscle tissue that makes it contract. Certain periodicities are expected -- for example, a regular heartbeat, or diurnal variations in load on the electric grid -- but within these basic rhythms lies a more subtle information-rich signature. In each case, we are interested in detailed variations on shorter time scales. For one, we look to infer things about the underlying structure of the system from the data -- for example, the size of heart chambers, or the impedance of a circuit. Also, we look for the distinction between healthy and unhealthy behaviors -- for example, whether a patient is having a heart attack, or whether there is a fault on the power system. With EKG and grid data side-by-side, the PredictiveGrid platform supports the exploration of algorithms that identify unique characteristics or anomalies in these time-series voltage data streams.

![EKG Data](/assets/images/post/ekg-data/ekg.png)

The use of EKGs for medical diagnostics long predates the advent of computerized data analysis. Back in the day, a mechanical recorder would capture analog measurements with ink on paper. Getting any value from this information hinged on the ability of highly skilled professionals to draw meaningful conclusions from these traces. On the one hand, cardiologists applied first principles, such as an anatomical and physiological understanding of what should be driving the voltage signature. On the other hand, generations of clinicians trained by empirically observing and recording large numbers of EKGs. This ability has been significantly aided by modern technology, which allows for rapid comparison of much larger and more detailed data sets.

Similarly, electric grid operators have traditionally relied on their professional experience to evaluate measurement data, using a combination of physical knowledge about the system and a form of wisdom and intuition based on the accumulation of many observations over the years. Because this empirical component is so indispensable, seniority on the job and familiarity with the particular local system have always been highly valued in system operations.

Today, the technology exists to greatly enhance and accelerate what smart and knowledgeable humans can do with data. Not only are measurements available at much higher precision or granularity, but observational experiments can be repeated in the computational environment at rates and volumes that are orders of magnitude beyond what a human can experience in their lifetime.

Of course, quantity is not the same as quality. For a machine learning algorithm to improve upon what a human could learn over the course of many years, it must be asking the right questions. Just like learning in real life is an iterative process of gathering impressions, reflecting upon them, and seeking out further experiences, developing good algorithms is an interactive process of testing assumptions, making and interpreting observations, and experimenting with new things.

This is why the NI4AI project brings together data scientists with domain experts including academic researchers and seasoned professionals from the electric power industry. Now that the logistic problem of learning from large, shared datasets has been solved, we can generate new knowledge together in unprecedented ways.

## Accessing EKG Data

The EKG data can be found in the NI4AI platform under the `Health/EKG` collection prefix, in patient-specific collections. Using the btrdb-python bindings, we can list the number of patients whose data is in the PredictiveGrid as follows:

```python
import btrdb

db = btrdb.connect("api.ni4ai.org:4411", "myapikey")
patients = db.list_collections("Health/EKG")
```

We can get all of the EKG streams for a single patient as follows:

```python
streams = db.streams_in_collection("Health/EKG/patient001", is_collection_prefix=False)
```

To get information about the patient, we can access one of these streams annotations:

```python
annotations, version = streams[0].annotations()
```

```json
{
  "Lytic_agent": "Gamma-TPA",
  "Medication_preadmission": "Isosorbit-Dinitrate Digoxin Glibenclamide",
  "age": "81",
  "sex": "female",
  "Smoker": "no",
  "Chest_X-ray": "Heart size upper limit of norm",
  "Ventriculography": "Akinesia inferior wall",
  "Hemodynamics": "",
  "Admission_date": "29-Sep-90",
  "ECG_date": "18/10/1990",
  "Reason_for_admission": "Myocardial infarction",
  "Catheterization_date": "16-Oct-90",
  "Additional_diagnoses": "Diabetes mellitus",
  "Infarction_date": "29-Sep-90"
}
```
