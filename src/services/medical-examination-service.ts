import { Appointment } from './../models/appointment';
import { Request, Response } from "express";
import { MedicalExamination } from "../models/medical-examination";
import { getRepository } from "typeorm";
import { Constant } from "../utils/constant";
import PaymentHistoryService from "./payment-history-service";
import AppointmentService from "./appointment-service";
import Common from "../utils/common";
import { Patient } from "../models/patient";

class MedicalExaminationService {

    static registerMedicalExamination = async (req: Request, res: Response) => {
        let userId = Common.getCurrentUserId(req, res);
        let patient = await Patient.findOne({ userId: userId });

        if (!patient) return res.status(400).send({ message: "Patient not Found" });
        // status = 0 : chưa confirm lịch hẹn
        // status = 1 : đã xác nhận, chờ thanh toán
        // status = 2 : đã thanh toán
        // status = 3 : đã khám
        // status = 4 : đã hủy
        let medicalExamination = await getRepository(MedicalExamination)
            .createQueryBuilder("medicalExamination")
            .where(`medicalExamination.patientId = '${patient.id}' AND medicalExamination.doctorId = '${req.body.doctorId}' AND medicalExamination.status = 0`)
            .getOne();

        if (medicalExamination) return res.status(400).send({ message: "Register Medical Examination Existed." });

        medicalExamination = new MedicalExamination();
        medicalExamination.patientId = patient.id;
        medicalExamination.doctorId = req.body.doctorId;
        // medicalExamination.medicalReportId = req.body.medicalReportId;
        medicalExamination.status = Constant.ZERO;
        medicalExamination.isActive = Constant.ONE;
        medicalExamination.createdAt = (new Date());
        medicalExamination.modifiedAt = (new Date());
        await MedicalExamination.save(medicalExamination);

        //register Payment History
        let infor = await PaymentHistoryService.registerPayment(req, res, medicalExamination.id, patient.id);
        if (!infor) return res.status(400).send({ message: "Register Payment Falsed" });
        //register Appointment
        infor = await AppointmentService.registerAppointment(req, res, medicalExamination.id, patient.id);
        if (!infor) return res.status(400).send({ message: "Register Appointment Falsed" });

        return res.status(200).send({ message: "Register Medical Examination Successfully !" });
    }

    // static setActiveByExaminationId = async (req: Request, res: Response, medicalExaminationId: number) => {
    //     let examination = await MedicalExamination.findOne(medicalExaminationId);
    //     if (!examination) return res.status(400).send("Examination Not Found.");

    //     examination.isActive === Constant.ONE ? examination.isActive = Constant.ZERO : examination.isActive = Constant.ONE;
    //     examination.modifiedAt = (new Date());
    //     await MedicalExamination.save(examination);

    //     return res.status(200).send({ message: "Set Active Examination Successfully !" });
    // }

    static getAllExamination = async (req: Request, res: Response) => {
        let count, examinations;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        let currentUserId = Common.getCurrentUserId(req, res);
        let patient = await Patient.findOne({ where: { userId: currentUserId } });
        if (!patient) return res.status(400).send({ message: "Patient not Found" });

        count = await MedicalExamination.count({ where: { patientId: patient.id } });

        if (count == 0) return res.status(400).send({ message: "User has no examination." });
        if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

        examinations = await getRepository(MedicalExamination)
            .createQueryBuilder("examination")
            .select([
                "examination.id",
                "examination.patientId",
                "examination.doctorId",
                "examination.status",
                "examination.isActive",
                "examination.createdAt",
                "examination.modifiedAt",
                "doctor.id",
                "du.id",
                "du.fullName",
                "patient.id",
                "pu.id",
                "pu.fullName",
                "appointment.id",
                "appointment.appointmentTime",
                "appointment.place",
                "department.id",
                "department.name",
                "hospital.id",
                "hospital.name",
            ])
            .leftJoin("examination.doctor", "doctor")
            .leftJoin("examination.patient", "patient")
            .leftJoin("patient.user", "pu")
            .leftJoin("doctor.user", "du")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .leftJoin("examination.appointment", "appointment")
            .where(`examination.patientId = '${patient.id}'`)
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size)),
                total_item: count
            },
            data: examinations
        });
    }

    static searchByPatientName = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let patientId = req.query.p;
        let txtSearch = req.query.q; //p = patientId, q = searchQuery
        let count, examinations: any[];

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";
        if (txtSearch && !patientId) {
            count = await getRepository(MedicalExamination)
                .createQueryBuilder("examination")
                .leftJoin("examination.patient", "patient")
                .leftJoin("patient.user", "user")
                .where(`
                    user.fullName LIKE '%${txtSearch}%'
                    OR user.phoneNumber LIKE '%${txtSearch}%'
                    OR user.email LIKE '%${txtSearch}%'
                    OR user.username LIKE '%${txtSearch}%'
                `)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User has no examination." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            examinations = await getRepository(MedicalExamination)
            .createQueryBuilder("examination")
            .select([
                "examination.id",
                "examination.patientId",
                "examination.doctorId",
                "examination.status",
                "examination.isActive",
                "examination.createdAt",
                "examination.modifiedAt",
                "doctor.id",
                "du.id",
                "du.fullName",
                "patient.id",
                "pu.id",
                "pu.fullName",
                "appointment.id",
                "appointment.appointmentTime",
                "appointment.place",
                "department.id",
                "department.name",
                "hospital.id",
                "hospital.name",
            ])
            .leftJoin("examination.doctor", "doctor")
            .leftJoin("examination.patient", "patient")
            .leftJoin("patient.user", "pu")
            .leftJoin("doctor.user", "du")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .leftJoin("examination.appointment", "appointment")
            .where(`
                pu.fullName LIKE '%${txtSearch}%'
            `)
            .orWhere(`
                pu.phoneNumber LIKE '%${txtSearch}%'
            `)
            .orWhere(`
                pu.email LIKE '%${txtSearch}%'
            `)
            .orWhere(`
                pu.username LIKE '%${txtSearch}%'
            `)
            .orderBy("examination.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();
        }
        else if (!txtSearch && patientId) {            
            count = await getRepository(MedicalExamination)
                .createQueryBuilder("examination")
                .leftJoin("examination.patient", "patient")
                .where(`
                    patient.id = '${patientId}'
                `)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User has no examination." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            examinations = await getRepository(MedicalExamination)
            .createQueryBuilder("examination")
            .select([
                "examination.id",
                "examination.patientId",
                "examination.doctorId",
                "examination.status",
                "examination.isActive",
                "examination.createdAt",
                "examination.modifiedAt",
                "doctor.id",
                "du.id",
                "du.fullName",
                "patient.id",
                "pu.id",
                "pu.fullName",
                "appointment.id",
                "appointment.appointmentTime",
                "appointment.place",
                "department.id",
                "department.name",
                "hospital.id",
                "hospital.name",
            ])
            .leftJoin("examination.doctor", "doctor")
            .leftJoin("examination.patient", "patient")
            .leftJoin("patient.user", "pu")
            .leftJoin("doctor.user", "du")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .leftJoin("examination.appointment", "appointment")
            .where(`
                patient.id = '${patientId}'
            `)
            .orderBy("examination.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();
        } else if (!txtSearch && !patientId) {
            count = await MedicalExamination.count();
            
            if (count == 0) return res.status(400).send({ message: "No examination found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            examinations = await getRepository(MedicalExamination)
            .createQueryBuilder("examination")
            .select([
                "examination.id",
                "examination.patientId",
                "examination.doctorId",
                "examination.status",
                "examination.isActive",
                "examination.createdAt",
                "examination.modifiedAt",
                "doctor.id",
                "du.id",
                "du.fullName",
                "patient.id",
                "pu.id",
                "pu.fullName",
                "appointment.id",
                "appointment.appointmentTime",
                "appointment.place",
                "department.id",
                "department.name",
                "hospital.id",
                "hospital.name",
            ])
            .leftJoin("examination.doctor", "doctor")
            .leftJoin("examination.patient", "patient")
            .leftJoin("patient.user", "pu")
            .leftJoin("doctor.user", "du")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .leftJoin("examination.appointment", "appointment")
            .orderBy("examination.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();
        } else {
            count = 0;
            examinations = null;
        }

        if (!examinations) return res.status(400).send({ message: "No examination Found." });

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size))
            },
            data: examinations
        });
    }

    static confirmExamination = async (req: Request, res: Response) => {
        let examination = await MedicalExamination.findOne(req.body.id);
        
        let appointment = await Appointment.findOne({ where: { medicalExaminationId : req.body.id } });
        
        examination.doctorId = req.body.doctorId;
        examination.status = Constant.ONE;
        examination.modifiedAt = new Date;

        appointment.doctorId = req.body.doctorId;
        appointment.appointmentTime = req.body.appointmentTime;
        appointment.place = req.body.place;
        appointment.modifiedAt = new Date;

        // MedicalExamination.save(examination)
        //     .then(e_result => {                
        //         Appointment.save(appointment)
        //             .then(a_result => {
        //                 return res.status(200).send({ message: "Confirm Examination Successfully !" });
        //             })
        //     })
        //     .catch(error => {
        //         return res.status(400).send({ message: "Some error happen: ", error });       
        //     })
        await MedicalExamination.save(examination);
        await Appointment.save(appointment);

        return res.status(200).send({ message: "Confirm Examination Successfully !" });
    }
}
export default MedicalExaminationService