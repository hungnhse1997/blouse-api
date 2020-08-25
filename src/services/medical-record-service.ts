
import { Request, Response } from "express";
import { MedicalRecord } from "../models/medical-record";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";
import { Hospital } from "../models/hospital";

class MedicalRecordService {
    static getAllMedicalRecord = async (req: Request, res: Response) => {
        let count, medicalRecord;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            count = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .getCount();

            if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            medicalRecord = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                    "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .orderBy("medicalRecord.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        } else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });

            count = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .leftJoin("doctor.department", "department")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            medicalRecord = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                    "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .leftJoin("doctor.department", "department")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .orderBy("medicalRecord.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        } else if (user.role === Constant.DOCTOR) {
            let doctor = await Doctor.findOne({ userId: user.id });

            count = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .where(`medicalExamination.doctorId = '${doctor.id}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            medicalRecord = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                    "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .where(`medicalExamination.doctorId = '${doctor.id}'`)
                .orderBy("medicalRecord.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        } else if (user.role === Constant.PATIENT) {
            let patient = await Patient.findOne({ userId: user.id });

            count = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .where(`medicalExamination.patientId = '${patient.id}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            medicalRecord = await getRepository(MedicalRecord)
                .createQueryBuilder("medicalRecord")
                .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                    "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("medicalExamination.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                .leftJoin("medicineMedicalRecord.medicine", "medicine")
                .where(`medicalExamination.patientId = '${patient.id}'`)
                .orderBy("medicalRecord.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        }

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size)),
                total_item: count
            },
            data: medicalRecord
        });
    }

    static searchMedicalRecord = async (req: Request, res: Response) => {
        let count, medicalRecord;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let departmentId = req.query.departmentId;
        let hospitalId = req.query.HospitalId;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            //search in one department
            if (departmentId) {
                if (txtSearch) {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
            //search in one hospital
            else if (hospitalId) {
                if (txtSearch) {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
            //search all
            else {
                if (txtSearch) {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                }
            }
            return res.status(200).send({
                page: {
                    page_index: Number(page),
                    page_size: Number(size),
                    total_page: Math.ceil(count / Number(size)),
                    total_item: count
                },
                data: medicalRecord
            });

        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });
            //search in one department
            if (departmentId) {
                if (txtSearch) {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
            //search in hospital of staff
            else {
                if (txtSearch) {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%')`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    medicalRecord = await getRepository(MedicalRecord)
                        .createQueryBuilder("medicalRecord")
                        .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                            "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                        .leftJoin("medicalExamination.doctor", "doctor")
                        .leftJoin("medicalExamination.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                        .leftJoin("medicineMedicalRecord.medicine", "medicine")
                        .leftJoin("doctor.department", "department")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .orderBy("medicalRecord.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }

        }
        else if (user.role === Constant.DOCTOR) {
            //search by doctor ID
            let doctor = await Doctor.findOne({ userId: user.id });

            if (txtSearch) {
                count = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${doctor.id}'`)
                    .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                medicalRecord = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                        "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${doctor.id}'`)
                    .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                    .orderBy("medicalRecord.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            } else {
                count = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${doctor.id}'`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                medicalRecord = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                        "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${doctor.id}'`)
                    .orderBy("medicalRecord.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            }

        }
        else if (user.role === Constant.PATIENT) {
            //search by patient ID
            let patient = await Patient.findOne(user.id);

            if (txtSearch) {
                count = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${patient.id}'`)
                    .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                medicalRecord = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                        "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${patient.id}'`)
                    .andWhere(`(user_doctor.fullName like '%${txtSearch}%' 
                                OR user_doctor.email like '%${txtSearch}%' 
                                OR user_patient.fullName like '%${txtSearch}%' 
                                OR user_patient.email like '%${txtSearch}%' 
                                OR medicalRecord.pathology like '%${txtSearch}%' 
                                OR medicalRecord.description like '%${txtSearch}%')`)
                    .orderBy("medicalRecord.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            } else {
                count = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoin("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${patient.id}'`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "MedicalRecord Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                medicalRecord = await getRepository(MedicalRecord)
                    .createQueryBuilder("medicalRecord")
                    .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                        "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("medicalExamination.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
                    .leftJoin("medicineMedicalRecord.medicine", "medicine")
                    .where(`medicalExamination.doctorId = '${patient.id}'`)
                    .orderBy("medicalRecord.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            }
        }

    }

    static getMedicalRecordById = async (req: Request, res: Response) => {
        let medicalRecord = await getRepository(MedicalRecord)
            .createQueryBuilder("medicalRecord")
            .select(["medicalRecord.id", "medicalExamination.id", "medicalRecord.description", "medicalRecord.pathology", "medicalRecord.treatment",
                "medicalRecord.createdAt", "medicalRecord.modifiedAt", "medicine.id", "medicine.name", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
            .leftJoin("medicalRecord.medicalExamination", "medicalExamination")
            .leftJoin("medicalExamination.doctor", "doctor")
            .leftJoin("medicalExamination.patient", "patient")
            .leftJoin("doctor.user", "user_doctor")
            .leftJoin("patient.user", "user_patient")
            .leftJoinAndSelect("medicalRecord.medicineMedicalRecords", "medicineMedicalRecord")
            .leftJoin("medicineMedicalRecord.medicine", "medicine")
            .where(`medicalRecord.id = '${req.params.id}'`)
            .getOne();

        if (!medicalRecord) return res.status(400).send({ message: "Medical Record Not Found." });

        return res.status(200).send(medicalRecord);
    }

    static createMedicalRecord = async (req: Request, res: Response) => {
        let medicalRecord = await MedicalRecord.findOne({ where: { medicalExaminationId: req.body.medicalExaminationId } });
        if (medicalRecord) return res.status(400).send({ message: 'Medical Record already existed.' });

        medicalRecord = new MedicalRecord();
        medicalRecord.medicalExaminationId = req.body.medicalExaminationId;
        medicalRecord.description = req.body.description;
        medicalRecord.pathology = req.body.pathology;
        medicalRecord.treatment = req.body.treatment;
        medicalRecord.isActive = req.body.isActive;
        medicalRecord.createdAt = (new Date());
        medicalRecord.modifiedAt = (new Date());

        await MedicalRecord.save(medicalRecord);

        return res.status(200).send({ message: 'Create MedicalRecord Successfully!' });
    }

    static updateMedicalRecord = async (req: Request, res: Response) => {
        let medicalRecord = await MedicalRecord.findOne({ id: req.body.id });

        if (!medicalRecord) return res.status(400).send({ message: 'Medical Record not existed.' });

        medicalRecord.medicalExaminationId = req.body.medicalExaminationId ? req.body.medicalExaminationId : medicalRecord.medicalExaminationId;
        medicalRecord.description = req.body.description ? req.body.description : medicalRecord.description;
        medicalRecord.pathology = req.body.pathology ? req.body.pathology : medicalRecord.pathology;
        medicalRecord.treatment = req.body.treatment ? req.body.treatment : medicalRecord.treatment;
        medicalRecord.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : medicalRecord.isActive;
        medicalRecord.modifiedAt = (new Date());

        await MedicalRecord.save(medicalRecord);

        return res.status(200).send({ message: "Update MedicalRecord Successfully !" });
    }

    static setActiveMedicalRecord = async (req: Request, res: Response) => {
        let medicalRecord = await MedicalRecord.findOne(req.params.id);

        if (!medicalRecord) return res.status(400).send({ message: "MedicalRecord Not Found." });

        medicalRecord.isActive === Constant.ONE ? medicalRecord.isActive = Constant.ZERO : medicalRecord.isActive = Constant.ONE;
        medicalRecord.modifiedAt = (new Date());

        await MedicalRecord.save(medicalRecord);

        return res.status(200).send({ message: "Set Active MedicalRecord Successfully !" });
    }

    static deleteMedicalRecord = async (req: Request, res: Response) => {
        let medicalRecord = await MedicalRecord.findOne(req.params.id);

        if (!medicalRecord) return res.status(400).send({ message: "MedicalRecord Not Found." });

        medicalRecord.isActive = Constant.ZERO;
        medicalRecord.modifiedAt = (new Date());

        await MedicalRecord.save(medicalRecord);

        return res.status(200).send({ message: "Delete MedicalRecord Successfully !" });
    }
}

export default MedicalRecordService;