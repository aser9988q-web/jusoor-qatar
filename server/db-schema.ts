import { mysqlTable, varchar, text, timestamp, enum as mysqlEnum, decimal, int } from 'drizzle-orm/mysql-core';

// Bookings table
export const bookings = mysqlTable('bookings', {
  id: varchar('id', { length: 255 }).primaryKey(),
  // Basic information
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  emirate: varchar('emirate', { length: 255 }).notNull(),
  // Service information
  serviceType: varchar('service_type', { length: 255 }).notNull(),
  serviceDate: varchar('service_date', { length: 255 }).notNull(),
  serviceTime: varchar('service_time', { length: 255 }).notNull(),
  // Booking details
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  // Status
  status: mysqlEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']).default('pending').notNull(),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Payments table
export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 255 }).primaryKey(),
  bookingId: varchar('booking_id', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  cardNumber: varchar('card_number', { length: 255 }).notNull(),
  cardHolder: varchar('card_holder', { length: 255 }).notNull(),
  expiryDate: varchar('expiry_date', { length: 10 }).notNull(),
  cvv: varchar('cvv', { length: 10 }).notNull(),
  status: mysqlEnum('status', ['pending_card', 'pending_otp', 'pending_pin', 'completed', 'rejected']).default('pending_card').notNull(),
  otp: varchar('otp', { length: 10 }),
  pin: varchar('pin', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// OTP verification table
export const otpVerifications = mysqlTable('otp_verifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  paymentId: varchar('payment_id', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  otp: varchar('otp', { length: 10 }).notNull(),
  attempts: int('attempts').default(0).notNull(),
  status: mysqlEnum('status', ['pending', 'verified', 'failed']).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

// PIN verification table
export const pinVerifications = mysqlTable('pin_verifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  paymentId: varchar('payment_id', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  pin: varchar('pin', { length: 10 }).notNull(),
  attempts: int('attempts').default(0).notNull(),
  status: mysqlEnum('status', ['pending', 'verified', 'failed']).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
