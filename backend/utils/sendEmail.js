const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    // 创建传输器
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // 使用 Gmail 服务
      auth: {
        user: process.env.EMAIL_USER, // 在 .env 文件中定义你的邮箱
        pass: process.env.EMAIL_PASS, // 在 .env 文件中定义你的邮箱密码或应用授权码
      },
    });

    // 发送邮件
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // 发件人邮箱
      to, // 收件人邮箱
      subject, // 邮件主题
      text, // 邮件正文
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email not sent');
  }
};

module.exports = sendEmail;
