import { Request, Response } from "express";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { Doctor } from "../models/doctor";
import { getRepository, getManager } from "typeorm";
import { Constant } from "../utils/constant";
import UserService from './user-service';
import { v4 as uuid } from 'uuid';
import Common from "../utils/common";


class DoctorService {

    static createDoctor = async (req: Request, res: Response) => {
        let userId = uuid();
        let info = await UserService.createUser(req, res, userId, Constant.DOCTOR);
        if (!info) return res.status(400).send({ message: 'User already registered.' });

        let doctor = new Doctor();
        doctor.id = uuid();
        doctor.userId = userId;
        doctor.departmentId = req.body.departmentId;
        doctor.isActive = Constant.ONE;
        doctor.createdAt = (new Date());
        doctor.modifiedAt = (new Date());
        await Doctor.save(doctor);

        return res.status(200).send({ message: "Create User Successfully!" });
    }

    static getAllDoctor = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "50";
        let count, doctor, user;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "50";

        //Get user ID
        let currentUserId = await Common.getCurrentUserId(req, res);
        if (currentUserId !== null) {
            user = await User.findOne(currentUserId);
        }
        if (!user || user.role !== Constant.STAFF) {
            count = await getRepository(Doctor)
                .createQueryBuilder("doctor")
                .leftJoin("doctor.user", "user")
                .leftJoin("doctor.department", "department")
                .leftJoin("department.hospital", "hospital")
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User Not Found." });

            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            doctor = await getRepository(Doctor)
                .createQueryBuilder("doctor")
                .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                    "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                .leftJoin("doctor.user", "user")
                .leftJoin("doctor.department", "department")
                .leftJoin("department.hospital", "hospital")
                .orderBy("doctor.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();
        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });

            count = await getRepository(Doctor)
                .createQueryBuilder("doctor")
                .leftJoin("doctor.user", "user")
                .leftJoin("doctor.department", "department")
                .leftJoin("department.hospital", "hospital")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User Not Found." });

            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            doctor = await getRepository(Doctor)
                .createQueryBuilder("doctor")
                .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                    "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                .leftJoin("doctor.user", "user")
                .leftJoin("doctor.department", "department")
                .leftJoin("department.hospital", "hospital")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .orderBy("doctor.id")
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
            data: doctor
        });
    };

    static getTopThreeDoctor = async (req: Request, res: Response) => {
        let count = await Doctor.count();
        if (count == 0) return res.status(400).send({ message: "User Not Found." });

        let doctor = await getRepository(Doctor)
            .createQueryBuilder("doctor")
            .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
            .leftJoin("doctor.user", "user")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .orderBy("doctor.id")
            .skip(0)
            .take(3)
            .getMany();

        return res.status(200).send(doctor);

    }
    static searchDoctor = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let departmentId = req.query.departmentId;
        let hospitalId = req.query.hospitalId;
        let count, doctor, user;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        //Get user ID
        let currentUserId = await Common.getCurrentUserId(req, res);
        if (currentUserId !== null) {
            user = await User.findOne(currentUserId);
        }
        // search by admin || patient || Guest
        if (!user || user.role !== Constant.STAFF) {
            //search by department
            if (departmentId) {
                // Have txtSearch
                if (txtSearch) {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {// Done Have txtSearch
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`doctor.departmentId = '${departmentId}'`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
            //search by hospital
            else if (hospitalId) {
                //Have txtSearch
                if (txtSearch) {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                } else {// Done have txtSearch
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
            //search all doctor in DB
            else {
                if (txtSearch) {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
                else {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
        }
        // Search by staff
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });
            //search by department
            if (departmentId) {
                // Have txtSearch
                if (txtSearch) {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                }
                else {// Done Have txtSearch
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`doctor.departmentId = '${departmentId}'`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
            //search by hospital of staff
            else {
                if (txtSearch) {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' 
                                OR user.phoneNumber like '%${txtSearch}%' 
                                OR user.email like '%${txtSearch}%' 
                                OR user.username like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                }
                else {
                    count = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "User Not Found." });

                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    doctor = await getRepository(Doctor)
                        .createQueryBuilder("doctor")
                        .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                            "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
                        .leftJoin("doctor.user", "user")
                        .leftJoin("doctor.department", "department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${staff.hospitalId}'`)
                        .orderBy("doctor.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
            }
        }

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size)),
                total_item: count
            },
            data: doctor
        });

    }

    static getDoctorbyId = async (req: Request, res: Response) => {
        const doctorId = req.params.id;

        const doctor = await getRepository(Doctor)
            .createQueryBuilder("doctor")
            .select(["doctor.id", "doctor.departmentId", "doctor.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar", "department.name", "hospital.name"])
            .leftJoin("doctor.user", "user")
            .leftJoin("doctor.department", "department")
            .leftJoin("department.hospital", "hospital")
            .where("doctor.id = :id", { id: doctorId })
            .getOne();
        if (!doctor) return res.status(400).send({ message: "User Not Found." });

        return res.status(200).send(doctor);
    };

    static setActiveDoctor = async (req: Request, res: Response) => {
        let doctor = await Doctor.findOne(req.params.id);

        if (!doctor) return res.status(400).send({ message: "User Not Found." });

        doctor.isActive === Constant.ONE ? doctor.isActive = Constant.ZERO : doctor.isActive = Constant.ONE;
        doctor.modifiedAt = (new Date());
        await Doctor.save(doctor);

        return res.status(200).send({ message: "Set Active User Successfully !" });
    };

    static updateDoctor = async (req: Request, res: Response) => {
        let doctor = await Doctor.findOne(req.body.id);

        if (!doctor) return res.status(400).send({ message: 'User not existed.' });

        doctor.departmentId = req.body.departmentId ? req.body.departmentId : doctor.departmentId;
        doctor.isActive = req.body.isActive ? req.body.isActive : doctor.isActive;
        doctor.modifiedAt = (new Date());
        await Doctor.save(doctor);

        let infor = UserService.updateUser(req, res, doctor.userId);
        if (!infor) return res.status(400).send({ message: 'User not existed.' });

        return res.status(200).send({ message: "Update User Successfully !" });
    }


    static deleteDoctor = async (req: Request, res: Response) => {
        const doctor = await Doctor.findOne(req.params.id);
        if (!doctor) return res.status(400).send({ message: "User Not Found." });

        await Doctor.delete(doctor.id);
        await User.delete(doctor.userId);

        return res.status(200).send({ message: "Delete User Successfully !" });
    };

};

export default DoctorService;
