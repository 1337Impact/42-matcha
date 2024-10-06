import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import db from "../utils/db/client";
import {
  generateEmailVerificationToken,
  generateToken,
  verifyToken,
} from "../utils/jwtUtils";
import sendVerificationEmail, { transporter } from "../utils/sendMail";
import { loginSchema, signupSchema } from "./authSchema";
const crypto = require("crypto");
const nodemailer = require("nodemailer");

interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  pictures?: string[];
  is_verified?: boolean;
}

export async function createUser(userData: User): Promise<string | null> {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    pictures,
    is_verified,
  } = userData;
  const query = `
      INSERT INTO "USER" (username, first_name, last_name, email, password, fame_rating, pictures, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    const pictures_arr = Array(5).fill("");
    if (pictures) pictures_arr[0] = pictures[0];
    const hashedPass = await bcrypt.hash(password, salt);
    const values = [
      username,
      first_name,
      last_name,
      email,
      hashedPass,
      0,
      JSON.stringify(pictures_arr) || JSON.stringify([pictures_arr]),
      is_verified || false,
    ];
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
      const emailToken = generateEmailVerificationToken(userId);

      const mailOptions = {
        to: userData.email,
        from: `"Matcha 👻" <${process.env.EMAIL_LOGIN}>`,
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested to reset your account password.\n\n
        Please click on the following link, or paste it into your browser to complete the process:\n\n
        ${process.env.FRONTEND_URL}/verify?token=${emailToken}
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      const res = await transporter.sendMail(mailOptions);
      console.log("Email sent: ", res);

      return {
        code: 200,
        error: null,
        data: "User created successfully. Please verify your email.",
      };
    } catch (error) {
      console.error("Error sending email: ", error);
      return {
        code: 200,
        error: null,
        data: "User created successfully. Please verify your email.",
      };
    }
  } catch (error) {
    return {
      code: 500,
      error: "Internal Server Error.",
      data: null,
    };
  }
};

export const getUserData = async (email: string) => {
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
      return null;
    }
    const userData = await getUserData(data.email);
    if (!userData) {
      return null;
    }
    const { password: userPassword, pictures, ...user } = userData;
    const isMatch = await bcrypt.compare(data.password, userPassword);
    if (!isMatch) {
      return null;
    }

    const token = generateToken({
      ...user,
      profilePicture: pictures ? pictures[0] : "",
    });
    return { id: user.id, token: token };
  } catch (error) {
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
    const { rows } = await db.query(query, [userId]);
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
      SELECT id, username, first_name, last_name, email, is_verified, reset_password_token, reset_password_expires
      FROM "USER"
      WHERE email = $1;
    `;
  const updateQuery = `
    UPDATE "USER"
    SET reset_password_token = $1, reset_password_expires = $2
    WHERE email = $3;
  `;
  try {
    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000);

    rows[0].reset_password_token = token;
    rows[0].reset_password_expires = new Date(expiration);
    await db.query(updateQuery, [token, expiration, email]);

    const mailOptions = {
      to: rows[0].email,
      from: `"Matcha 👻" <${process.env.EMAIL_LOGIN}>`,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested to reset your account password.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${process.env.FRONTEND_URL}/resetPassword/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "A reset link has been sent to your email." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleUpdatePassword = async (password: string, token: string) => {
  const findUserQuery = `
    SELECT id, email, reset_password_expires
    FROM "USER"
    WHERE reset_password_token = $1 AND reset_password_expires > NOW();
  `;

  const updatePasswordQuery = `
    UPDATE "USER"
    SET password = $1, reset_password_token = NULL, reset_password_expires = NULL
    WHERE id = $2;
  `;

  try {
    const { rows } = await db.query(findUserQuery, [token]);

    if (rows.length === 0) {
      throw new Error("Invalid or expired token.");
    }

    const user = rows[0];

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    await db.query(updatePasswordQuery, [hashedPass, user.id]);
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
