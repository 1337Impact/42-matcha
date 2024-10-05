import db from "../utils/db/client";
import { DateEvent, Filter, Profile, User } from "./types";

async function handleGetProfile(
  profileId: string,
  user: User
): Promise<string | null> {
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

async function handleGetMapProfiles(user: User): Promise<any> {
  try {
    const { rows: data } = await db.query(
      `SELECT id, latitude, longitude FROM "USER" WHERE id != $1;`,
      [user.id]
    );
    return data;
  } catch (error) {
    console.error("Error getting Map Profiles:", error);
    throw error;
  }
}

async function handleGetAllProfiles(user: User): Promise<any> {
  try {
    const { rows: data } = await db.query(
      `SELECT * FROM "USER" WHERE id = $1;`,
      [user.id]
    );
    const userData = data[0];

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
  try {
    const { rows: data } = await db.query(
      `SELECT id, latitude, longitude, sexual_preferences, interests FROM "USER" WHERE id = $1;`,
      [user.id]
    );
    const userData = data[0];
    // get the filtered profiles, so for example if the user set distance to 10km, we will get all profiles within 10km
    // of the user position and so on for the other filters
    let query = `
    SELECT 
        id, first_name, last_name, username, gender, bio, pictures, interests, location, latitude,
        longitude, fame_rating, distance, common_interests_count, age
    FROM (
        SELECT 
            u.id, u.first_name, u.last_name, u.username, u.gender, u.bio, u.pictures, u.interests, 
            u.location, u.latitude, u.longitude, u.fame_rating, u.age,
            (
                6371 * acos(
                    cos(radians($2)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians($3)) +
                    sin(radians($2)) * sin(radians(u.latitude))
                )
            ) AS distance,
            array_length(array(
                SELECT unnest(u.interests)
                INTERSECT
                SELECT unnest($5::text[])
            ), 1) AS common_interests_count
        FROM "USER" u
        LEFT JOIN "Blocked" b1 ON b1.blocker_id = $1 AND b1.blocked_id = u.id
        LEFT JOIN "Blocked" b2 ON b2.blocker_id = u.id AND b2.blocked_id = $1
        WHERE u.id != $1
            AND b1.blocked_id IS NULL -- The user has not blocked the other user
            AND b2.blocked_id IS NULL -- The other user has not blocked the user
            AND (
                $4 = 'bisexual'
                OR u.gender = $4
            )
            AND (
                6371 * acos(
                    cos(radians($2)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians($3)) +
                    sin(radians($2)) * sin(radians(u.latitude))
                )
            ) <= $6
            AND u.age >= $7
            AND u.age <= $8
            AND u.fame_rating >= $9
            AND u.fame_rating <= $10
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
    query += ` id DESC;`;

    const { rows } = await db.query(query, [
      user.id,
      userData.latitude,
      userData.longitude,
      profilesFilter.sexual_preferences?.toLocaleLowerCase() ||
        userData.sexual_preferences,
      profilesFilter.interests || userData.interests,
      profilesFilter.distance || 20,
      profilesFilter.min_age || 18,
      profilesFilter.max_age || 99,
      profilesFilter.min_fame_rating || 0,
      profilesFilter.max_fame_rating || 10,
    ]);
    return rows;
  } catch (error) {
    console.error("Error getting filtered Profiles:", error);
    throw error;
  }
}

async function handleGetConnections(user: User): Promise<any> {
  try {
    const query = `SELECT "USER".id, "USER".first_name, "USER".last_name, "USER".username, "USER".pictures, "user_likes_1"."like_time" AS "like_time"
    FROM "user_likes" AS "user_likes_1"
    INNER JOIN "user_likes" AS "user_likes_2" 
      ON "user_likes_1"."liker_id" = "user_likes_2"."liked_id" 
      AND "user_likes_1"."liked_id" = "user_likes_2"."liker_id"
    INNER JOIN "USER" 
      ON "user_likes_1"."liker_id" = "USER"."id"
    WHERE "user_likes_1"."liked_id" = $1
    ORDER BY "user_likes_1"."like_time" DESC;`;
    const { rows: data } = await db.query(query, [user.id]);
    return data;
  } catch (error) {
    console.error("Error getting Connections:", error);
    throw error;
  }
}

async function handleSetGeoLocation(userId: string): Promise<any> {
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

const handleReportUser = async (userId: string, user: User) => {
  try {
    const query = `UPDATE "USER" SET report_count = report_count + 1 WHERE id = $1 RETURNING report_count;`;
    const { rows } = await db.query(query, [userId]);
    if (rows[0].report_count === 5) {
      const query = `DELETE FROM "USER" WHERE id = $1;`;
      const { rows } = await db.query(query, [userId]);
    }
    return rows[0].id;
  } catch (error) {
    console.error("Error reporting user:", error);
    throw error;
  }
};

const handleBlockUser = async (userId: string, user: User) => {
  try {
    const query = `INSERT INTO "Blocked" (blocker_id, blocked_id) VALUES ($1, $2);`;
    await db.query(query, [user.id, userId]);
    return "User blocked successfully";
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

const handleGetNotifications = async (user: User) => {
  try {
    const query = `SELECT * FROM "Notification" WHERE user_id = $1 ORDER BY time DESC LIMIT 10;`;
    const { rows } = await db.query(query, [user.id]);
    return rows;
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

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
  handleReportUser,
  handleBlockUser,
  handleGetMapProfiles,
  handleGetNotifications,
};
