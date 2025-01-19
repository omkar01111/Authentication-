import transporter from './nodemailer.config.js';
import dotenv from 'dotenv';

import {
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";


dotenv.config();
export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Please verify your email',
    html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
  };

  try {
    console.log(email,verificationToken);
    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP connection successful');
      }
    });
    
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to Laxumi Chitfund',
    html: `<h1>Welcome, ${name}!</h1><p>We're glad to have you at Laxumi Chitfund.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reset your password',
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent successfully');
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error(`Error sending email: ${error.message}`);
  }
};
