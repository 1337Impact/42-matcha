import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';

interface Payload {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profilePicture: string;
}

export const generateToken = (payload: Payload) => {

  const options = {
    expiresIn: '1d',
    issuer: process.env.FRONTEND_URL,
  };

  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};
