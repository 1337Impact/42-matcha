import { sendNotification } from "../../utils/socket";
import {
  handleGetAllEvents,
  handleGetEvent,
  handleRespondRequestDateSchedule,
  handleSendRequestDateSchedule,
} from "./eventsService";

const getEvent = async (req: any, res: any) => {
  const query = req.query;
  try {
    const eventId = query.eventId;
    const data = await handleGetEvent(eventId, req.user);
    res.send(data);
  } catch (error) {
    console.error("Error getting event:", error);
    res.status(400).send({ message: "Event not found or unauthorized" });
  }
};

const getAllEvents = async (req: any, res: any) => {
  try {
    const data = await handleGetAllEvents(req.user);
    res.send(data);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(400).send({ message: "Error getting events" });
  }
};

const requestDateSchedule = async (req: any, res: any) => {
  try {
    const data = await handleSendRequestDateSchedule(req.body, req.user);
    if (data) {
      sendNotification(
        {
          content: `@${req.user.username} has requested a date schedule.`,
          data: data,
          type: "date",
        },
        req.body.user_id
      );
      console.log("Request sent successfully : ", data, req.body.user_id);
      res.send("Request sent successfully");
    }
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const respondRequestDateSchedule = async (req: any, res: any) => {
  try {
    const response = await handleRespondRequestDateSchedule(req.body, req.user);
    if (response) {
      sendNotification(
        {
          content: `@${req.user.username} has accepted your date schedule request.`,
          type: "date",
        },
        req.body.event.user_id
      );
      res.send("Request accepted successfully");
    } else {
      sendNotification(
        {
          content: `@${req.user.username} has declined your date schedule request.`,
          type: "date",
        },
        req.body.event.user_id
      );
      res.send("Request declined successfully");
    }
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

export {
  getEvent,
  requestDateSchedule,
  respondRequestDateSchedule,
  getAllEvents,
};
