import { signupSchema } from "./authSchema";
import { loginUser, registerUser } from "./authService";

export const login = async (req: any, res: any) => {
  const token = await loginUser(req.body);
  if (token) {
    res.send(token);
  } else {
    res.status(400).send("Invalid data");
  }
};

export const signup = async (req: any, res: any) => {
  const token = await registerUser(req.body);
  if (token) {
    res.send(token);
  } else {
    res.status(400).send("Invalid data");
  }
};
