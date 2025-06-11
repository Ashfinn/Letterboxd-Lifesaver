import { useState } from 'react';
import { Film, Play, User, RefreshCw, Star, Calendar, Award, Globe } from 'lucide-react'; // Added Award, Globe for potential future details

// Mock InsertName component since the original wasn't provided
const InsertName = ({ onSuggestion }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSuggestion(inputValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your Letterboxd username"
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200" // Updated focus:border-transparent to focus:border-orange-500
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      >
        Submit
      </button>
    </div>
  );
};

function App() {
  const [username, setUsername] = useState('');
  // Updated suggestedMovie to be an object to hold more details
  const [suggestedMovie, setSuggestedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuggestion = (name) => {
    setUsername(name);
    setError(null);
    setSuggestedMovie(null); // Reset movie on new username
  }

  const getRandomMovie = async () => {
    if (!username) {
      setError('Please enter your Letterboxd username first.');
      return;
    }
    setError(null);
    setSuggestedMovie(null);
    setLoading(true);

    try {
      // Fetch will now correctly proxy to http://localhost:3001/api/suggest due to package.json proxy setting
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        // More specific error messages from backend
        throw new Error(data.error || 'Something went wrong on the server.');
      }

      setSuggestedMovie(data.suggested_movie); // suggested_movie will now be an object
    } catch (error) {
      setError(`Failed to fetch movie suggestion: ${error.message}. Please ensure your backend is running and you have entered a valid username. If the issue persists, try again later.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-inter"> {/* Added font-inter class */}
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23374151\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full shadow-2xl">
              <Film className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
            Letterboxd Lifesaver
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let the power of probability guide your next movie night. No more endless scrolling through your watchlist.
          </p>
        </div>
        
        {/* Main Card */}
        <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-semibold text-white">
              Welcome, <span className="text-orange-400">{username || 'Movie Fan'}</span>!
            </h2>
          </div>
          
          <p className="text-gray-300 mb-6 text-lg">
            Enter your Letterboxd username and discover your next great watch.
          </p>
         
          <InsertName onSuggestion={handleSuggestion}/>
          
          {username && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={getRandomMovie} 
                className={`group relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl'
                }`}
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Finding your movie...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                      Get Random Movie
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
          
          {/* Movie Suggestion */}
          {suggestedMovie && (
            <div className="mt-8 bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-orange-400" />
                <h3 className="text-xl font-semibold text-white">Your Next Watch:</h3>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {suggestedMovie.image && (
                  <div className="relative group flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <img 
                      src={suggestedMovie.image} 
                      alt={`Poster for ${suggestedMovie.name}`}
                      className="w-48 h-72 object-cover rounded-lg shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/film-placeholder.png'; e.target.alt = "Image not available"; }} // Fallback image
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <div className="flex-1 text-center lg:text-left">
                  <h4 className="text-3xl font-bold text-white mb-2">{suggestedMovie.name}</h4> {/* Larger movie title */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-gray-300 text-lg mb-3"> {/* Made more flexible */}
                    {suggestedMovie.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-orange-400" /> {suggestedMovie.year}
                      </span>
                    )}
                    {suggestedMovie.director && (
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-orange-400" /> {suggestedMovie.director}
                      </span>
                    )}
                    {suggestedMovie.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {suggestedMovie.rating}/5
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-base mb-4">From your watchlist</p> {/* Kept this general */}
                  {suggestedMovie.url && (
                    <a 
                      href={suggestedMovie.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition-colors duration-200"
                    >
                      <Globe className="w-4 h-4" /> View on Letterboxd
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-900/30 border border-red-700/50 text-red-300 p-4 rounded-lg backdrop-blur-sm animate-shake">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <p className="text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions Card */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white">How to Use</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: "1", text: "Enter your Letterboxd username", icon: User },
              { step: "2", text: "Click the Submit button", icon: Play },
              { step: "3", text: "Get your random movie suggestion", icon: Star },
              { step: "4", text: "Repeat for more suggestions", icon: RefreshCw },
              { step: "5", text: "Enjoy your movie night!", icon: Film },
            ].map(({ step, text, icon: Icon }) => (
              <div key={step} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-orange-400/50 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"> {/* Added flex-shrink-0 */}
                    {step}
                  </div>
                  <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                  <p className="text-gray-300 text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  )
}

export default App;