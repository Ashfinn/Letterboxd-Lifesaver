from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Enable CORS to allow frontend requests from http://localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock watchlist data for testing
mock_watchlists = {
    "testuser": [
        {
            "name": "Inception",
            "year": 2010,
            "director": "Christopher Nolan",
            "rating": 4.5,
            "image": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            "url": "https://letterboxd.com/film/inception/"
        },
        {
            "name": "Parasite",
            "year": 2019,
            "director": "Bong Joon-ho",
            "rating": 4.8,
            "image": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            "url": "https://letterboxd.com/film/parasite-2019/"
        },
        {
            "name": "The Matrix",
            "year": 1999,
            "director": "Lana Wachowski, Lilly Wachowski",
            "rating": 4.2,
            "image": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            "url": "https://letterboxd.com/film/the-matrix/"
        }
    ],
    "emptyuser": []
}

# Pydantic model for request validation
class UsernameRequest(BaseModel):
    username: str

@app.post("/suggest")
async def suggest_movie(request: UsernameRequest):
    username = request.username.lower()
    if username not in mock_watchlists:
        raise HTTPException(status_code=404, detail="User not found")
    watchlist = mock_watchlists[username]
    if not watchlist:
        raise HTTPException(status_code=400, detail="Watchlist empty")
    return {"suggested_movie": random.choice(watchlist)}