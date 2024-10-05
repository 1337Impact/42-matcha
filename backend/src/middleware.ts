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
        console.error("Error verifying token!");
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

function socketMiddlware(req: any, res: any, next: NextFunction) {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }
  
  const header = req.headers["authorization"];

  if (!header) {
    return next(new Error("no token"));
  }

  if (!header.startsWith("Bearer ")) {
    return next(new Error("invalid token"));
  }
  try {
    const token = header.substring(7);
    if (token) {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } else {
      throw new Error("Access denied");
    }
  } catch (error) {
    console.error("Error verifying token!");
    const err = new Error("Error verifying token!");
    next(err);
  }
}

export { socketMiddlware };
export default verifyToken;
