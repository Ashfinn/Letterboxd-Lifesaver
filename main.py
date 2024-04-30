import requests
from bs4 import BeautifulSoup
import random

data = []

while True:
    try:
        response = requests.get('https://letterboxd.com/ashfin/watchlist/')
        response.raise_for_status()  # Raises an HTTPError for bad responses
        soup = BeautifulSoup(response.text, 'html.parser')

        for e in soup.select('li.poster-container'):
            img = e.find('img')
            if img and img.has_attr('alt'):
                data.append(img['alt'])

        if data:  # Check if data list is not empty
            num = random.randint(0, len(data) - 1)  # Correct index range
            print(data[num])
        else:
            print("No data found.")

        exit_value = input("type 1 to exit:   ")
        if exit_value == '1':
            break

    except requests.RequestException as e:
        print(f"An error occurred while making a network request: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
