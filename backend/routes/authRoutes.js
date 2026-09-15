import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJson, writeJson } from '../utils/storage.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'happy_travels_super_secret_jwt_key_2026';

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const adminUser = readJson('adminUser');
    if (!adminUser) {
      return res.status(500).json({ success: false, message: 'Admin user not configured.' });
    }

    if (username.trim().toLowerCase() !== adminUser.username.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { username: adminUser.username, name: adminUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        username: adminUser.username,
        name: adminUser.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/admin/me
router.get('/me', authMiddleware, (req, res) => {
  const adminUser = readJson('adminUser');
  if (!adminUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({
    success: true,
    user: {
      username: adminUser.username,
      name: adminUser.name,
      updatedAt: adminUser.updatedAt
    }
  });
});

// POST /api/admin/change-password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const adminUser = readJson('adminUser');

    if (!adminUser) {
      return res.status(500).json({ success: false, message: 'Admin account not found.' });
    }

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, adminUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    // Validate strong password policy if new password provided
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasLower = /[a-z]/.test(newPassword);
      const hasDigit = /[0-9]/.test(newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain uppercase letters, lowercase letters, numbers, and special symbols.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      adminUser.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    if (newUsername && newUsername.trim().length >= 3) {
      adminUser.username = newUsername.trim();
    }

    adminUser.updatedAt = new Date().toISOString();
    writeJson('adminUser', adminUser);

    const token = jwt.sign(
      { username: adminUser.username, name: adminUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Admin security settings updated successfully.',
      token,
      user: {
        username: adminUser.username,
        name: adminUser.name
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

export default router;
