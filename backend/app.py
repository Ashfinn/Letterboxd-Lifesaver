from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import requests
from bs4 import BeautifulSoup
import time
from functools import lru_cache

app = Flask(__name__, static_folder="../frontend/dist")  # Updated to point to the build folder
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Properly configured CORS

# Cache watchlist results for 1 hour to reduce scraping
@lru_cache(maxsize=100)
def fetch_watchlist_with_cache(username):
    return fetch_watchlist(username)

def fetch_watchlist(username):
    url = f'https://letterboxd.com/{username}/watchlist/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
    }
    try:
        print(f"Fetching watchlist for user: {username}")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        print(f"Successfully fetched watchlist. Status code: {response.status_code}")
        return response.text
    except requests.RequestException as e:
        print(f"An error occurred while making a network request: {e}")
        return None

def parse_watchlist(html):
    if not html:
        return []
   
    try:
        soup = BeautifulSoup(html, 'html.parser')
        movies = []
       
        # Find all poster containers using multiple selectors to handle different HTML structures
        poster_containers = soup.select('li.poster-container, .react-component.poster.film-poster')
        
        print(f"Found {len(poster_containers)} poster containers")
       
        for container in poster_containers:
            # Try to find img tag directly
            img_tag = container.select_one('img')
            
            if img_tag:
                # Extract title
                title = img_tag.get('alt', '')
                
                # Extract year if available
                year = ""
                span_title = container.select_one('.frame-title')
                if span_title and '(' in span_title.text and ')' in span_title.text:
                    title_parts = span_title.text.split('(')
                    year = title_parts[-1].replace(')', '').strip()
                
                # For debugging
                print(f"Found image tag with attributes: {img_tag.attrs}")
                
                # Get the image URL - directly from the raw HTML sample
                # Looking at your example, the image URL is in the src attribute
                image_url = img_tag.get('src', '')
                
                # Debug
                print(f"Initial image URL: {image_url}")
                
                # Check if srcset exists and it might contain higher resolution
                srcset = img_tag.get('srcset', '')
                if srcset:
                    print(f"Found srcset: {srcset}")
                    # Parse the srcset to get the highest resolution image
                    # Typically the last URL in srcset is the highest resolution (2x)
                    srcset_parts = srcset.split(',')
                    if srcset_parts and len(srcset_parts) > 1:
                        # Extract last URL (typically 2x)
                        last_part = srcset_parts[-1].strip()
                        # The URL is the part before the space
                        if ' ' in last_part:
                            high_res_url = last_part.split(' ')[0]
                            image_url = high_res_url
                
                # Ensure we have a complete URL
                if image_url:
                    # If URL is relative, make it absolute
                    if image_url.startswith('/'):
                        image_url = f"https://letterboxd.com{image_url}"
                    
                    # Letterboxd URLs often start with // which needs https: prefix
                    if image_url.startswith('//'):
                        image_url = f"https:{image_url}"
                    
                    # Handle https://a.ltrbxd.com URLs
                    # These are already absolute and shouldn't be modified
                    
                    print(f"Final image URL: {image_url}")
                    
                    movies.append({
                        'title': title,
                        'year': year,
                        'image_url': image_url
                    })
               
        return movies
    except Exception as e:
        print(f"Error parsing watchlist HTML: {e}")
        import traceback
        traceback.print_exc()
        return []

@app.route('/api/suggest', methods=['POST'])
def suggest_movie():
    data = request.get_json()
    username = data.get('username')
   
    if not username:
        return jsonify({"error": "Username is required"}), 400
   
    # Add basic validation for username
    if not username.isalnum() and not all(c.isalnum() or c in '-_' for c in username):
        return jsonify({"error": "Invalid username format"}), 400
   
    html_cache = fetch_watchlist_with_cache(username)
    
    # Add debug info about HTML content
    html_snippet = html_cache[:500] + "..." if html_cache else "No HTML content"
    print(f"Retrieved HTML (first 500 chars): {html_snippet}")
    
    movies = parse_watchlist(html_cache)
    
    # Debug info about parsed movies
    print(f"Parsed {len(movies)} movies from watchlist")
    if movies:
        print(f"First movie example: {movies[0]}")
   
    if not movies:
        return jsonify({"error": "No movies found in the watchlist or user not found"}), 404
   
    # Suggest a random movie from the watchlist
    suggested_movie = random.choice(movies)
    
    # Log what we're returning
    print(f"Suggesting movie: {suggested_movie}")
    
    return jsonify({
        "suggested_movie": suggested_movie["title"],
        "year": suggested_movie.get("year", ""),
        "image_url": suggested_movie["image_url"]
    })

# Endpoint to test image URL directly
@app.route('/api/test_image', methods=['GET'])
def test_image():
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({"error": "Image URL parameter is required"}), 400
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(image_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Return image metadata
        return jsonify({
            "url": image_url,
            "status": response.status_code,
            "content_type": response.headers.get('Content-Type'),
            "size": len(response.content),
            "accessible": True
        })
    except Exception as e:
        return jsonify({
            "url": image_url,
            "error": str(e),
            "accessible": False
        })

# Serve static files from the React build directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
   
    try:
        # Try to serve the file if it exists (e.g., JS, CSS, images)
        return send_from_directory(app.static_folder, path)
    except:
        # Fallback to index.html for client-side routing
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000)