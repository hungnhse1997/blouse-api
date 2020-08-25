import { Router } from "express";
import FeedbackService from "../services/feedback-service";

const router = Router();

//Get Feedback by doctor ID
router.get("/:id", FeedbackService.getFeedbackbyDoctorId);

//Create new Feedback
router.post("/", FeedbackService.createFeedback);

//Delete new Feedback
router.delete("/", FeedbackService.deleteFeedback);

export default router;