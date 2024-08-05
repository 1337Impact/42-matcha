import { verifyToken } from "../utils/jwtUtils";


export const uploadImages = async (req: any, res: any) => {
  // const result = await registerUser(req.body);
  // if (!result.error) {
  //   res.send({ message: result.data });
  // } else {
  //   res.status(result.code).send({ error: result.error });
  // }
  res.send("req", req.body);
};

export const updateProfile = async (req: any, res: any) => {
  const images = req.files.map((file: any) => file.path);
  console.log("req", req.files);
  // const token = await loginUser(req.body);
  // if (token) {
  //   res.send({token: token});
  // } else {
    //   res.status(400).send({ error: "Invalid email or password." });
    // }
      res.send("hello");
};