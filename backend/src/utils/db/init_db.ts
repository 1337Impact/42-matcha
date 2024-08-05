import pool from "./client";

const createTableUserQuery = `
DROP TABLE IF EXISTS "USER" CASCADE;
CREATE TABLE IF NOT EXISTS "USER" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE,
  "password" VARCHAR(255),
  "gender" VARCHAR(255),
  "sexual_preferences" TEXT,
  "interests" TEXT,
  "pictures" TEXT,
  "fame_rating" NUMERIC,
  "location" VARCHAR(255),
  "age" NUMERIC,
  "bio" TEXT,
  "is_verified" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createTableViewQuery = `
CREATE TABLE IF NOT EXISTS "user_views" (
  "viewer_id" UUID,
  "viewed_id" UUID,
  "view_time" DATE,
  CONSTRAINT fk_viewer_id FOREIGN KEY ("viewer_id") REFERENCES "USER" ("id"),
  CONSTRAINT fk_viewed_id FOREIGN KEY ("viewed_id") REFERENCES "USER" ("id")
);
`;

const createTableLikesQuery = `
CREATE TABLE IF NOT EXISTS "user_likes" (
  "liker_id" UUID,
  "liked_id" UUID,
  "like_time" DATE,
  CONSTRAINT fk_liker_id FOREIGN KEY ("liker_id") REFERENCES "USER" ("id"),
  CONSTRAINT fk_liked_id FOREIGN KEY ("liked_id") REFERENCES "USER" ("id")
);
`;


const createTableMessageQuery = `
CREATE TABLE IF NOT EXISTS "Message" (
  "sender_id" UUID,
  "receiver_id" UUID,
  "time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "content" TEXT,
  CONSTRAINT fk_sender_id FOREIGN KEY ("sender_id") REFERENCES "USER" ("id"),
  CONSTRAINT fk_receiver_id FOREIGN KEY ("receiver_id") REFERENCES "USER" ("id")
);
`;


async function createTables() {
  try {
    await pool.query(createTableUserQuery);
    console.log("User table created successfully");
    await pool.query(createTableViewQuery);
    console.log("User views table created successfully");
    await pool.query(createTableLikesQuery);
    console.log("User likes table created successfully");
    await pool.query(createTableMessageQuery);
    console.log("Message table created successfully");
    pool.end();
  } catch (error) {
    console.error("Error creating tables:", error);
    pool.end();
  }
}

createTables();