import os
from google.oauth2.service_account import Credentials
from google.cloud import storage

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

# Lists all the buckets in your project
buckets = list(client.list_buckets())
print(buckets)
