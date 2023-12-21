import requests
from bs4 import BeautifulSoup
import random

data = []

response = requests.get('https://letterboxd.com/ashfin/watchlist/')
soup = BeautifulSoup(response.text, 'html.parser')

for e in soup.select('li.poster-container'):
    img = e.find('img')
    if img and img.has_attr('alt'):
        data.append(img['alt'])

num = random.randint(0, len(data))
print(data[num])
