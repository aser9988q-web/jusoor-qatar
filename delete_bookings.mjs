import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'panama_canal',
});

try {
  await connection.execute('DELETE FROM bookings');
  await connection.execute('DELETE FROM card_data');
  await connection.execute('DELETE FROM otp_data');
  await connection.execute('DELETE FROM pin_data');
  console.log('✅ All bookings deleted successfully');
} catch (error) {
  console.error('❌ Error deleting bookings:', error.message);
} finally {
  await connection.end();
}
