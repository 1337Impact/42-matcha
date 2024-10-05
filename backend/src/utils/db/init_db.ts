import pool from "./client";

const createExtensionQuery = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`;

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
  "interests" TEXT[],
  "pictures" TEXT,
  "fame_rating" NUMERIC,
  "location" VARCHAR(255),
  latitude NUMERIC,
  longitude NUMERIC,
  "address" VARCHAR(255),
  "age" NUMERIC,
  "bio" TEXT,
  "is_verified" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "reset_password_expires" TIMESTAMP,
  "reset_password_token" TEXT DEFAULT '',
  "report_count" NUMERIC DEFAULT 0
);
`;

const createTableViewQuery = `
CREATE TABLE IF NOT EXISTS "user_views" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "viewer_id" UUID,
  "viewed_id" UUID,
  "view_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_viewer_id FOREIGN KEY ("viewer_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_viewed_id FOREIGN KEY ("viewed_id") REFERENCES "USER" ("id") ON DELETE CASCADE
);
`;

const createTableLikesQuery = `
CREATE TABLE IF NOT EXISTS "user_likes" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "liker_id" UUID,
  "liked_id" UUID,
  "like_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_liker_id FOREIGN KEY ("liker_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_liked_id FOREIGN KEY ("liked_id") REFERENCES "USER" ("id")  ON DELETE CASCADE
);
`;

const createTableMessageQuery = `
CREATE TABLE IF NOT EXISTS "Message" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "sender_id" UUID,
  "receiver_id" UUID,
  "time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "content" TEXT,
  CONSTRAINT fk_sender_id FOREIGN KEY ("sender_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_receiver_id FOREIGN KEY ("receiver_id") REFERENCES "USER" ("id") ON DELETE CASCADE
);
`;

// Table for blocking users

const createTableBlockQuery = `
CREATE TABLE IF NOT EXISTS "Blocked" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "blocker_id" UUID,
  "blocked_id" UUID,
  "block_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_blocker_id FOREIGN KEY ("blocker_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_blocked_id FOREIGN KEY ("blocked_id") REFERENCES "USER" ("id") ON DELETE CASCADE
);
`;

const EventsTable = `
CREATE TABLE IF NOT EXISTS "Events" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "user1_id" UUID,
  "user2_id" UUID,
  "event_name" VARCHAR(255),
  "event_date" TIMESTAMP,
  "event_location" VARCHAR(255),
  "event_description" TEXT,
  "confirmed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user1_id FOREIGN KEY ("user1_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_user2_id FOREIGN KEY ("user2_id") REFERENCES "USER" ("id") ON DELETE CASCADE
);
`;

// request scheduling an event
const createTableRequestQuery = `
CREATE TABLE IF NOT EXISTS "EventRequests" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "sender_id" UUID,
  "receiver_id" UUID,
  "event_id" UUID,
  "request_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "status" VARCHAR(255),
  CONSTRAINT fk_sender_id FOREIGN KEY ("sender_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_receiver_id FOREIGN KEY ("receiver_id") REFERENCES "USER" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_event_id FOREIGN KEY ("event_id") REFERENCES "Events" ("id") ON DELETE CASCADE
);
`;

const createTableNotificationQuery = `
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "user_id" UUID,
  "content" TEXT,
  "type" TEXT,
  "is_read" BOOLEAN DEFAULT FALSE,
  "time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_id FOREIGN KEY ("user_id") REFERENCES "USER" ("id") ON DELETE CASCADE
);
`;


async function createTables() {
  try {
    await pool.query(createExtensionQuery);
    console.log("Extension created successfully");
    await pool.query(createTableUserQuery);
    console.log("User table created successfully");
    await pool.query(createTableViewQuery);
    console.log("User views table created successfully");
    await pool.query(createTableLikesQuery);
    console.log("User likes table created successfully");
    await pool.query(createTableMessageQuery);
    console.log("Message table created successfully");
    await pool.query(EventsTable);
    console.log("Events table created successfully");
    await pool.query(createTableRequestQuery);
    console.log("Event request table created successfully");
    await pool.query(createTableNotificationQuery);
    console.log("Notifications table created successfully");
    await pool.query(createTableBlockQuery);
    console.log("Blocked table created successfully");
    await pool.query(createTableNotificationQuery);
    console.log("Notifications table created successfully");
    pool.end();
  } catch (error) {
    console.error("Error creating tables:", error);
    pool.end();
  }
}

createTables();