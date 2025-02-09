import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.js";
import passport from "./passportJS/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use(session({
  secret: process.env.SESSION_SECRET, // Use a separate secret
  resave: false,
  saveUninitialized: false, // Do not save empty sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Store sessions in MongoDB
    ttl: 14 * 24 * 60 * 60, // Session expires in 14 days
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "strict", // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (7 days)
  },
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json()); //allowed us json incomming request
app.use(cookieParser()); //allow us to get incomming cookies

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running http://localhost:${PORT}`);
});
