import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy import text
from google.oauth2.service_account import Credentials
from google.cloud import storage
from io import BytesIO
import data_importer  # import the module you created

# Retrieve each environment variable and store it in a dictionary.
service_account_info = {
  "type": os.getenv("type"),
  "project_id": os.getenv("project_id"),
  "private_key_id": os.getenv("private_key_id"),
  "private_key": os.getenv("private_key"),
  "client_email": os.getenv("client_email"),
  "client_id": os.getenv("client_id"),
  "auth_uri": os.getenv("auth_uri"),
  "token_uri": os.getenv("token_uri"),
  "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
  "client_x509_cert_url": os.getenv("client_x509_cert_url"),
}

# Create the credentials from the service account info.
credentials = Credentials.from_service_account_info(service_account_info)

client = storage.Client(credentials=credentials, project=service_account_info['project_id'])

# Create an engine to the MySQL database
engine = create_engine(f'mysql+mysqlconnector://{os.getenv("DB_USER")}:{os.getenv("DB_PASS")}@{os.getenv("DB_HOST")}/{os.getenv("DB_NAME")}')

# Get the CSV file from Google Cloud Storage
bucket = client.get_bucket('web-app-concepts-storage')  # replace with your bucket name

# Import functions

# To import subjects
#data_importer.import_subjects(bucket, engine)

# To import grades
#data_importer.import_grades(bucket, engine)

# To import subsections
#data_importer.import_subsections(bucket, engine)

# To import central contents
#data_importer.import_central_contents(bucket, engine)

# To import central requirements
data_importer.import_central_requirements(bucket, engine)