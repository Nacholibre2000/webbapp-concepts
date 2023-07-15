import pandas as pd
from io import BytesIO

def import_data(bucket, engine):
    # Get the CSV file from Google Cloud Storage
    blob = bucket.blob('grades_data.csv')  # replace 'grades_data.csv' with your actual filename

    # Download the CSV as a string
    data = blob.download_as_text()

    # Define the column(s) you want to keep
    columns_to_keep = ['id', 'grade', 'foreign_id_subject']

    # Read the CSV file with only the specified columns
    df = pd.read_csv(BytesIO(data.encode('utf-8')), usecols=columns_to_keep)

    # Extract the last number from 'foreign_id_subject'
    df['foreign_id_subject'] = df['foreign_id_subject'].apply(lambda x: x.split('-')[-1])

    # Write the data to MySQL
    df.to_sql('grades', engine, if_exists='append', index=False)
