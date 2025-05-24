const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'bellealina213@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'drdcrxbuyfslqvvp'; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  return new Promise((resolve, reject) => {
    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ OTP Email Error:', error);
          reject(error);
        } else {
          console.log('✅ OTP Email sent:', info.response);
          resolve(info);
        }
      });
    } catch (error) {
      console.error('❌ Unexpected Error:', error);
      reject(error);
    }
  });
};

const sendOrderStatusEmail = (email, order) => {
  const totalPayment = order.items.reduce((total, item) => total + item.price, 0);

  let subject = '';
  let emailContent = '';

  switch (order.status) {
    case 'Preparing':
      subject = `Order #${order.orderId} is now being Prepared`;
      emailContent = `
        <h2>☕ Your order is being prepared!</h2>
        <p>Order ID: <strong>${order.orderId}</strong></p>
        <ul>${order.items.map(item => `<li>${item.name} - ₱${item.price}</li>`).join('')}</ul>
        <p>We'll let you know once it's ready for pickup.</p>
      `;
      break;

    case 'Ready for Pickup':
      subject = `Order #${order.orderId} is Ready for Pickup`;
      emailContent = `
        <h2>🚶 Your order is ready!</h2>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total:</strong> ₱${totalPayment}</p>
        <p><strong>Pickup Location:</strong> Coffee Bliss, Taguig</p>
        <ul>${order.items.map(item => `<li>${item.name} - ₱${item.price}</li>`).join('')}</ul>
        <p>Please drop by to pick up your drink. Enjoy! ☕</p>
      `;
      break;

    case 'Completed':
      subject = `Order #${order.orderId} Completed`;
      emailContent = `
        <h2>✅ Your order has been completed</h2>
        <p>Thank you for choosing Coffee Bliss!</p>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total Paid:</strong> ₱${totalPayment}</p>
      `;
      break;

    default:
      subject = `Update on Order #${order.orderId}`;
      emailContent = `<p>Your order status is now: <strong>${order.status}</strong></p>`;
      break;
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject,
    html: emailContent,
    text: emailContent.replace(/<\/?[^>]+(>|$)/g, ""),
  };

  return new Promise((resolve, reject) => {
    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Order Status Email Error:', error);
          reject(error);
        } else {
          console.log('✅ Order Status Email sent:', info.response);
          resolve(info);
        }
      });
    } catch (error) {
      console.error('❌ Unexpected Error:', error);
      reject(error);
    }
  });
};

const sendForgotPasswordEmail = async (email, resetToken) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Use this token to reset your password: ${resetToken}`,
  };

  return new Promise((resolve, reject) => {
    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Forgot Password Email Error:', error);
          reject(error);
        } else {
          console.log('✅ Forgot Password Email sent:', info.response);
          resolve(info);
        }
      });
    } catch (error) {
      console.error('❌ Unexpected Error:', error);
      reject(error);
    }
  });
};

module.exports = {
  sendOTPEmail,
  sendOrderStatusEmail,
  sendForgotPasswordEmail,
};
