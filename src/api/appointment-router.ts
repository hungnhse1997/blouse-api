import { Router } from "express";
import AppointmentService from "../services/appointment-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all appointment
router.get("/", AuthToken, AppointmentService.getAllAppointment);

//Search appointment
router.get("/search", AuthToken, AppointmentService.searchAppointment);

//Get appointment by id
router.get("/:id", AuthToken, AppointmentService.getAppointmentById);

//Create appointment
router.post("/", AuthToken, AppointmentService.createAppointment);

//Update appointment
router.put("/", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])],AppointmentService.updateAppointment);

//Set active appointment
router.put("/setActive/:id",[AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], AppointmentService.setActiveAppointment);

export default router;