interface TourButtonsProps {
  language: 'en' | 'es';
}

export default function TourButtons({ language }: TourButtonsProps) {
  const translations = {
    en: {
      partialTransit: 'Partial Canal Transit',
      completeTransit: 'Complete Canal Transit',
      whaleWatching: 'Whale Watching Tour',
      perPerson: 'per person',
    },
    es: {
      partialTransit: 'Tránsito Parcial del Canal',
      completeTransit: 'Tránsito Completo del Canal',
      whaleWatching: 'Tour de Observación de Ballenas',
      perPerson: 'por persona',
    },
  };

  const t = translations[language];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-12">
      {/* Partial Transit Button */}
      <a
        href="/booking/partial-transit"
        className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition transform hover:scale-105 shadow-lg text-center min-w-max"
        style={{ borderRadius: '25px' }}
      >
        <div className="text-lg font-bold">{t.partialTransit}</div>
        <div className="text-sm font-semibold">$175 {t.perPerson}</div>
      </a>

      {/* Complete Transit Button */}
      <a
        href="/booking/complete-transit"
        className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition transform hover:scale-105 shadow-lg text-center min-w-max"
        style={{ borderRadius: '25px' }}
      >
        <div className="text-lg font-bold">{t.completeTransit}</div>
        <div className="text-sm font-semibold">$240 {t.perPerson}</div>
      </a>

      {/* Whale Watching Button */}
      <a
        href="/booking/whale-watching"
        className="inline-block px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full transition transform hover:scale-105 shadow-lg text-center min-w-max"
        style={{ borderRadius: '25px' }}
      >
        <div className="text-lg font-bold">{t.whaleWatching}</div>
        <div className="text-sm font-semibold">$175 {t.perPerson}</div>
      </a>
    </div>
  );
}
