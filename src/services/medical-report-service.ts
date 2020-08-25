import { Request, Response } from "express";
import { MedicalReport } from "../models/medical-report";
import { Constant } from "../utils/constant";
import { getRepository, getManager } from "typeorm";

class MedicalReportService{
    static getMedicalReportByPatientId = async (req: Request, res: Response) => {
        let count = await MedicalReport.count({where: {patientId: req.params.id}});
        if(count == 0) return res.status(400).send({ message: "Medical Report Not Found." });

        let medicalReport = await getRepository(MedicalReport)
        .createQueryBuilder("medicalReport")
        .select(["medicalReport","patient.id", "user.id", "user.fullName","reportSymptom.id", "symptom.id", "symptom.name", "symptom.description"])
        .leftJoin("medicalReport.reportSymptoms", "reportSymptom")
        .leftJoin("reportSymptom.symptom", "symptom")
        .leftJoin("medicalReport.patient", "patient")
        .leftJoin("patient.user", "user")
        .where("medicalReport.patientId = :patientId", { patientId: req.params.id })
        .getMany();

        return res.status(200).send(medicalReport);
    }

    static getMedicalReportById = async (req: Request, res: Response) => {
        let count = await MedicalReport.count({where: {patientId: req.params.id}});
        if(count == 0) return res.status(400).send({ message: "Medical Report Not Found." });

        let medicalReport = await getRepository(MedicalReport)
        .createQueryBuilder("medicalReport")
        .select(["medicalReport","patient.id", "user.id", "user.fullName","reportSymptom.id", "symptom.id", "symptom.name", "symptom.description"])
        .leftJoin("medicalReport.reportSymptoms", "reportSymptom")
        .leftJoin("reportSymptom.symptom", "symptom")
        .leftJoin("medicalReport.patient", "patient")
        .leftJoin("patient.user", "user")
        .where("medicalReport.patientId = :patientId", { patientId: req.params.id })
        .getOne();

        return res.status(200).send(medicalReport);
        
    }

    static creatMedicalReport = async (req: Request, res: Response) => {
        let count = await MedicalReport.count({where:  { patientId: req.body.patientId } });
        if(count != 0) return res.status(400).send({ message: "Medical Report already existed." });

        let medicalReport = new MedicalReport();
        medicalReport.patientId = req.body.patientId;
        medicalReport.description = req.body.description;
        medicalReport.isActive = Constant.ONE;
        medicalReport.createdAt = (new Date());
        medicalReport.modifiedAt = (new Date());

        await MedicalReport.save(medicalReport);
        return res.status(200).send({ message: "Create Medical Report Successfully!" });
    }

    static updateMedicalReport = async (req: Request, res: Response) => {
        let medicalReport = await MedicalReport.findOne(req.body.id);
        if(!medicalReport) return res.status(400).send({ message: "Medical Report not existed." });

        medicalReport.description = req.body.description ? req.body.description : medicalReport.description;
        medicalReport.modifiedAt = (new Date());
        await MedicalReport.save(medicalReport);
    }

    static deleteMedicalReport = async (req: Request, res: Response) => {
        
    }
}
export default MedicalReportService