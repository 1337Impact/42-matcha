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
        "email",
        "name",
        "displayName",
        "gender",
        "profileUrl",
        "photos",
      ],
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        const existingUser = await getUserData(
          `${profile.name?.givenName}@facebook.com`
        );

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          email: `${profile.name?.givenName}@facebook.com`,
          first_name: profile.name?.givenName,
          last_name: profile.name?.familyName,
          username: profile.name?.familyName,
          password: "",
          pictures: [profile.photos[0].value],
          is_verified: true,
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

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

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
    return rows[0];
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export default passport;
