import express from 'express';
import cors from 'cors';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected (OTP Proxy)'))
  .catch(err => console.error('MongoDB Connection Error (OTP Proxy):', err));

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Brevo (Sendinblue) API key
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// In-memory store for OTPs: { email: { otp, expiresAt } }
const otpStore = {};

// Configure Brevo
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = BREVO_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint with user existence check
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Check if user exists in MongoDB
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User is not registered. Please sign up first.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err.message });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[email] = { otp, expiresAt };

  const sender = { email: 'ms.sumedhaghosh@gmail.com', name: 'Moonflower OTP' };
  const subject = 'Your Moonflower OTP Code';
  const htmlContent = `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`;

  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject,
      htmlContent
    });
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'No OTP sent to this email' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  // OTP is valid
  delete otpStore[email]; // Remove OTP after successful verification
  res.json({ message: 'OTP verified successfully' });
});

app.listen(5000, () => console.log('Email OTP server running on port 5000')); 