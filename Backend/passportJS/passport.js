import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import crypto from "crypto";
import { sendPasswordEmail } from "../nodemailer/emails.js";

const generateSecurePassword = () => crypto.randomBytes(12).toString("hex");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by email
        let user = await User.findOne({ email: profile._json.email });


        if (!user) {
          // Generate a random password
          const newPassword = generateSecurePassword();
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          // Create a new user
          user = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            password: hashedPassword,

            isVerified: true,
          });

          // Send the password to the user's email
          await sendPasswordEmail(profile._json.email, newPassword);
        } else {
          // Update existing user's last login and mark as verified
          user.lastLogin = new Date();
          user.isVerified = true;
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "15d",
        });

        done(null, { token, user });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
