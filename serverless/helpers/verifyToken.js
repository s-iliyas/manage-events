const jwt = require('jsonwebtoken');

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, 'todo-app-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = validateToken;