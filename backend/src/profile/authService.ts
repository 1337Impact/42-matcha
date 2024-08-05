// import {
//   generateEmailVerificationToken,
//   generateToken,
//   verifyToken,
// } from "../utils/jwtUtils";
// import { loginSchema, signupSchema } from "./authSchema";
// import bcrypt from "bcrypt";
// import db from "../utils/db/client";
// import sendVerificationEmail from "../utils/sendMail";
// import { JwtPayload } from "jsonwebtoken";

// interface User {
//   email: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   password: string;
// }

// export const uploadImages = async (token: string) => {
//   try {
//     const data = verifyToken(token || "") as JwtPayload;
//     if (data) {
//       await updateEmailVerification(data.id);
//       return {
//         code: 200,
//         error: null,
//         data: "Email verified successfully.",
//       };
//     }
//     return {
//       code: 401,
//       error: "Invalid token",
//       data: null,
//     };
//   } catch (error) {
//     console.error("Error updating email verification:", error);
//     return {
//       code: 500,
//       error: "Internal Server Error.",
//       data: null,
//     };
//   }
// };
