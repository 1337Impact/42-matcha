import { getIsProfileCompleted } from "../profile/profileService";
import {
  handleEmailVerification,
  loginUser,
  registerUser,
} from "./authService";

export const signup = async (req: any, res: any) => {
  const result = await registerUser(req.body);
  if (!result.error) {
    res.send({ message: result.data });
  } else {
    res.status(result.code).send({ error: result.error });
  }
};

export const login = async (req: any, res: any) => {
  const user = await loginUser(req.body);
  if (user) {
    const isProfileCompleted = await getIsProfileCompleted(user.id);
    res.send({ token: user.token, isProfileCompleted: isProfileCompleted });
  } else {
    res.status(400).send({ error: "Invalid email or password." });
  }
};

export const verifyEmail = async (req: any, res: any) => {
  const result = await handleEmailVerification(req.body.token);
  if (!result.error) {
    res.send({ message: "Email verified successfully" });
  } else {
    res.status(result.code).send({ error: result.error });
  }
};
