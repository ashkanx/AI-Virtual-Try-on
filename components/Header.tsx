import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm relative transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F54927] to-orange-500">
          AI Virtual Try-On
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          See yourself in new outfits instantly. Welcome to the future of shopping.
        </p>
      </div>
      <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F54927] focus:ring-offset-white dark:focus:ring-offset-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
      </div>
    </header>
  );
};

export default Header;
