import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    req.user = decoded.userId;

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Log the error
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
