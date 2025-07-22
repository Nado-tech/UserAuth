const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../utils/logger');

class AuthService {
  async register(userData) {
    // Validate password complexity here
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    return await User.create(userData);
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  // ... other methods like refreshToken, verifyToken, etc.
}

module.exports = new AuthService();