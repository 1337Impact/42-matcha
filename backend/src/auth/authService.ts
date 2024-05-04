import { generateToken } from "../utils/jwtUtils";
import { loginSchema, signupSchema } from "./authSchema";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const registerUser = async (userData: User) => {
  try {
    const validatedData = signupSchema.parse(userData);
    console.log("validated data: ", validatedData);
    const { password, ...user } = userData;
    const token = generateToken({
      ...user,
      id: "1234",
      profilePicture: "default.jpg",
    });
    return token;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try { 
    const validatedData = loginSchema.parse(data);
    console.log("login validated data: ", validatedData);
    // fetch data from database
    const token = generateToken({
      email: "string",
      firstName: "string",
      lastName: "string",
      username: "string",
      id: "1234",
      profilePicture: "default.jpg",
    });
    return token;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};
