import db from "../utils/db/client";
import { handleGetIsProfileLiked } from "./likes/likesService";
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
    //get user's location
    const { rows: data } = await db.query(
      `SELECT id, latitude, longitude, sexual_preferences, interests FROM "USER" WHERE id = $1;`,
      [user.id]
    );
    const userData = data[0];

    // get all profiles ordered by distance, fame rating and common interests
    const query = `
    SELECT *, sqrt(pow(latitude - $2, 2) + pow(longitude - $3, 2)) AS distance, 
    array_length(array(
      SELECT unnest(interests)
      INTERSECT
      SELECT unnest($5::text[])
    ), 1) AS common_interests_count
      FROM "USER"
      WHERE id != $1
      AND (
       $4 =  'bisexual' 
        OR gender = $4
      )
      ORDER BY distance,fame_rating DESC, common_interests_count DESC
      LIMIT 5;`;
    const { rows } = await db.query(query, [
      userData.id,
      userData.latitude,
      userData.longitude,
      userData.sexual_preferences || "bisexual",
      userData.interests,
    ]);
    // console.log(
    //   "latitude",
    //   "longitude",
    //   "distance",
    //   "fame_rating",
    //   "common_interests_c"
    // );
    // console.log(
    //   rows.map((row: any) => [
    //     row.latitude,
    //     row.longitude,
    //     row.distance,
    //     row.fame_rating,
    //     row.common_interests_count,
    //   ])
    // );
    return rows;
  } catch (error) {
    console.error("Error getting all Profiles:", error);
    throw error;
  }
}

async function handleGetConnections(user: User): Promise<any> {
  try {
    const query = `SELECT "USER".id, "USER".first_name, "USER".last_name, "USER".username, "user_likes_1"."like_time" AS "like_time"
    FROM "user_likes" AS "user_likes_1"
    INNER JOIN "user_likes" AS "user_likes_2" 
      ON "user_likes_1"."liker_id" = "user_likes_2"."liked_id" 
      AND "user_likes_1"."liked_id" = "user_likes_2"."liker_id"
    INNER JOIN "USER" 
      ON "user_likes_1"."liker_id" = "USER"."id"
    WHERE "user_likes_1"."liked_id" = $1
    ORDER BY "user_likes_1"."like_time" DESC;`;
    const { rows: data } = await db.query(query, [user.id]);
    console.log("Connections data: ", data);
    return data;
  } catch (error) {
    console.error("Error getting Connections:", error);
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
      JSON.parse(profileData.tags),
      profileData.images,
      user.id,
    ]);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function handleLikeProfile(profileId: string, user: User): Promise<any> {
  try {
    const query = `INSERT INTO "user_likes" (liker_id, liked_id) VALUES ($1, $2);`;
    await db.query(query, [user.id, profileId]);
    return "Profile liked successfully";
  } catch (error) {
    console.error("Error liking profile:", error);
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
  handleGetConnections,
  handleUpdateProfile,
  getIsProfileCompleted,
  handleLikeProfile,
};
