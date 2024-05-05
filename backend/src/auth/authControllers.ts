import { loginUser, registerUser } from "./authService";

export const signup = async (req: any, res: any) => {
  const result = await registerUser(req.body);
  if (!result.error) {
    res.send({token: result.data});
  } else {
    res.status(result.code).send({ error: result.error });
  }
};

export const login = async (req: any, res: any) => {
  const token = await loginUser(req.body);
  if (token) {
    res.send(token);
  } else {
    res.status(400).send("Invalid data");
  }
};
