import { useState } from 'react';
import Header from './components/Header';
import UsernameInput from './components/UsernameInput';
import MovieSuggestion from './components/MovieSuggestion';
import Instructions from './components/Instructions';

function App() {
  const [username, setUsername] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (newUsername) => {
    setUsername(newUsername);
    setMovie(null);
    setError(null);
    await fetchMovie(newUsername);
  };

  const fetchMovie = async (usernameToUse = username, errorOverride = null) => {
    if (errorOverride) {
      setError(errorOverride);
      setMovie(null);
      return;
    }

    if (!usernameToUse) {
      setError('Please enter a Letterboxd username first.');
      return;
    }

    setError(null);
    setMovie(null);
    setLoading(true);

    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error === 'User not found'
            ? 'This Letterboxd username does not exist.'
            : data.error === 'Watchlist empty'
              ? 'Your watchlist is empty. Add some movies on Letterboxd!'
              : data.error || 'Something went wrong on the server.'
        );
      }

      setMovie(data.suggested_movie);
    } catch (err) {
      setError(`Failed to fetch movie suggestion: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-inter">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-30"></div>

        <div className="relative container mx-auto px-4 py-8 max-w-4xl">
          <Header />
          <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8 shadow-2xl">
            <UsernameInput onSubmit={handleSubmit} />
            {username && (
              <MovieSuggestion
                movie={movie}
                error={error}
                loading={loading}
                onFetch={fetchMovie}
              />
            )}
          </div>
          <Instructions />
        </div>
      </div>

      <style>{`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `}</style>
    </>
  );

  export default App;
