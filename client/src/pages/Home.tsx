import { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Header from '@/components/Header';
import TourButtons from '@/components/TourButtons';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const { user, isAuthenticated, logout } = useAuth();

  const translations = {
    en: {
      title: 'TOURS AND TRANSITS AT THE PANAMA CANAL',
      subtitle: 'Find the best Panama Canal tours. Take a boat through the locks, travel on the railway, visit the museums, fish in Gatun Lake or fly over the canal in a helicopter.',
    },
    es: {
      title: 'TOURS Y TRÁNSITOS EN EL CANAL DE PANAMÁ',
      subtitle: 'Encuentra los mejores tours del Canal de Panamá. Viaja en bote por las esclusas, viaja en ferrocarril, visita los museos, pesca en el Lago Gatún o vuela sobre el canal en helicóptero.',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1">
        {/* Hero Section with Red Background */}
        <section className="bg-red-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h2>
            <p className="text-lg md:text-xl leading-relaxed">{t.subtitle}</p>
          </div>
        </section>

        {/* Canal Image Section */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
              alt="Panama Canal"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Tour Buttons Section */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <TourButtons language={language} />
          </div>
        </section>

        {/* Featured Tours Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
              {language === 'en' ? 'Featured Tours' : 'Tours Destacados'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Tour Card 1 */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop"
                  alt="Boat Tour"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {language === 'en' ? 'Partial Transit' : 'Tránsito Parcial'}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'Experience the majesty of the Panama Canal with our partial transit tour.'
                      : 'Experimenta la majestuosidad del Canal de Panamá con nuestro tour de tránsito parcial.'}
                  </p>
                  <p className="text-red-600 font-bold">$175 {language === 'en' ? 'per person' : 'por persona'}</p>
                </div>
              </div>

              {/* Tour Card 2 */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop"
                  alt="Full Transit"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {language === 'en' ? 'Complete Transit' : 'Tránsito Completo'}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'The ultimate Panama Canal experience - complete transit through all locks.'
                      : 'La experiencia definitiva del Canal de Panamá - tránsito completo por todas las esclusas.'}
                  </p>
                  <p className="text-red-600 font-bold">$240 {language === 'en' ? 'per person' : 'por persona'}</p>
                </div>
              </div>

              {/* Tour Card 3 */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop"
                  alt="Whale Watching"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {language === 'en' ? 'Whale Watching' : 'Observación de Ballenas'}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'Witness the magnificent whales in their natural habitat.'
                      : 'Presencia las magníficas ballenas en su hábitat natural.'}
                  </p>
                  <p className="text-blue-700 font-bold">$175 {language === 'en' ? 'per person' : 'por persona'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4">
                  {language === 'en' ? 'Contact' : 'Contacto'}
                </h4>
                <p className="text-gray-300">Tel. +507 6440-7600</p>
                <p className="text-gray-300">vip@aeroalbrook.com</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">
                  {language === 'en' ? 'Quick Links' : 'Enlaces Rápidos'}
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li><a href="#" className="hover:text-white">{language === 'en' ? 'Boat Tours' : 'Tours en Bote'}</a></li>
                  <li><a href="#" className="hover:text-white">{language === 'en' ? 'Guided Tours' : 'Tours Guiados'}</a></li>
                  <li><a href="#" className="hover:text-white">{language === 'en' ? 'Air Tours' : 'Tours Aéreos'}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">
                  {language === 'en' ? 'Follow Us' : 'Síguenos'}
                </h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
                  <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2026 Panama Canal Tours. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
