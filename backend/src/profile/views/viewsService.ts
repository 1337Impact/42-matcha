import db from "../../utils/db/client";
import { User, Profile } from "../types";

async function handleGetViews(user: User): Promise<string[] | null> {
  try {
    const query = `SELECT "USER".id, "USER".first_name, "USER".last_name, "USER".username, "USER".pictures, "user_views"."view_time"
      FROM "user_views" 
      INNER JOIN "USER" ON "user_views"."viewer_id" = "USER"."id"
      WHERE "viewed_id" = $1
      ORDER BY "user_views"."view_time" DESC;`;
    const { rows } = await db.query(query, [user.id]);
    return rows;
  } catch (error) {
    console.error("Error getting views:", error);
    throw error;
  }
}

async function handleGetViewesHistory(user: User): Promise<string[] | null> {
  try {
    const query = `SELECT "USER".id, "USER".first_name, "USER".last_name, "USER".username, "USER".pictures, "user_views"."view_time"
      FROM "user_views" 
      INNER JOIN "USER" ON "user_views"."viewed_id" = "USER"."id"
      WHERE "viewer_id" = $1
      ORDER BY "user_views"."view_time" DESC;`;
    const { rows } = await db.query(query, [user.id]);
    return rows;
  } catch (error) {
    console.error("Error getting history:", error);
    throw error;
  }
}

async function handleGetIsProfileViewed(
  profileId: string,
  user: User
): Promise<boolean> {
  try {
    const query = `SELECT * FROM "user_views" WHERE viewer_id = $1 AND viewed_id = $2;`;
    const { rows } = await db.query(query, [user.id, profileId]);
    return rows[0] ? rows[0].id : false;
  } catch (error) {
    console.error("Error getting views:", error);
    throw error;
  }
}

async function handleViewedProfile(
  profileId: string,
  user: User
): Promise<any> {
  try {
    if (profileId === user.id) {
      console.error("Cannot view your own profile");
      throw new Error("Cannot view your own profile");
    }
    const profileViewed = await handleGetIsProfileViewed(profileId, user);
    if (profileViewed) {
      const query = `UPDATE "user_views" SET view_time = CURRENT_TIMESTAMP WHERE id = $1;`;
      await db.query(query, [profileViewed]);
      return "Profile viewed successfully";
    }
    const query = `INSERT INTO "user_views" (viewer_id, viewed_id) VALUES ($1, $2);`;
    await db.query(query, [user.id, profileId]);
    return "Profile viewed successfully";
  } catch (error) {
    throw error;
  }
}

export { handleGetViews, handleViewedProfile, handleGetIsProfileViewed, handleGetViewesHistory };
