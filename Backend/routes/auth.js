import express from "express";
import passport from "passport";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  googleAuthCallback,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/check-auth", verifyToken, isAuthenticated, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyToken, isAuthenticated, logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], state: true })
);

router.get("/google/callback", googleAuthCallback);
export default router;
