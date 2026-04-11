# PHM North America 2025 Conference Data Challenge

## About
Link to [PHM North America](https://data.phmsociety.org/phm-north-america-2025-conference-data-challenge/)

Engine Health Management for aircraft engines includes assessment of the health of gas-path components as well as externals such as controls and accessories. Dedicated diagnostic sensors are used for monitoring structural health using vibration sensors as well as fuel and oil/lube systems.

An engine will undergo several ‘cycles’ of changes in speed and temperature from low values at idle to high values at takeoff. Cyclic stresses cause engine components to deteriorate. Typically, each aircraft flight is counted as one engine cycle. An aircraft flight between a pair of cities will consist of ground idle, taxi out, takeoff, climb, cruise, descent, approach and landing, and taxi back.

This challenge problem limits itself to the use of aircraft sensors and gas-path sensors to estimate the time (cycles) remaining for periodic maintenance activities such as water wash and long term servicing of key components – the High Pressure Compressor and the High Pressure Turbine.

## Objective

The 2025 EHM Data Challenge focuses on predicting key maintenance events for commercial jet engines using typically available sensor data. Participants must build models to estimate remaining cycles to three key events:

- High Pressure Turbine (HPT) Shop Visit
- High Pressure Compressor (HPC) Shop Visit
- HPC Water-Wash

The goal is to split the dataset into training, validation, and test sets, develop predictive models, and submit results in format consistent with the guidelines provided in this document.

## Problem

Participants are given metadata and sensor data for eight commercial jet engines (ESN101 to ESN108), each with up to 15,000 data points across 2001 flights. As typical of commercial aviation industry, data includes up to eight snapshots per flight from different flight phases (e.g., Takeoff, Climb, Cruise). Snapshots are recorded states of a set of sensors at pretermined flight conditions.

You must predict:

- Cycles_to_HPT_SV – Cycles to Shop Visit for the High Pressure Turbine (HPT) (typically <= ~6000 cycles )
- Cycles_to_HPC_SV – Cycles to Shop Visit for the High Pressure Compressor (HPC) (typically <= ~12500 cycles)
- Cycles_to_WW – Cycles to HPC Water-Wash (typically <= ~1250 cycles)

Sensor data from up to 14 available variables can be used (the last two sensors are generally optional and may or may not be available in all Test datasets). Participants are encouraged to avoid ‘peeking into the future’ i.e. using metadata that reflects post-event states when building their models. In other words, any prediction p(t) made at a time t should only use inputs available until that time, i.e. time <= t.

## Example Submission Format

Participants will submit predictions as a CSV file with:

- file
- Cycles_to_HPT_SV
- Cycles_to_HPC_SV
- Cycles_to_WW

## Scoring

Prediction accuracy is the primary metric however, scores will be aggregated with two levels of asymmetry.

Penalties for making “late predictions” are higher than “early predictions” for all three predicted variables.
Penalties are also higher if an error is made closer to actual event time than when prediction horizon is larger when measured from the actual event ground truth.