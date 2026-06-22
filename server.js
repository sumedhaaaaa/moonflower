const express = require('express');
//const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace with your actual API key and device ID
const TEXTBEE_API_KEY = "74a65706-908e-4a0d-8280-8a8be0e11593";
const TEXTBEE_DEVICE_ID = "684fbe197b47be339ad738dd";

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const response = await fetch('https://api.textbee.in/api/v1/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEXTBEE_API_KEY}`,
        'X-Device-ID': TEXTBEE_DEVICE_ID
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const response = await fetch('https://api.textbee.in/api/v1/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEXTBEE_API_KEY}`,
        'X-Device-ID': TEXTBEE_DEVICE_ID
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(5000, () => console.log('Proxy server running on port 5000')); 