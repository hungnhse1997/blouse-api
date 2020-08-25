import { Router } from "express";
import PatientService from "../services/patient-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all Patient
router.get("/", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], PatientService.getAllPatient);

//Search Patient
router.get("/search", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], PatientService.searchPatient);

//Get one Patient by ID
router.get("/:id", [AuthToken], PatientService.getPatientById);

//Get one Patient by User ID
router.get("/patient-by-userId/:id", [AuthToken], PatientService.getPatientByUserId);

//Register new Patient
router.post("/register", PatientService.registerPatient);

//Set active one Patient
router.put("/setActive/:id", [AuthToken, checkRole([Constant.STAFF, Constant.ADMIN])], PatientService.setActivePatient);

//Delete one Patient
router.delete("/:id", [AuthToken, checkRole([Constant.ADMIN])], PatientService.deletePatient);

export default router;