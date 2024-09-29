import { Router } from "express";
import { getEvent, requestDateSchedule, respondRequestDateSchedule } from "./eventsControllers";

const router = Router();

router.get("/?eventId", getEvent);
router.post("/request-date", requestDateSchedule);
router.post("/respond-request-date", respondRequestDateSchedule);

export default router;