import { Router } from "express";
import MedicalRecordService from "../services/medical-record-service";
import { AuthToken } from "../middleware/auth-token";

const router = Router();

//Get all MedicalRecord
router.get("/", [AuthToken], MedicalRecordService.getAllMedicalRecord);

//Search MedicalRecord
router.get("/search", [AuthToken], MedicalRecordService.searchMedicalRecord);

//Get MedicalRecord by id
router.get("/:id", [AuthToken], MedicalRecordService.getMedicalRecordById);

//Create MedicalRecord
router.post("/", [AuthToken], MedicalRecordService.createMedicalRecord);

//Update MedicalRecord
router.put("/", [AuthToken], MedicalRecordService.updateMedicalRecord);

//Set active MedicalRecord
router.put("/setActive/:id", [AuthToken], MedicalRecordService.setActiveMedicalRecord);

export default router;