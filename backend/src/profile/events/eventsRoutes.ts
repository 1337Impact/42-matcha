import { Router } from "express";
import { getAllEvents, getEvent, requestDateSchedule, respondRequestDateSchedule } from "./eventsControllers";

const router = Router();

// a route to get a specific event by id, i pass the event id as a query parameter
router.get("/", getEvent);
router.get("/all", getAllEvents);
router.post("/request-date", requestDateSchedule);
router.post("/respond-request-date", respondRequestDateSchedule);

export default router;