import pool from "./client";

const createTableQuery = `
CREATE TABLE IF NOT EXISTS "USER" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE,
  "password" VARCHAR(255),
  "gender" VARCHAR(255),
  "sexual_preferences" VARCHAR(255)[],
  "interests" VARCHAR(255)[],
  "pictures" VARCHAR(255)[],
  "fame_rating" NUMERIC,
  "location" VARCHAR(255),
  "age" NUMERIC,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool
  .query(createTableQuery)
  .then(() => {
    console.log("User table created successfully");
    pool.end();
  })
  .catch((error) => {
    console.error("Error creating user table:", error);
    pool.end();
  });

const createTableViewQuery = `
CREATE TABLE IF NOT EXISTS "user_views" (
  "viewer_id" UUID,
  "viewed_id" UUID,
  "view_time" DATE,
  CONSTRAINT fk_viewer_id FOREIGN KEY ("viewer_id") REFERENCES "USER" ("id"),
  CONSTRAINT fk_viewed_id FOREIGN KEY ("viewed_id") REFERENCES "USER" ("id")
);
`;

pool
  .query(createTableViewQuery)
  .then(() => {
    console.log("User views table created successfully");
    pool.end();
  })
  .catch((error) => {
    console.error("Error creating user views table:", error);
    pool.end();
  });

const createTableLikesQuery = `
CREATE TABLE IF NOT EXISTS "user_likes" (
  "liker_id" UUID,
  "liked_id" UUID,
  "like_time" DATE,
  CONSTRAINT fk_liker_id FOREIGN KEY ("liker_id") REFERENCES "USER" ("id"),
  CONSTRAINT fk_liked_id FOREIGN KEY ("liked_id") REFERENCES "USER" ("id")
);
`;

pool
  .query(createTableLikesQuery)
  .then(() => {
    console.log("User likes table created successfully");
    pool.end();
  })
  .catch((error) => {
    console.error("Error creating user likes table:", error);
    pool.end();
  });

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

pool
  .query(createTableMessageQuery)
  .then(() => {
    console.log("Message table created successfully");
    pool.end();
  })
  .catch((error) => {
    console.error("Error creating Message table:", error);
    pool.end();
  });
