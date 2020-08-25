import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import { User } from "../models/user";
import { Admin } from "../models/admin";
import { Staff } from "../models/staff";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import { use } from "passport";
import { Contains } from "class-validator";
import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";

class AppointmentService {

    static getAllAppointment = async (req: Request, res: Response) => {
        let count, appointment;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            count = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .getCount();

            if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            appointment = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                    "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .orderBy("appointment.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();
        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });

            count = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.department", "department")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            appointment = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                    "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.department", "department")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .orderBy("appointment.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        }
        else if (user.role === Constant.DOCTOR) {
            let doctor = await Doctor.findOne({ userId: user.id });

            count = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`appointment.doctorId = '${doctor.id}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            appointment = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                    "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`appointment.doctorId = '${doctor.id}'`)
                .orderBy("appointment.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();
        }
        else if (user.role === Constant.PATIENT) {
            let patient = await Patient.findOne(user.id);

            count = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`appointment.patientId = '${patient.id}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            appointment = await getRepository(Appointment)
                .createQueryBuilder("appointment")
                .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                    "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                .leftJoin("appointment.doctor", "doctor")
                .leftJoin("appointment.patient", "patient")
                .leftJoin("doctor.user", "user_doctor")
                .leftJoin("patient.user", "user_patient")
                .where(`appointment.patientId = '${patient.id}'`)
                .orderBy("appointment.id")
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
            data: appointment
        });
    };

    static searchAppointment = async (req: Request, res: Response) => {
        let count, appointment;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let departmentId = req.query.departmentId;
        let hospitalId = req.query.HospitalId;
        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);
        //Admin
        if (user.role === Constant.ADMIN) {
            //search by department
            if (departmentId) {
                if (txtSearch) {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            } else if (hospitalId) {//search by hospital
                if (txtSearch) {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            } else {//search all
                if (txtSearch) {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
        } else if (user.role === Constant.STAFF) {//Staff
            let staff = await Staff.findOne({ where: { userId: user.id } });
            //search by department in hospital of staff
            if (departmentId) {
                if (txtSearch) {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .andWhere(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .andWhere(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
            else { //search in hospital of staff
                if (txtSearch) {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {
                    count = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    appointment = await getRepository(Appointment)
                        .createQueryBuilder("appointment")
                        .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                            "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                        .leftJoin("appointment.doctor", "doctor")
                        .leftJoin("appointment.patient", "patient")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("doctor.user", "user_doctor")
                        .leftJoin("patient.user", "user_patient")
                        .where(`department.id = '${departmentId}'`)
                        .orderBy("appointment.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }

        } else if (user.role === Constant.DOCTOR) {//Doctor
            let doctor = await Doctor.findOne({ userId: user.id });
            //Search by doctor id
            if (txtSearch) {
                count = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.doctorId = '${doctor.id}'`)
                    .andWhere(`(appointment.place like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                appointment = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                        "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.doctorId = '${doctor.id}'`)
                    .andWhere(`(appointment.place like '%${txtSearch}%' OR user_patient.fullName like '%${txtSearch}%' 
                            OR user_patient.phoneNumber like '%${txtSearch}%' OR user_patient.email like '%${txtSearch}%' 
                            OR user_patient.username like '%${txtSearch}%')`)
                    .orderBy("appointment.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            } else {
                count = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.doctorId = '${doctor.id}'`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                appointment = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                        "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.doctorId = '${doctor.id}'`)
                    .orderBy("appointment.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();

            }

        } else if (user.role === Constant.PATIENT) {//Patient
            let patient = await Patient.findOne({ userId: user.id });
            //Search by Patient id
            if (txtSearch) {
                count = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.patientId = '${patient.id}'`)
                    .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                appointment = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                        "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.patientId = '${patient.id}'`)
                    .andWhere(`(appointment.place like '%${txtSearch}%' OR user_doctor.fullName like '%${txtSearch}%' 
                            OR user_doctor.phoneNumber like '%${txtSearch}%' OR user_doctor.email like '%${txtSearch}%' 
                            OR user_doctor.username like '%${txtSearch}%')`)
                    .orderBy("appointment.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            } else {
                count = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.patientId = '${patient.id}'`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "Appointment Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                appointment = await getRepository(Appointment)
                    .createQueryBuilder("appointment")
                    .select(["appointment.id", "appointment.appointmentTime", "appointment.place", "appointment.status",
                        "appointment.isActive", "doctor.id", "user_doctor.fullName", "patient.id", "user_patient.fullName"])
                    .leftJoin("appointment.doctor", "doctor")
                    .leftJoin("appointment.patient", "patient")
                    .leftJoin("doctor.user", "user_doctor")
                    .leftJoin("patient.user", "user_patient")
                    .where(`appointment.patientId = '${patient.id}'`)
                    .orderBy("appointment.id")
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
            data: appointment
        });
    };

    static createAppointment = async (req: Request, res: Response) => {
        let appointment = new Appointment();
        appointment.medicalExaminationId = req.body.medicalExaminationId;
        appointment.appointmentTime = req.body.appointmentTime;
        appointment.place = req.body.place;
        appointment.status = Constant.ZERO;
        appointment.isActive = Constant.ONE;
        appointment.patientId = req.body.patientId;
        appointment.doctorId = req.body.doctorId;
        appointment.createdAt = (new Date());
        appointment.modifiedAt = (new Date());

        await Appointment.save(appointment);

        return res.status(200).send({ message: 'Create Appointment Successfully!' });
    }
    static registerAppointment = async (req: Request, res: Response, medicalExaminationId: number, patientId) => {
        let appointment = new Appointment();
        appointment.medicalExaminationId = medicalExaminationId;
        appointment.patientId = patientId;
        appointment.doctorId = req.body.doctorId;
        appointment.appointmentTime = req.body.appointmentTime;
        appointment.status = Constant.ZERO;
        appointment.isActive = Constant.ONE;
        appointment.createdAt = (new Date());
        appointment.modifiedAt = (new Date());

        await Appointment.save(appointment);
        return true;
    }

    static updateAppointment = async (req: Request, res: Response) => {
        let appointment = await Appointment.findOne({ id: req.body.id });
        if (!appointment) return res.status(400).send({ message: 'Appointment not existed.' });

        appointment.appointmentTime = req.body.appointmentTime ? req.body.appointmentTime : appointment.appointmentTime;
        appointment.place = req.body.place ? req.body.place : appointment.place;
        appointment.status = req.body.status ? req.body.status : appointment.status;
        appointment.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : appointment.isActive;
        appointment.modifiedAt = (new Date());

        await Appointment.save(appointment);

        return res.status(200).send({ message: "Update Appointment Successfully !" });
    }

    static getAppointmentById = async (req: Request, res: Response) => {
        let appointment = await Appointment.findOne(req.params.id);

        if (!appointment) return res.status(400).send({ message: 'Appointment not existed.' });

        return res.status(200).send(appointment);
    };

    static setActiveAppointment = async (req: Request, res: Response) => {
        let appointment = await Appointment.findOne(req.params.id);

        if (!appointment) return res.status(400).send({ message: "Appointment Not Found." });

        appointment.isActive === Constant.ONE ? appointment.isActive = Constant.ZERO : appointment.isActive = Constant.ONE;
        appointment.modifiedAt = (new Date());
        await Appointment.save(appointment);

        return res.status(200).send({ message: "Set Active Appointment Successfully !" });
    };

    static deleteAppointment = async (req: Request, res: Response) => {
        //TODO

    }

}

export default AppointmentService;