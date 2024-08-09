import db from "../utils/db/client";
import { User, Profile } from "./types";

async function handleGetProfile(
  profileId: string,
  user: User
): Promise<string | null> {
  console.log("User data: ", user);
  try {
    const query = `SELECT *
      FROM "USER" 
      WHERE id = $1;`;
    const { rows } = await db.query(query, [profileId]);
    return rows[0];
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

async function handleGetAllProfiles(user: User): Promise<any> {
  try {
    const query = `SELECT *, sqrt(pow(latitude - $1, 2) + pow(longitude - $2, 2)) AS distance
      FROM "USER"
      ORDER BY distance
      LIMIT $3;`;
    const { rows } = await db.query(query, [0.0, 0.0, 2]);
    return rows;
  } catch (error) {
    console.error("Error getting all Profiles:", error);
    throw error;
  }
}

async function handleUpdateProfile(
  profileData: Profile,
  user: User
): Promise<string | null> {
  console.log("Profile data: ", profileData);
  try {
    const query = `UPDATE "USER" 
      SET gender = $1, sexual_preferences = $2, bio = $3, interests = $4, pictures = $5
      WHERE id = $6
      RETURNING id;`;
    const { rows } = await db.query(query, [
      profileData.gender,
      profileData.sexual_preferences,
      profileData.biography,
      profileData.tags,
      profileData.images,
      user.id,
    ]);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function getIsProfileCompleted(userId: string): Promise<boolean> {
  const query = `SELECT gender, sexual_preferences, interests, bio FROM "USER" WHERE id = $1;`;
  try {
    const { rows } = await db.query(query, [userId]);
    if (rows[0]) {
      const { gender, sexual_preferences, interests, bio } = rows[0];
      console.log(gender, sexual_preferences, interests, bio);
      if (gender && sexual_preferences && interests && bio) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export {
  handleGetProfile,
  handleGetAllProfiles,
  handleUpdateProfile,
  getIsProfileCompleted,
};
