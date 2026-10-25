import express from 'express';
import User from '../models/User.js';
import { generateToken, verifyToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password are required',
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.comparePassword) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        error: { code: 'ACCOUNT_INACTIVE', message: 'Account is not active' },
      });
    }

    const token = generateToken(user._id.toString(), user.roles);
    res.json({
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { code: 'LOGIN_ERROR', message: 'Login failed' },
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
    }

    res.json({
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch user' },
    });
  }
});

// Register (optional - for testing)
router.post('/register', async (req, res) => {
  try {
    const { email, displayName, password, roles } = req.body;

    if (!email || !displayName || !password) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, displayName, and password are required',
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: { code: 'USER_EXISTS', message: 'User already exists' },
      });
    }

    const user = new User({
      email,
      displayName,
      passwordHash: password,
      roles: roles || ['passenger'],
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.roles);
    res.status(201).json({
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: { code: 'REGISTER_ERROR', message: 'Registration failed' },
    });
  }
});

export default router;
