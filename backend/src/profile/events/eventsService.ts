import db from "../../utils/db/client";
import { DateEvent, User } from "../types";

const handleSendRequestDateSchedule = async (event: DateEvent, user: User) => {
  try {
    const query = `INSERT INTO "Events" (user1_id, user2_id, event_name, event_date, event_location, event_description) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;`;
    const query1 = `INSERT INTO "EventRequests" (sender_id, receiver_id, event_id, status) VALUES ($1, $2, $3, $4);`;
    const { rows: event_id } = await db.query(query, [
      user.id,
      event.user_id,
      event.event_name,
      event.event_date,
      event.event_location,
      event.event_description,
    ]);
    await db.query(query1, [user.id, event.user_id, event_id[0].id, "pending"]);
    return event_id[0].id;
  } catch (error) {
    console.error("Error scheduling date:", error);
    throw error;
  }
};

const handleRespondRequestDateSchedule = async (event: any, user: User) => {
  try {
    console.log("Event response: ----> ", event);
    if (event.response === "accepted") {
      const query = `UPDATE "EventRequests" SET status = $1 WHERE receiver_id = $2 AND event_id = $3;`;
      await db.query(query, ["accepted", user.id, event.eventId]);
      const query1 = `UPDATE "Events" SET confirmed = $1 WHERE id = $2 RETURNING *;`;
      const { rows } = await db.query(query1, [true, event.eventId]);
      return "Date request accepted successfully";
    } else if (event.response === "rejected") {
      const query1 = `DELETE FROM "Events" WHERE id = $1;`;
      const query = `DELETE FROM "EventRequests" WHERE receiver_id = $1 AND event_id = $2;`;
      await db.query(query, [user.id, event.eventId]);
      await db.query(query1, [event.eventId]);
      return null;
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    console.error("Error responding to date request:", error);
    throw error;
  }
};

const handleGetEvent = async (eventId: string, user: User) => {
  try {
    const query = `SELECT * FROM "Events" WHERE id = $1 AND (user2_id = $2) AND event_date > NOW() AND confirmed = $3;`;
    const { rows } = await db.query(query, [eventId, user.id, false]);
    if (rows.length) {
      return rows[0];
    }
    if (rows.length === 0) {
      throw new Error("Event not found or unauthorized");
    }
  } catch (error) {
    console.error("Error getting event:", error);
    throw error;
  }
};

const handleGetAllEvents = async (user: User) => {
  try {
    const query = `SELECT * FROM "Events" WHERE user1_id = $1 OR user2_id = $1 AND event_date > NOW() AND confirmed = $2;`;
    const { rows } = await db.query(query, [user.id, true]);
    return rows;
  } catch (error) {
    console.error("Error getting events:", error);
    throw error;
  }
};

export {
  handleRespondRequestDateSchedule,
  handleSendRequestDateSchedule,
  handleGetEvent,
  handleGetAllEvents,
};
