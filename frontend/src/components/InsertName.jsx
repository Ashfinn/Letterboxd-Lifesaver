import { useState } from 'react';

function InsertName({ onSuggestion }) {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim()) {
      onSuggestion(name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-4">
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter your Letterboxd username"
        className="px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 flex-grow"
      />
      <button 
        type="submit" 
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded font-medium transition-colors"
      >
        Submit
      </button>
    </form>
  );
}

export default InsertName;