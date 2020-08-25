import { Router } from "express";
import MomoService from '../services/momo-service';

const router = Router();

router.post('/', MomoService.getMomoPayURL);

router.post('/notify', MomoService.catchMomoNotification);

export default router;