import { useState } from 'react';
import InsertName from './components/InsertName';

function App() {
  const [username, setUsername] = useState('');
  const [suggestedMovie, setSuggestedMovie] = useState(null);
  const [movieImage, setMovieImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuggestion = (name) => {
    setUsername(name);
    setError(null);
    setSuggestedMovie(null);
    setMovieImage(null);
  }
 
  const getRandomMovie = async () => {
    if (!username) {
      setError('Please enter your Letterboxd username first.');
      return;
    }
    setError(null);
    setSuggestedMovie(null);
    setMovieImage(null);
    setLoading(true);
    
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      
      setSuggestedMovie(data.suggested_movie);
      setMovieImage(data.image_url);
    } catch (error) {
      setError('Failed to fetch movie suggestion. Please try again later.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <img src="src/assets/logo.png" className="h-85 mx-auto" alt="logo" />
      <h1 className="text-3xl font-bold text-center mb-6">Letterboxd Lifesaver</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg">
          Letterboxd Lifesaver is a Python-based application that helps users choose movies based on their Letterboxd watchlist. No more confusing choices. Let the power of probability guide you.
        </p>
      </div>
      
      <div className="bg-gray-800 text-white bg-opacity-50 rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {username || 'Movie Fan'}!</h2>
        <p className="mb-4">Click the button below to get a random movie suggestion from your watchlist.</p>
       
        <InsertName onSuggestion={handleSuggestion}/>
        
        {username && (
          <button 
            onClick={getRandomMovie} 
            className={`mt-4 px-6 py-2 rounded font-bold transition-colors ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Random Movie'}
          </button>
        )}
        
        {suggestedMovie && (
          <div className="mt-6 bg-gray-700 bg-opacity-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Suggested Movie:</h3>
            <div className="flex flex-col items-center">
              {movieImage && (
                <img 
                  src={movieImage} 
                  alt={`Poster for ${suggestedMovie}`}
                  className="w-48 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 mb-4"
                />
              )}
              <p className="text-lg font-medium text-center">{suggestedMovie}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 bg-red-900 bg-opacity-30 text-red-300 p-3 rounded">
            <p>{error}</p>
          </div>
        )}
       
      </div>
      
      <div className="bg-gray-800 text-white bg-opacity-50 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 pl-4">
          <li>Enter your Letterboxd username in the input field.</li>
          <li>Click the "Submit" button.</li>
          <li>Click the "Get Random Movie" button to receive a movie suggestion.</li>
          <li>Repeat the process for more movie suggestions.</li>
          <li>Have fun!</li>
        </ol>
      </div>
    </div>
  )
}

export default App