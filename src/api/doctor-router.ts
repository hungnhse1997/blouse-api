import { Router } from "express";
import DoctorService from "../services/doctor-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all Doctor
router.get("/", DoctorService.getAllDoctor);

//Get top 3 Doctor
router.get("/top-three", DoctorService.getTopThreeDoctor);

//Search Doctor
router.get("/search", DoctorService.searchDoctor);

//Get one Doctor by ID
router.get("/:id", [AuthToken], DoctorService.getDoctorbyId);

//Create new Doctor
router.post("/", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], DoctorService.createDoctor);

//Update new Doctor
router.put("/", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], DoctorService.updateDoctor);

//Set active one Doctor
router.put("/setActive/:id", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], DoctorService.setActiveDoctor);

//Delete one Doctor
router.delete("/:id", [AuthToken, checkRole([Constant.ADMIN])], DoctorService.deleteDoctor);

export default router;