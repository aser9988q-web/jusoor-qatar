import mysql from 'mysql2/promise';

// Database connection pool
let pool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'jusoor_qatar',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// ========== BOOKING QUERIES ==========

export async function createBooking(data: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  emirate: string;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  totalAmount: number;
  notes?: string;
}) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO bookings 
      (id, customer_name, customer_email, customer_phone, emirate, service_type, service_date, service_time, total_amount, notes, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    `;
    const values = [
      data.id,
      data.customerName,
      data.customerEmail,
      data.customerPhone,
      data.emirate,
      data.serviceType,
      data.serviceDate,
      data.serviceTime,
      data.totalAmount,
      data.notes || null,
    ];
    await connection.execute(query, values);
    return data;
  } finally {
    connection.release();
  }
}

export async function getBookingById(id: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getAllBookings() {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM bookings ORDER BY created_at DESC');
    return rows as any[];
  } finally {
    connection.release();
  }
}

// ========== PAYMENT QUERIES ==========

export async function createPayment(data: {
  id: string;
  bookingId: string;
  email: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  otp?: string;
}) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const query = `
      INSERT INTO payments 
      (id, booking_id, email, card_number, card_holder, expiry_date, cvv, otp, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_card', NOW(), NOW())
    `;
    const values = [
      data.id,
      data.bookingId,
      data.email,
      data.cardNumber,
      data.cardHolder,
      data.expiryDate,
      data.cvv,
      data.otp || null,
    ];
    await connection.execute(query, values);
    return data;
  } finally {
    connection.release();
  }
}

export async function getPaymentById(id: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    return (rows as any[])[0] || null;
  } finally {
    connection.release();
  }
}

export async function getPendingPayments() {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT id, email, card_number, card_holder, status, created_at 
       FROM payments 
       WHERE status IN ('pending_card', 'pending_otp', 'pending_pin')
       ORDER BY created_at DESC`
    );
    return rows as any[];
  } finally {
    connection.release();
  }
}

export async function updatePaymentStatus(id: string, status: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
  } finally {
    connection.release();
  }
}

export async function updatePaymentOTP(id: string, otp: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE payments SET otp = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [otp, 'pending_otp', id]
    );
  } finally {
    connection.release();
  }
}

export async function updatePaymentPIN(id: string, pin: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE payments SET pin = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [pin, 'pending_pin', id]
    );
  } finally {
    connection.release();
  }
}

export async function rejectPayment(id: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
      ['rejected', id]
    );
  } finally {
    connection.release();
  }
}

export async function completePayment(id: string) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    await connection.execute(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
      ['completed', id]
    );
  } finally {
    connection.release();
  }
}

// ========== STATISTICS QUERIES ==========

export async function getStatistics() {
  const pool = await getPool();
  const connection = await pool.getConnection();
  try {
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(total_amount) as revenue
      FROM bookings
    `);
    return (stats as any[])[0];
  } finally {
    connection.release();
  }
}
