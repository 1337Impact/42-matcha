import db from "../utils/db/client";
import { Profile, User } from "./types";

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

async function handleSetGeoLocation(userId: string, ip: any): Promise<any> {
  const query = `UPDATE "USER" 
  SET latitude = $1, longitude = $2
  WHERE id = $3
  RETURNING id latitude;`;
  try {
    const geoLocation = await fetch(
      `https://api.geoapify.com/v1/ipinfo?&apiKey=${process.env.GEOAPIFY_API_KEY}`,
      {
        method: "GET",
      }
    );
    const data = await geoLocation.json();
    console.log(
      "Geo location data: ",
      data.location,
      data.city.name,
      data.country.name
    );
    await db.query(query, [
      data.location.latitude,
      data.location.longitude,
      userId,
    ]);
    return data;
  } catch (error) {
    console.error("Error getting geo location: ", error);
    throw error;
  }
}

async function handleUpdateProfile(
  profileData: Profile,
  user: User
): Promise<string | null> {
  console.log("Profile data: ", profileData);
  console.log(
    "latitude: ++++++--->",
    profileData.latitude,
    "longitude:  ++++++--->",
    profileData.longitude
  );
  try {
    const query = `UPDATE "USER" 
      SET gender = $1, sexual_preferences = $2, bio = $3, interests = $4, pictures = $5, first_name = $6, last_name = $7, email = $8, password = $9,
      latitude = $10, longitude = $11, address = $12
      WHERE id = $13
      RETURNING latitude;`;
    const { rows } = await db.query(query, [
      profileData.gender,
      profileData.sexual_preferences,
      profileData.biography,
      JSON.parse(profileData.tags),
      profileData.images,
      profileData.first_name,
      profileData.last_name,
      profileData.email,
      profileData.new_password,
      profileData.latitude,
      profileData.longitude,
      profileData.address,
      user.id,
    ]);
    console.log("Updated profile: ========>>", rows[0]);
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
  getIsProfileCompleted,
  handleGetAllProfiles,
  handleGetConnections,
  handleGetProfile,
  handleLikeProfile,
  handleSetGeoLocation,
  handleUpdateProfile,
};
