import { Request, Response } from "express";
import { MedicineMedicalRecord } from "../models/medicine-medical-record";

class MedicineMedicalRecordService {
    static getPrescriptionByMedicalRecordID = async (req: Request, res: Response) => {
        let prescription = await MedicineMedicalRecord.find({where: {medicalRecordId: req.params.id}});

        if (!prescription) return res.status(400).send({ message: "Prescription Not Found." });

        return res.status(200).send(prescription);
    }

    static createPrescription = async (req: Request, res: Response) => {
        let prescription = req.body.prescription;
        if (!prescription) return res.status(400).send({ message: "Don't Have Prescription" });

        for (let p of prescription) {
            let medicineMedicalRecord = new MedicineMedicalRecord();
            medicineMedicalRecord.medicalRecordId = p.medicalRecordId;
            medicineMedicalRecord.medicineId = p.medicineId;
            medicineMedicalRecord.unit = p.unit
            medicineMedicalRecord.quantity = p.quantity;
            medicineMedicalRecord.note = p.note;

            await MedicineMedicalRecord.save(medicineMedicalRecord);
        }

        return res.status(200).send({ message: "Create Prescription Successfully!" });
    }

    static updatePrescription = async (req: Request, res: Response) => {
        let prescription = req.body.prescription;
        if (!prescription) return res.status(400).send({ message: "Don't Have Prescription" });

        for (let p of prescription) {
            let medicineMedicalRecord = await MedicineMedicalRecord.findOne(p.id);
            if (!medicineMedicalRecord) return res.status(400).send({ message: "Don't Have Prescription" });

            medicineMedicalRecord.medicineId = p.medicineId;
            medicineMedicalRecord.unit = p.unit ? p.unit : medicineMedicalRecord.unit;
            medicineMedicalRecord.quantity = p.quantity ? p.quantity : medicineMedicalRecord.quantity;
            medicineMedicalRecord.note = p.note ? p.note : medicineMedicalRecord.note;

            await MedicineMedicalRecord.save(medicineMedicalRecord);
        }

        return res.status(200).send({ message: "Update Prescription Successfully!" });
    }

}
export default MedicineMedicalRecordService;