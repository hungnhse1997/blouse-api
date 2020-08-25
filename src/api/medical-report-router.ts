import { Router } from "express";
import MedicalReportService from "../services/medical-report-service";

const router = Router();

//Get MedicalReport by ID
router.get("/:id", MedicalReportService.getMedicalReportById);

//Get MedicalReport by Patient
router.get("/patient/:id", MedicalReportService.getMedicalReportByPatientId);

//Create MedicalReport
router.post("/", MedicalReportService.creatMedicalReport);

//Update MedicalReport
router.put("/", MedicalReportService.updateMedicalReport);

export default router;