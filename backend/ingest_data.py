import requests
import base64

url = 'http://localhost:8000/graphql'

with open('./patients_and_appointments.txt', 'rb') as file:
    file_data = file.read()
encoded_data = base64.b64encode(file_data).decode('utf-8')

query = """
mutation IngestData($csvData: String!) {
  ingestCsvData(csvData: $csvData)
}
"""

variables = {
    'csvData': encoded_data
}

response = requests.post(url, json={'query': query, 'variables': variables})
print(response.json())