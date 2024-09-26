// auth/passportSetup.ts
import { generateToken } from "../utils/jwtUtils";
import db from "../utils/db/client";
import { createUser, getUserData } from "./authService";
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: [
        "id",
        "emails",
        "name",
        "displayName",
        "gender",
        "profileUrl",
      ], // Request more fields
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        console.log("profile: ", profile);
        // Check if the user already exists
        const existingUser = await getUserData("");

        if (existingUser) {
          // Return existing user
          return done(null, existingUser);
        }

        // User doesn't exist, create new user
        const newUser = {
          email: "", // Ensure email is fetched
          first_name: profile.name?.givenName,
          last_name: profile.name?.familyName,
          username: profile.id, // Fallback to Facebook ID
          password: "", // No password for OAuth users
        };

        const userId = await createUser(newUser);
        if (userId) {
          const newUserData = await getUserData(newUser.email);
          return done(null, newUserData);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await getUserDataById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const getUserDataById = async (id: string) => {
  const query = `
      SELECT *
      FROM "USER"
      WHERE email = $1;
    `;
  try {
    const { rows } = await db.query(query, [id]);
    //"rows: ---\\\\\\\/////////----> ", rows);
    return rows[0];
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export default passport;
