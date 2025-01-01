import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVarificationEmail, sendResetSucessEmail, sendWelcomeEmail,sendResetPasswordEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      password: hashPassword,
      name,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, //for 24 hours
    });

    await user.save();

    // jwt

    generateTokenAndSetCookie(res, user._id);

    await sendVarificationEmail(user.email, verificationToken);
    res.status(201).json({
      sucess: true,
      message: "User created successfully",
      user: {
        ...user.doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// verify email
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,

      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //comparing password

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword= async(req,res)=>{
  const {email} = req.body;
  try {
    const user=await User.findOne({email});
    
    if(!user){
      return res.status(400).json({success:false, message:"User not found"});
    } 
    //GENRATE RESET TOKEN

    const resetToken=crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiresAt=Date.now()+1*60*60*1000;

    user.resetPasswordToken=resetToken;
    user.resetPasswordExpires=resetPasswordExpiresAt;
    await user.save();

    //send email
    await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({success:true, message:"Reset password link sent to your email"});
  } catch (error) {
    res.status(400).json({success:false, message:error.message}); 
  }
}

export const resetPassword=async(req,res)=>{
  try {
    const {token}=req.params;
    const {password}=req.body;

    const user=await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpires:{$gt:Date.now()}
    });

    if(!user){
      return res.status(400).json({success:false, message:"Invalid or expired token"});
    }

    const hashedPassword=await bcrypt.hash(password, 10);
    user.password=hashedPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;

    await user.save();
    await sendResetSucessEmail(user.email);
    res.status(200).json({success:true, message:"Password reset successfully"});  

  } catch (error) {
    res.status(400).json({success:false, message:error.message});
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
