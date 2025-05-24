const Order = require('../models/orderModel');
const jwt = require('jsonwebtoken');

exports.createOrder = async (req, res) => {
  const { userEmail, products, total, phone } = req.body;

  if (!userEmail || !products || !total || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({ userEmail, products, total, phone });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['Pending', 'In Progress', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
