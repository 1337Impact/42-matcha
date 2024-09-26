import { Router } from "express";
import { login, signup, verifyEmail } from "./authControllers";
import { handleForgetPasswordEamil, handleUpdatePassword } from "./authService";
import { generateToken } from "../utils/jwtUtils";
import passport from "./passportSetup";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/request-reset-password", async (req, res) => {
  //"Request reset password", req.body);
  const email = req.body.email;
  try {
    const resp = await handleForgetPasswordEamil(email, res);
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

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_photos'] }));

// Route to handle Facebook login callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin', session: false }),
  (req: any, res) => {
    // Successful authentication, send JWT token to the client
    console.log("req.user", req.user);
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/signin?token=${token}`);
  }
);

export default router;
