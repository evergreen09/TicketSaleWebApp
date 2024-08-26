import requests
import json

url = 'http://localhost:5000/add_user'

with open('user_data_int.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for key, value in data.items():
    user_data = {
        "userID": key,
        "name": value[0],
        "status": value[1],
        "price": value[2]
    }

    response = requests.post(url, json=user_data)

    # Check the response status code and content
    if response.status_code == 201:
        print("Success:", response.json())
    elif response.status_code == 400:
        print("Failed:", response.status_code, response.json())