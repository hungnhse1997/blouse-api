import { Router } from "express";
import MedicineMedicalRecordService from "../services/medicine-medical-record-service";

const router = Router();

//Get Prescription by MedicalRecordID
router.get("/:id", MedicineMedicalRecordService.getPrescriptionByMedicalRecordID);

//Create Prescription
router.post("/", MedicineMedicalRecordService.createPrescription);

//Update Prescription
router.put("/", MedicineMedicalRecordService.updatePrescription);

export default router;