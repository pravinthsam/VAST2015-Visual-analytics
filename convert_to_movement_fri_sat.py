import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pandas import Timestamp


for day in ['Fri', 'Sat']:
    print("Reading park-movement-{}.csv...".format(day))
    df = pd.read_csv("./data/park-movement-{}.csv".format(day))

    df['Timestamp'] = pd.to_datetime(df.Timestamp)

    df['Dates'] = df['Timestamp'].dt.date
    df['Hour'] = df['Timestamp'].dt.hour
    df['Minute'] = df['Timestamp'].dt.minute

    df.drop('Timestamp', axis=1, inplace=True)

    df = df[['Hour','Minute','Dates','type','id','X','Y']]


    mov = df.groupby(['Dates', 'Hour', 'Minute', 'id']).tail(1)

    with open('./data/{}_mov.json'.format(day), 'w') as f:
        f.write(mov.to_json(orient='records', lines=True))


    exit_time = mov.groupby(['id']).tail(1)

    with open('./data/{}_exit_time.json'.format(day), 'w') as f:
        f.write(exit_time.to_json(orient='records', lines=True))


    entry_time = mov.groupby(['id']).head(1)

    with open('./data/{}_entry_time.json'.format(day), 'w') as f:
        f.write(entry_time.to_json(orient='records', lines=True))
