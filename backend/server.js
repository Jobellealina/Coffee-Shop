const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const {
  sendOTPEmail,
  sendOrderStatusEmail,
  sendForgotPasswordEmail,
} = require('./mailer');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Coffee Shop Backend is running! ☕');
});

// Render Health Check route
app.get('/healthz', (req, res) => {
  res.send('OK');
});

const otpStore = {};
const verifiedEmails = new Set();
const registeredUsers = new Map();
const orders = [];

const adminCredentials = {
  email: 'admin@gmail.com',
  password: 'Admin@2025',
};

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const userSockets = {};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register-user', (email) => {
    userSockets[email] = socket.id;
    console.log(`Registered socket for ${email}`);
  });

  socket.on('send-message-to-user', ({ email, message }) => {
    const userSocketId = userSockets[email];
    if (userSocketId) {
      io.to(userSocketId).emit('receive-message', message);
    } else {
      console.log(`User ${email} not connected`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    for (const email in userSockets) {
      if (userSockets[email] === socket.id) {
        delete userSockets[email];
        break;
      }
    }
  });
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expiration: Date.now() + 10 * 60 * 1000 };

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Email Error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const data = otpStore[email];

  if (!data || data.otp !== parseInt(otp) || Date.now() > data.expiration) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  verifiedEmails.add(email);
  delete otpStore[email];
  res.status(200).json({ message: 'OTP verified' });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!verifiedEmails.has(email)) {
    return res.status(400).json({ message: 'OTP not verified' });
  }

  if (registeredUsers.has(email)) {
    return res.status(400).json({ message: 'User already registered' });
  }

  registeredUsers.set(email, password);
  verifiedEmails.delete(email);
  res.status(200).json({ message: 'Registered successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const storedPassword = registeredUsers.get(email);

  if (!storedPassword || storedPassword !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', email });
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });

  if (!registeredUsers.has(email)) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp: resetToken, expiration: Date.now() + 10 * 60 * 1000 };

  try {
    await sendForgotPasswordEmail(email, resetToken);
    res.status(200).json({ message: 'Reset code sent' });
  } catch (err) {
    console.error('Forgot password email error:', err.message);
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

app.post('/reset-password', (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const data = otpStore[email];

  if (!data || data.otp !== parseInt(resetToken) || Date.now() > data.expiration) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  registeredUsers.set(email, newPassword);
  delete otpStore[email];
  res.status(200).json({ message: 'Password reset successfully' });
});

app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === adminCredentials.email && password === adminCredentials.password) {
    return res.status(200).json({ message: 'Admin login successful' });
  }
  res.status(401).json({ message: 'Invalid admin credentials' });
});

app.post('/api/orders', (req, res) => {
  const { items, phone, email, paymentMethod, paymentReference } = req.body;

  if (!email || !items || !phone) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);

  const order = {
    orderId,
    status: 'Processing',
    items,
    phone,
    email,
    paymentMethod,
    paymentReference,
    totalPayment: items.reduce((total, item) => total + item.price, 0),
    createdAt: new Date(),
  };

  orders.push(order);
  console.log('Order created:', order);
  res.status(201).json({ message: 'Order placed', order });
});

app.get('/api/orders/:email', (req, res) => {
  const { email } = req.params;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const userOrders = orders.filter(order => order.email === email);

  if (userOrders.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(userOrders);
});

app.get('/api/admin/orders', (req, res) => {
  res.status(200).json(orders);
});

app.put('/api/admin/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ['Processing', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = orders.find(o => o.orderId === parseInt(orderId));
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;

  try {
    await sendOrderStatusEmail(order.email, order);
    if (userSockets[order.email]) {
      io.to(userSockets[order.email]).emit('receive-order-status', order);
    }
    res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Email sending failed:', err.message);
    res.status(500).json({ message: 'Order updated but failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
