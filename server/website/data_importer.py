import pandas as pd
from io import BytesIO

def import_subjects(bucket, engine):
    # Get the CSV file from Google Cloud Storage
    blob = bucket.blob('subjects_data.csv')  # replace 'subjects_data.csv' with your actual filename

    # Download the CSV as a string
    data = blob.download_as_text()

    # Define the column(s) you want to keep
    columns_to_keep = ['id', 'subject', 'foreign_id_school']

    # Read the CSV file with only the specified column
    df = pd.read_csv(BytesIO(data.encode('utf-8')), usecols=columns_to_keep)

    # Write the data to MySQL
    df.to_sql('subjects', engine, if_exists='append', index=False)
  
def import_grades(bucket, engine):
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

def import_subsections(bucket, engine):
    # Get the CSV file from Google Cloud Storage
    blob = bucket.blob('subsections_data.csv')  # replace 'grades_data.csv' with your actual filename

    # Download the CSV as a string
    data = blob.download_as_text()

    # Define the column(s) you want to keep
    columns_to_keep = ['id', 'subsection', 'foreign_id_grade']

    # Read the CSV file with only the specified columns
    df = pd.read_csv(BytesIO(data.encode('utf-8')), usecols=columns_to_keep)

    # Extract the last number from 'foreign_id_grade'
    df['foreign_id_grade'] = df['foreign_id_grade'].apply(lambda x: x.split('-')[-1])

    # Write the data to MySQL
    df.to_sql('subsections', engine, if_exists='append', index=False)

def import_central_contents(bucket, engine):
    # Get the CSV file from Google Cloud Storage
    blob = bucket.blob('central_contents_data.csv')  # replace 'grades_data.csv' with your actual filename

    # Download the CSV as a string
    data = blob.download_as_text()

    # Define the column(s) you want to keep
    columns_to_keep = ['id', 'central_content', 'foreign_id_subsection']

    # Read the CSV file with only the specified columns
    df = pd.read_csv(BytesIO(data.encode('utf-8')), usecols=columns_to_keep)

    # Extract the last number from 'foreign_id_subsection'
    df['foreign_id_subsection'] = df['foreign_id_subsection'].apply(lambda x: x.split('-')[-1])

    # Write the data to MySQL
    df.to_sql('central_contents', engine, if_exists='append', index=False)

def import_central_requirements(bucket, engine):
    # Get the CSV file from Google Cloud Storage
    blob = bucket.blob('central_requirements_data.csv')  # replace 'grades_data.csv' with your actual filename

    # Download the CSV as a string
    data = blob.download_as_text()

    # Define the column(s) you want to keep
    columns_to_keep = ['id', 'central_requirement', 'foreign_id_grade']

    # Read the CSV file with only the specified columns
    df = pd.read_csv(BytesIO(data.encode('utf-8')), usecols=columns_to_keep)

    # Extract the last number from 'foreign_id_grade'
    df['foreign_id_grade'] = df['foreign_id_grade'].apply(lambda x: x.split('-')[-1])

    # Write the data to MySQL
    df.to_sql('central_requirements', engine, if_exists='append', index=False)