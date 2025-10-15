const jwt = require('jsonwebtoken');

function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
