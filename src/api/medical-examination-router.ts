import { Router } from "express";
import MedicalExaminationService from "../services/medical-examination-service";
import { AuthToken } from "../middleware/auth-token";

const router = Router();
//register Medical Examination
router.post("/", [AuthToken], MedicalExaminationService.registerMedicalExamination);

router.get("/", [AuthToken], MedicalExaminationService.searchByPatientName);

router.put("/confirm", [AuthToken], MedicalExaminationService.confirmExamination);

export default router;