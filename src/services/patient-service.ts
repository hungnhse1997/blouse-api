import { Request, Response } from "express";
import { Patient } from "../models/patient";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import UserService from './user-service';
import { v4 as uuid } from 'uuid';


class PatientService {

    static registerPatient = async (req: Request, res: Response) => {
        let userId = uuid();
        let info = await UserService.registerUser(req, res, userId, Constant.PATIENT);
        if (!info) return res.status(400).send({ message: 'User already registered.' });

        let patient = new Patient();
        patient.id = uuid();
        patient.userId = userId;
        patient.isActive = Constant.ONE;
        patient.createdAt = (new Date());
        patient.modifiedAt = (new Date());
        await Patient.save(patient);

        return res.status(200).send({ message: 'Please check your email for account activation!' });
    }

    static getAllPatient = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let count, patient;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        //Get user ID
        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            count = await Patient.count();

            if (count == 0) return res.status(400).send({ message: "User Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            patient = await getRepository(Patient)
                .createQueryBuilder("patient")
                .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                    "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                .leftJoin("patient.user", "user")
                .orderBy("patient.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });

            count = await getRepository(Patient)
                .createQueryBuilder("patient")
                .leftJoin("patient.user", "user")
                .leftJoin("patient.medicalExaminations", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("doctor.department", "department")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            patient = await getRepository(Patient)
                .createQueryBuilder("patient")
                .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                    "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                .leftJoin("patient.user", "user")
                .leftJoin("patient.medicalExaminations", "medicalExamination")
                .leftJoin("medicalExamination.doctor", "doctor")
                .leftJoin("doctor.department", "department")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .orderBy("patient.id")
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
            data: patient
        });
    };

    static searchPatient = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let count, patient;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        //Get user ID
        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            if (txtSearch) {
                count = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .leftJoin("patient.user", "user")
                    .where(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' 
                            OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                patient = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("patient.user", "user")
                    .where(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' 
                            OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .orderBy("patient.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            }
            else {
                count = await Patient.count();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                patient = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("patient.user", "user")
                    .orderBy("patient.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            }
        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });
            if (txtSearch) {
                count = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .leftJoin("patient.user", "user")
                    .leftJoin("patient.medicalExaminations", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("doctor.department", "department")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' 
                            OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                patient = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("patient.user", "user")
                    .leftJoin("patient.medicalExaminations", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("doctor.department", "department")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .orderBy("patient.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            }
            else {
                count = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .leftJoin("patient.user", "user")
                    .leftJoin("patient.medicalExaminations", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("doctor.department", "department")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                patient = await getRepository(Patient)
                    .createQueryBuilder("patient")
                    .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("patient.user", "user")
                    .leftJoin("patient.medicalExaminations", "medicalExamination")
                    .leftJoin("medicalExamination.doctor", "doctor")
                    .leftJoin("doctor.department", "department")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .orderBy("patient.id")
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
            data: patient
        });

    }

    static getPatientById = async (req: Request, res: Response) => {
        const patientId = req.params.id;

        const patient = await getRepository(Patient)
            .createQueryBuilder("patient")
            .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
            .leftJoin("patient.user", "user")
            .where("patient.id = :id", { id: patientId })
            .getOne();
        if (!patient) return res.status(400).send({ message: "User Not Found." });

        return res.status(200).send(patient);
    };

    static getPatientByUserId = async (req: Request, res: Response) => {
        const count = await Patient.count({ userId: req.params.id });

        if (count == 0) return res.status(400).send({ message: "User Not Found." });

        const patient = await getRepository(Patient)
            .createQueryBuilder("patient")
            .select(["patient.id", "patient.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
            .leftJoin("patient.user", "user")
            .where("patient.userId = :id", { id: req.params.id })
            .getOne();

        return res.status(200).send(patient);
    };

    static setActivePatient = async (req: Request, res: Response) => {
        let patient = await Patient.findOne(req.params.id);
        if (!patient) return res.status(400).send({ message: "User Not Found." });
        patient.isActive === Constant.ONE ? patient.isActive = Constant.ZERO : patient.isActive = Constant.ONE;
        patient.modifiedAt = (new Date());

        await Patient.save(patient);

        return res.status(200).send({ message: "Set Active User Successfully !" });
    };

    static updatePatient = async (req: Request, res: Response) => {
        let patient = await Patient.findOne(req.body.id);

        if (!patient) return res.status(400).send({ message: 'User not existed.' });

        patient.isActive = req.body.isActive ? req.body.isActive : patient.isActive;
        patient.modifiedAt = (new Date());
        await Patient.save(patient);

        let infor = UserService.updateUser(req, res, patient.userId);
        if (!infor) return res.status(400).send({ message: 'User not existed.' });

        return res.status(200).send({ message: "Update User Successfully !" });
    }

    static deletePatient = async (req: Request, res: Response) => {
        const patient = await Patient.findOne(req.params.id);
        if (!patient) return res.status(400).send({ message: "User Not Found." });

        await Patient.delete(patient.id);
        await User.delete(patient.userId);

        return res.status(200).send({ message: "Delete User Successfully !" });
    };

};

export default PatientService;
