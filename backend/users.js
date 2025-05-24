const users = [];

function addUser(email, password) {
  users.push({ email, password, otpVerified: true }); 
}

function setOtpVerified(email) {
  const user = users.find(u => u.email === email);
  if (user) user.otpVerified = true;
  else users.push({ email, otpVerified: true });
}

function isOtpVerified(email) {
  const user = users.find(u => u.email === email);
  return user?.otpVerified || false;
}

function isRegistered(email) {
  return users.some(u => u.email === email && u.password);
}

function verifyUser(email, password) {
  return users.find(u => u.email === email && u.password === password);
}

module.exports = {
  addUser,
  setOtpVerified,
  isOtpVerified,
  isRegistered,
  verifyUser,
};
