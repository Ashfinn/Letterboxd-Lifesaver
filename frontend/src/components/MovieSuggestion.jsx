import { Film, Calendar, Award, Star, Globe } from 'lucide-react';

const MovieSuggestion = ({ movie, error, loading, onFetch }) => {
  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-4 rounded-lg backdrop-blur-sm animate-shake">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <p className="text-sm sm:text-base">{error}</p>
            </div>
            <button
              onClick={() => onFetch(null, null)} // Clear error
              className="text-red-300 hover:text-red-100"
              aria-label="Dismiss error message"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {movie && (
        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Film className="w-5 h-5 text-orange-400" />
            <h3 className="text-xl font-semibold text-white">Your Next Watch:</h3>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {movie.image && (
              <div className="relative group flex-shrink-0">
                <img
                  src={movie.image}
                  alt={`Poster for ${movie.name}`}
                  className="w-full max-w-[12rem] h-auto rounded-lg shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            <div className="flex-1 text-center lg:text-left">
              <h4 className="text-3xl font-bold text-white mb-2">{movie.name}</h4>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-gray-300 text-lg mb-3">
                {movie.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-orange-400" /> {movie.year}
                  </span>
                )}
                {movie.director && (
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-orange-400" /> {movie.director}
                  </span>
                )}
                {movie.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" /> {movie.rating}/5
                  </span>
                )}
                {!movie.year && !movie.director && !movie.rating && (
                  <p className="text-gray-400 text-base">No additional details available.</p>
                )}
              </div>
              <p className="text-gray-400 text-base mb-4">From your watchlist</p>
              {movie.url && (
                <a
                  href={movie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition-colors duration-200"
                  aria-label={`View ${movie.name} on Letterboxd`}
                >
                  <Globe className="w-4 h-4" /> View on Letterboxd
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onFetch(null, null)} // Fetch new movie
          className={`group relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl'
          }`}
          disabled={loading}
          aria-label={loading ? 'Fetching movie suggestion' : 'Get random movie suggestion'}
        >
          <div className="flex items-center gap-2 text-white">
            {loading ? (
              <>
                <Star className="w-5 h-5 animate-spin" />
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
    </div>
  );
};

export default MovieSuggestion;