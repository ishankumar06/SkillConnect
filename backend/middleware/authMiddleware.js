import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  console.log("Auth middleware called");
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded token payload:", decoded);
req.user = decoded;

    console.log("Auth user:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}




