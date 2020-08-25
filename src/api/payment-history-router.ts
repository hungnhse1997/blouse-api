import { Router } from "express";
import PaymentHistoryService from "../services/payment-history-service";

const router = Router();

//Get by patient or not
router.get("/", PaymentHistoryService.searchByPatientName);

//Get momo payUrl
router.post('/send', PaymentHistoryService.getMomoPayURL);

//Catch momo notification
router.post('/notify', PaymentHistoryService.catchMomoNotification);

export default router;