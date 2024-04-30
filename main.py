import requests
from bs4 import BeautifulSoup
import random

def fetch_watchlist(username):
    url = f'https://letterboxd.com/{username}/watchlist/'
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"An error occurred while making a network request: {e}")
        return None

def parse_watchlist(html):
    soup = BeautifulSoup(html, 'html.parser')
    titles = [img['alt'] for img in soup.select('li.poster-container img') if img.has_attr('alt')]
    return titles

def main():
    username = input("Enter your Letterboxd username: ")
    data = []
    html_cache = None

    while True:
        if not html_cache:
            html_cache = fetch_watchlist(username)
            if html_cache:
                data = parse_watchlist(html_cache)

        if data:
            print(random.choice(data))
        else:
            print("No data found.")

        exit_value = input("Type 'exit' to quit or press Enter to continue: ")
        if exit_value.lower() == 'exit':
            break

if __name__ == "__main__":
    main()
