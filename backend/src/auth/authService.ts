import {
  generateEmailVerificationToken,
  generateToken,
  verifyToken,
} from "../utils/jwtUtils";
import { loginSchema, signupSchema } from "./authSchema";
import bcrypt from "bcrypt";
import db from "../utils/db/client";
import sendVerificationEmail from "../utils/sendMail";
import { JwtPayload } from "jsonwebtoken";
const crypto = require('crypto');
const nodemailer = require('nodemailer');

interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}


async function createUser(userData: User): Promise<string | null> {
  console.log("userData: ", userData);
  const { username, first_name, last_name, email, password } = userData;
  const query = `
      INSERT INTO "USER" (username, first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
  try {
    const { rows: users } = await db.query(
      `SELECT id FROM "USER" WHERE email = $1;`,
      [email]
    );
    if (users.length > 0) {
      return null;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const values = [username, first_name, last_name, email, hashedPass];
    const { rows } = await db.query(query, values);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function deleteUser(userId: string) {
  const query = `DELETE FROM "USER" WHERE id = $1;`;
  try {
    await db.query(query, [userId]);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export const registerUser = async (userData: User) => {
  console.log("registerUser: ", userData);
  try {
    const result = signupSchema.safeParse(userData);
    if (!result.success) {
      return {
        code: 400,
        error: "The provided user data is not valid.",
        data: null,
      };
    }
    const userId = await createUser(userData);
    if (!userId) {
      return {
        code: 409,
        error: "A user with this email already exists.",
        data: null,
      };
    }
    try {
      // send verification email
      const emailToken = generateEmailVerificationToken(userId);
      await sendVerificationEmail({
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        link: `${process.env.FRONTEND_URL}/verify?token=${emailToken}`,
      });

      return {
        code: 200,
        error: null,
        data: "User created successfully. Please verify your email.",
      };
    } catch (error) {
      console.log("Error catched. deleting user from db...");
      deleteUser(userId);
      throw error;
    }
  } catch (error) {
    console.log("Unhandled error:", error);
    return {
      code: 500,
      error: "Internal Server Error.",
      data: null,
    };
  }
};

const getUserData = async (email: string) => {
  const query = `
      SELECT id, username, first_name, last_name, email, password, pictures, is_verified
      FROM "USER"
      WHERE email = $1;
    `;
  try {
    const { rows } = await db.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      console.log("Invalid data");
      return null;
    }
    const userData = await getUserData(data.email);
    if (!userData) {
      console.log("User not found");
      return null;
    }
    const { password: userPassword, pictures, ...user } = userData;
    const isMatch = await bcrypt.compare(data.password, userPassword);
    if (!isMatch) {
      console.log("Invalid password");
      return null;
    }

    const token = generateToken({
      ...user,
      profilePicture: pictures ? pictures[0] : "",
    });
    return {id: user.id, token: token};
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

const updateEmailVerification = async (userId: string) => {
  const query = `
      UPDATE "USER"
      SET is_verified = true
      WHERE id = $1;
    `;
  try {
    await db.query(query, [userId]);
  } catch (error) {
    console.error("Error updating email verification:", error);
    throw error;
  }
};

export const handleEmailVerification = async (token: string) => {
  try {
    const data = verifyToken(token || "") as JwtPayload;
    if (data) {
      await updateEmailVerification(data.id);
      return {
        code: 200,
        error: null,
        data: "Email verified successfully.",
      };
    }
    return {
      code: 401,
      error: "Invalid token",
      data: null,
    };
  } catch (error) {
    console.error("Error updating email verification:", error);
    return {
      code: 500,
      error: "Internal Server Error.",
      data: null,
    };
  }
};

export const handleForgetPasswordEamil = async (email: string, res: any) => {
  const query = `
      SELECT id, username, first_name, last_name, email, resetPasswordToken, resetPasswordExpires, is_verified
      FROM "USER"
      WHERE email = $1;
    `;
  try {
    const { rows } : any = await db.query(query, [email]);

    if (!rows) {
      return res.status(400).json({ message: 'User with this email does not exist.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hour from now

    rows.resetPasswordToken = token;
    rows.resetPasswordExpires = new Date(expiration);
    await rows.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: rows.email,
      from: 'password-reset@yourapp.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested to reset your account password.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${process.env.FRONTEND_URL}/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'A reset link has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}


export const handleUpdatePassword = async (
  password: string,
  token: string,
) => {
  // Query to find the user by reset token and ensure it hasn't expired
  const findUserQuery = `
    SELECT id, email, resetPasswordExpires
    FROM "USER"
    WHERE resetPasswordToken = $1 AND resetPasswordExpires > NOW();
  `;

  const updatePasswordQuery = `
    UPDATE "USER"
    SET password = $1, resetPasswordToken = NULL, resetPasswordExpires = NULL
    WHERE id = $2;
  `;

  try {
    const { rows } = await db.query(findUserQuery, [token]);

    if (rows.length === 0) {
      throw new Error("Invalid or expired token.");
    }

    const user = rows[0];

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Update the user's password
    await db.query(updatePasswordQuery, [hashedPass, user.id]);

    console.log(`Password updated successfully for user ID ${user.id}`);
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
