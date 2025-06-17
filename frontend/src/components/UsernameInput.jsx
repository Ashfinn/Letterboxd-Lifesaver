import { useState } from 'react';
import { User } from 'lucide-react';

const UsernameInput = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(inputValue.trim())) {
      setError('Username can only contain letters, numbers, underscores, or hyphens.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(inputValue.trim());
    } finally {
      setIsSubmitting(false);
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
          aria-label="Letterboxd username"
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
          isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
        aria-label={isSubmitting ? 'Submitting username' : 'Submit username'}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && (
        <p className="text-red-300 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default UsernameInput;