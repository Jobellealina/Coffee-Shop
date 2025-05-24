// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {
  sendOTPEmail,
  sendOrderStatusEmail,
  sendForgotPasswordEmail,
} = require('./mailer');

const User = require('./models/User');
const Order = require('./models/Order');
const Otp = require('./models/Otp');

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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

app.get('/', (req, res) => {
  res.send('Coffee Shop Backend is running! ☕');
});

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const userSockets = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

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
    console.log('User disconnected:', socket.id);
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
  const expiration = Date.now() + 10 * 60 * 1000;
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiration },
    { upsert: true, new: true }
  );

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Email Error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const data = await Otp.findOne({ email });

  if (!data || data.otp !== parseInt(otp) || Date.now() > data.expiration) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await Otp.deleteOne({ email });
  res.status(200).json({ message: 'OTP verified' });
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already registered' });

  const verified = await Otp.findOne({ email });
  if (verified) return res.status(400).json({ message: 'OTP not verified' });

  await User.create({ email, password });
  res.status(200).json({ message: 'Registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', email });
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = Math.floor(100000 + Math.random() * 900000);
  const expiration = Date.now() + 10 * 60 * 1000;
  await Otp.findOneAndUpdate(
    { email },
    { otp: resetToken, expiration },
    { upsert: true, new: true }
  );

  try {
    await sendForgotPasswordEmail(email, resetToken);
    res.status(200).json({ message: 'Reset code sent' });
  } catch (err) {
    console.error('Forgot password email error:', err.message);
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const data = await Otp.findOne({ email });

  if (!data || data.otp !== parseInt(resetToken) || Date.now() > data.expiration) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  await User.findOneAndUpdate({ email }, { password: newPassword });
  await Otp.deleteOne({ email });
  res.status(200).json({ message: 'Password reset successfully' });
});

app.post('/api/orders', async (req, res) => {
  const { items, phone, email, paymentMethod, paymentReference } = req.body;

  if (!email || !items || !phone) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const orderId = Math.floor(100000 + Math.random() * 900000);
  const totalPayment = items.reduce((total, item) => total + item.price, 0);

  const order = await Order.create({
    orderId,
    status: 'Processing',
    items,
    phone,
    email,
    paymentMethod,
    paymentReference,
    totalPayment,
    createdAt: new Date(),
  });

  console.log('Order created:', order);
  res.status(201).json({ message: 'Order placed', order });
});

app.get('/api/orders/:email', async (req, res) => {
  const { email } = req.params;
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const userOrders = await Order.find({ email });
  res.status(200).json(userOrders);
});

app.get('/api/admin/orders', async (req, res) => {
  const allOrders = await Order.find();
  res.status(200).json(allOrders);
});

app.put('/api/admin/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ['Processing', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findOneAndUpdate(
    { orderId: parseInt(orderId) },
    { status },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: 'Order not found' });

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
  console.log(`Server running on http://localhost:${PORT}`);
});
