import { useState } from 'react';
import { Globe } from 'lucide-react';

interface HeaderProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const translations = {
    en: {
      home: 'HOME',
      boatTours: 'BOAT TOURS',
      guidedTours: 'GUIDED TOURS',
      airTours: 'AIR TOURS',
      contact: 'CONTACT',
    },
    es: {
      home: 'INICIO',
      boatTours: 'TOURS EN BOTE',
      guidedTours: 'TOURS GUIADOS',
      airTours: 'TOURS AÉREOS',
      contact: 'CONTACTO',
    },
  };

  const t = translations[language];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">PANAMA CANAL TOURS</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-red-600 font-semibold text-sm">
              {t.home}
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-semibold text-sm">
              {t.boatTours}
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-semibold text-sm">
              {t.guidedTours}
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-semibold text-sm">
              {t.airTours}
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-semibold text-sm">
              {t.contact}
            </a>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  language === 'en'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('es')}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  language === 'es'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
