const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
//const sendEmail = require('../utils/sendEmail'); // 自定义的邮件发送工具
const crypto = require('crypto'); // 用于生成 Token

const router = express.Router();
// 工具函数：加密密码
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Registration attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide both email and password' 
      });
    }

    // 检查邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }

    // 检查密码长度
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // 创建新用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('User registered successfully:', email);
    
    res.status(201).json({
      message: 'Registration successful',
      user: { email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'An error occurred during registration' 
    });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // 验证请求数据
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        error: 'Please provide both email and password' 
      });
    }

    // 查找用户
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful for user:', user.email);

    // 返回成功响应
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'An error occurred during login'
    });
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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
