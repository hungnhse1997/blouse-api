import { Router } from "express";
import HospitalService from "../services/hospital-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all hospital
router.get("/", HospitalService.getAllHospital);

//Get Name hospital
router.get("/name", HospitalService.getNameHospital);

//Search hospital
router.get("/search", [AuthToken, checkRole([Constant.ADMIN])], HospitalService.searchHospital);

//Get one hospital by ID
router.get("/:id", [AuthToken, checkRole([Constant.ADMIN])], HospitalService.getHospitalById);

//Create new hospital
router.post("/", [AuthToken, checkRole([Constant.ADMIN])], HospitalService.createHospital);

//Set Active hospital
router.put("/setActive/:id", [AuthToken, checkRole([Constant.ADMIN])], HospitalService.setActiveHospital);

//Update new hospital
router.put("/", [AuthToken, checkRole([Constant.ADMIN])], HospitalService.updateHospital);

export default router;