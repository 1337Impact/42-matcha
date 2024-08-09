// src/middleware/authMiddleware.ts
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || "your-secret";

function verifyToken(req: any, res: any, next: NextFunction) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
      } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ error: "Invalid token" });
      }
    } else {
      res.status(401).json({ error: "Access denied" });
    }
  } catch (error) {
    console.error("Error verifying token!");
    res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyToken;
