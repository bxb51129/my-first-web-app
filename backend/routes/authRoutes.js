const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const sendEmail = require('../utils/sendEmail'); // 自定义的邮件发送工具
const crypto = require('crypto'); // 用于生成 Token

const router = express.Router();

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 Login attempt for:', email);

    // 验证请求数据
    if (!email || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ 
        error: 'Please provide both email and password' 
      });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Login successful for:', email);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // 创建新用户
    const user = new User({ email, password });
    await user.save();
    
    console.log('✅ User registered successfully:', {
      id: user._id,
      email: user.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 检查邮箱是否存在
router.post('/check-email', async (req, res) => {
  console.log('Received check-email request:', req.body);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Email not found:', email);
      return res.status(404).json({ error: 'Email not found' });
    }

    console.log('Email found:', email);
    res.status(200).json({ message: 'Email found' });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('Reset password attempt for:', email);
    console.log('New password length:', newPassword.length);

    // 验证请求数据
    if (!email || !newPassword) {
      return res.status(400).json({ 
        error: 'Please provide both email and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for reset password:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('Password hashed successfully');

    // 更新用户密码
    user.password = hashedPassword;
    await user.save();
    console.log('User password updated in database');

    // 尝试验证新密码
    const verifyPassword = await bcrypt.compare(newPassword, user.password);
    console.log('New password verification:', verifyPassword);

    console.log('Password reset successful for:', email);
    res.status(200).json({ 
      message: 'Password reset successful',
      success: true 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Failed to reset password',
      message: error.message 
    });
  }
});

module.exports = router;
