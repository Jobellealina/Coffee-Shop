const jwt = require('jsonwebtoken');

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (email === 'bellealina213@gmail.com' && password === 'test123') {
    const token = jwt.sign({ email }, 'secret123', { expiresIn: '1h' });

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
