// Simple in-memory database for bookings and payments
interface Booking {
  id: string;
  serviceType: string;
  duration?: string;
  date?: string;
  time?: string;
  workers?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  emirate?: string;
  serviceDate: string;
  serviceTime: string;
  totalAmount?: number;
  notes?: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

interface Payment {
  id: string;
  bookingId: string;
  email: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  otp: string;
  pin: string;
  status: 'pending' | 'verified_card' | 'verified_otp' | 'completed' | 'failed';
  createdAt: Date;
}

class Database {
  private bookings: Map<string, Booking> = new Map();
  private payments: Map<string, Payment> = new Map();

  createBooking(booking: Booking): Booking {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }

  createPayment(payment: Payment): Payment {
    this.payments.set(payment.id, payment);
    return payment;
  }

  getPayment(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  getPaymentById(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  updatePaymentStatus(id: string, status: Payment['status']): Payment | undefined {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = status;
      this.payments.set(id, payment);
    }
    return payment;
  }

  completePayment(id: string): Payment | undefined {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = 'completed';
      this.payments.set(id, payment);
    }
    return payment;
  }

  rejectPayment(id: string): Payment | undefined {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = 'failed';
      this.payments.set(id, payment);
    }
    return payment;
  }

  getAllPayments(): Payment[] {
    return Array.from(this.payments.values());
  }

  getPendingPayments(): Payment[] {
    return Array.from(this.payments.values()).filter(p => p.status === 'pending');
  }

  updatePaymentPIN(id: string, pin: string): Payment | undefined {
    const payment = this.payments.get(id);
    if (payment) {
      payment.pin = pin;
      this.payments.set(id, payment);
    }
    return payment;
  }

  getStatistics() {
    const bookings = Array.from(this.bookings.values());
    const completed = bookings.filter(b => b.status === 'completed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;

    return {
      total: bookings.length,
      completed,
      pending,
    };
  }
}

export const db = new Database();
