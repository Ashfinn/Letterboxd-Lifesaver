import { Film } from 'lucide-react';

const Header = () => {
  return (
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
        Discover your next movie night gem with a random pick from your Letterboxd watchlist.
      </p>
    </div>
  );
};

export default Header;