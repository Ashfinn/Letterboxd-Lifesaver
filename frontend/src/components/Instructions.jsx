import { User, Play, Star, RefreshCw, Film } from 'lucide-react';

const Instructions = () => {
  const steps = [
    { step: "1", text: "Enter your Letterboxd username", icon: User },
    { step: "2", text: "Click the Submit button", icon: Play },
    { step: "3", text: "Get your random movie suggestion", icon: Star },
    { step: "4", text: "Repeat for more suggestions", icon: RefreshCw },
    { step: "5", text: "Enjoy your movie night!", icon: Film },
  ];

  return (
    <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-五百 to-purple-500 p-2 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white">How to Use</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map(({ step, text, icon: Icon }) => (
          <div
            key={step}
            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-orange-400/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step}
              </div>
              <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;