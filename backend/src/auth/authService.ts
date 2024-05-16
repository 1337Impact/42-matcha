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
      SELECT id, username, first_name, last_name, email, password, pictures
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
    return token;
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
