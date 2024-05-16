import { verifyToken } from "../utils/jwtUtils";
import { handleEmailVerification, loginUser, registerUser } from "./authService";


export const signup = async (req: any, res: any) => {
  const result = await registerUser(req.body);
  if (!result.error) {
    res.send({ message: result.data });
  } else {
    res.status(result.code).send({ error: result.error });
  }
};

export const login = async (req: any, res: any) => {
  const token = await loginUser(req.body);
  if (token) {
    res.send({token: token});
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
}
