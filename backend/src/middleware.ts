// src/middleware/authMiddleware.ts
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || "your-secret";

function verifyToken(req: any, res: any, next: NextFunction) {
    const token = req.headers["authorization"].split(" ")[1];
    console.log("token", token);
    if (token){
        try {
            const decoded = jwt.verify(token, secretKey);
            console.log("decoded", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Error verifying token:", error);
            res.status(401).json({ error: "Invalid token" });
        }
    } else {
        res.status(401).json({ error: "Access denied" });
    }
}

export default verifyToken;