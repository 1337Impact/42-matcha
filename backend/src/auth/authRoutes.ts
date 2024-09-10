import { login, signup, verifyEmail } from "./authControllers";
import { Router } from "express";
import { handleForgetPasswordEamil, handleUpdatePassword } from "./authService";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/request-reset-password", async (req, res) => {

    const { email } = req.body;
    try {
      console.log("Request reset password");
    await handleForgetPasswordEamil(email, res);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return res.status(500).send("Internal Server Error.");
  }
});
router.post("/reset-password/", async (req, res) => {
  const { password, token } = req.body;
  try {
    await handleUpdatePassword(password, token);
    res.send("Password reset successful");
  } catch (error) {
    console.error("Error updating email verification:", error);
    return res.status(500).send("Internal Server Error.");
  }
});
export default router;
