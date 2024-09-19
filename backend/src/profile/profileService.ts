import db from "../utils/db/client";
import { Filter, Profile, User } from "./types";

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
    console.log("Profile data: ++++++++++++ ", rows[0]);
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
      `SELECT * FROM "USER" WHERE id = $1;`,
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

async function handleGetgetFilteredProfiles(
  user: User,
  profilesFilter: Filter
): Promise<any> {
  const filter: Filter = {
    distance: 10,
    sexual_preferences: "",
    interests: ["music", "sports"],
  };
  console.log(
    "req_body: ---------> ",
    user.id,
    profilesFilter.sexual_preferences,
    profilesFilter.interests,
    profilesFilter.distance
  );
  try {
    //get user's location and other data
    const { rows: data } = await db.query(
      `SELECT id, latitude, longitude, sexual_preferences, interests FROM "USER" WHERE id = $1;`,
      [user.id]
    );
    const userData = data[0];
    console.log("userData: ", userData);

    // get the filtered profiles, so for example if the user set distance to 10km, we will get all profiles within 10km
    // of the user position and so on for the other filters
    let query = `
        SELECT 
          id, first_name, last_name, username, gender, bio, pictures, interests, location, latitude,
           longitude, fame_rating, distance, common_interests_count, age
        FROM (
          SELECT 
            id, first_name, last_name, username, gender, bio, pictures, interests, 
            location, latitude, longitude, fame_rating, age,
            (
              6371 * acos(
                cos(radians($2)) * cos(radians(latitude)) * cos(radians(longitude) - radians($3)) +
                sin(radians($2)) * sin(radians(latitude))
              )
            ) AS distance,
            array_length(array(
              SELECT unnest(interests)
              INTERSECT
              SELECT unnest($5::text[])
            ), 1) AS common_interests_count
          FROM "USER"
          WHERE id != $1
            AND (
              $4 = 'bisexual'
              OR gender = $4
            )
            AND (
              6371 * acos(
                cos(radians($2)) * cos(radians(latitude)) * cos(radians(longitude) - radians($3)) +
                sin(radians($2)) * sin(radians(latitude))
              )
            ) <= $6
            AND age >= $7
            AND age <= $8
        ) AS subquery
        ORDER BY
        `;

    if (profilesFilter.common_interests) {
      query += ` common_interests_count DESC,`;
    }
    if (profilesFilter.fame_rating) {
      query += ` fame_rating DESC,`;
    }
    if (profilesFilter.distance_sort) {
      query += ` distance ASC, `;
    }
    if (profilesFilter.age) {
      query += ` age ${profilesFilter.age},`;
    }
    query += ` id ASC
      LIMIT 5;`;

    const { rows } = await db.query(query, [
      user.id,
      userData.latitude,
      userData.longitude,
      userData.sexual_preferences || "bisexual",
      userData.interests,
      profilesFilter.distance || 20,
      profilesFilter.min_age || 18,
      profilesFilter.max_age || 99,
    ]);

    const query1 = `
      SELECT * FROM "USER"
      WHERE id != $1
    `;
    const { rows: rows1 } = await db.query(query1, [user.id]);
    console.log("all rows: ", rows1, "filtred : --------!!!----> ", rows);
    return rows;
  } catch (error) {
    console.error("Error getting filtered Profiles:", error);
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
  try {
    const query = `UPDATE "USER" SET gender = $1, sexual_preferences = $2, bio = $3, interests = $4, pictures = $5,
      age = $6 WHERE id = $7
      RETURNING id;`;
    const { rows } = await db.query(query, [
      profileData.gender,
      profileData.sexual_preferences,
      profileData.biography,
      JSON.parse(profileData.tags),
      profileData.images,
      profileData.age,
      user.id,
    ]);
    console.log("Updated profile: ========>>", rows[0]);
    return rows[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function handleUpdateProfileSettings(
  profileData: Profile,
  user: User
): Promise<string | null> {
  try {
    let query = `UPDATE "USER" 
      SET gender = $1, sexual_preferences = $2, bio = $3, interests = $4, pictures = $5, first_name = $6, last_name = $7, email = $8,
      latitude = $9, longitude = $10, address = $11, age = $12
      WHERE id = $13 RETURNING id;
     `;
    const { rows } = await db.query(query, [
      profileData.gender,
      profileData.sexual_preferences,
      profileData.biography,
      JSON.parse(profileData.tags),
      profileData.images,
      profileData.first_name,
      profileData.last_name,
      profileData.email,
      profileData.latitude,
      profileData.longitude,
      profileData.address,
      profileData.age,
      user.id,
    ]);
    if (profileData.new_password) {
      query = `UPDATE "USER" SET password = $1 WHERE id = $2 RETURNING id;`;
      const { rows: data } = await db.query(query, [
        profileData.new_password,
        user.id,
      ]);
    }
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
  handleGetgetFilteredProfiles,
  handleLikeProfile,
  handleSetGeoLocation,
  handleUpdateProfile,
  handleUpdateProfileSettings,
};
