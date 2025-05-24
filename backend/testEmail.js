const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'bellealina213@gmail.com',
    pass: 'your-app-specific-password', 
  },
});

const mailOptions = {
  from: 'bellealina213@gmail.com',
  to: 'bellealina213@gmail.com', 
  subject: 'Test Email from Node.js',
  text: 'This is a test email from Node.js!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error);  
  } else {
    console.log('Email sent: ' + info.response);  
  }
});
