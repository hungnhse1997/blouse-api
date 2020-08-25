import { Request, Response } from "express";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import UserService from './user-service';
import { v4 as uuid } from 'uuid';


class StaffService {

    static createStaff = async (req: Request, res: Response) => {
        let userId = uuid();
        let info = await UserService.createUser(req, res, userId, Constant.STAFF);
        if (!info) return res.status(400).send({ message: 'User already registered.' });

        let staff = new Staff();
        staff.id = uuid();
        staff.userId = userId;
        staff.hospitalId = req.body.hospital;
        staff.isActive = req.body.isActive;
        staff.createdAt = (new Date());
        staff.modifiedAt = (new Date());
        await Staff.save(staff);

        return res.status(200).send({ message: "Create User Successfully!" });
    }

    static getAllStaff = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let count = await Staff.count();

        if (count == 0) return res.status(400).send({ message: "User Not Found." });

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";
        if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size)) || 1).toString();

        const staff = await getRepository(Staff)
            .createQueryBuilder("staff")
            .select([
                "staff.id",
                "staff.isActive",
                "staff.hospitalId",
                "hospital.name",
                "user.id",
                "user.fullName",
                "user.title",
                "user.gender",
                "user.phoneNumber",
                "user.dateOfBirth",
                "user.address",
                "user.email",
                "user.username",
                "user.avatar"
            ])
            .leftJoin("staff.user", "user")
            .leftJoin("staff.hospital", "hospital")
            .orderBy("staff.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size))
            },
            data: staff
        });
    };

    static searchStaff = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let hospitalId = req.query.HospitalId;
        let count, staff;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        if (hospitalId) {
            if (!txtSearch) {
                count = await Staff.count({where : {hospitalId: hospitalId}});

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                staff = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .select(["staff.id", "staff.isActive", "hospital.name", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("staff.user", "user")
                    .leftJoin("staff.hospital", "hospital")
                    .where(`staff.hospitalId = '%${hospitalId}%'`)
                    .orderBy("staff.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            } else {
                count = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .leftJoin("staff.user", "user")
                    .where(`staff.hospitalId = '%${hospitalId}%'`)
                    .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                staff = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .select(["staff.id", "staff.isActive", "hospital.name", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("staff.user", "user")
                    .leftJoin("staff.hospital", "hospital")
                    .where(`staff.hospitalId = '%${hospitalId}%'`)
                    .andWhere(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .orderBy("staff.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            }
        }
        else {
            if (!txtSearch) {
                count = await Staff.count();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                staff = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .select(["staff.id", "staff.isActive", "hospital.name", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("staff.user", "user")
                    .leftJoin("staff.hospital", "hospital")
                    .orderBy("staff.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            } else {
                count = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .leftJoin("staff.user", "user")
                    .where(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .getCount();

                if (count == 0) return res.status(400).send({ message: "User Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                staff = await getRepository(Staff)
                    .createQueryBuilder("staff")
                    .select(["staff.id", "staff.isActive", "hospital.name", "user.id", "user.fullName", "user.title", "user.gender",
                        "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
                    .leftJoin("staff.user", "user")
                    .leftJoin("staff.hospital", "hospital")
                    .where(`(user.fullName like '%${txtSearch}%' OR user.phoneNumber like '%${txtSearch}%' OR user.email like '%${txtSearch}%' OR user.username like '%${txtSearch}%')`)
                    .orderBy("staff.id")
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
            data: staff
        });

    }

    static getStaffbyId = async (req: Request, res: Response) => {
        const staffId = req.params.id;

        const staff = await getRepository(Staff)
            .createQueryBuilder("staff")
            .select(["staff.id", "staff.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
            .leftJoin("staff.user", "user")
            .where("staff.id = :id", { id: staffId })
            .getOne();
        if (!staff) return res.status(400).send({ message: "User Not Found." });

        return res.status(200).send(staff);
    };

    static setActiveStaff = async (req: Request, res: Response) => {
        let staff = await Staff.findOne(req.params.id);
        if (!staff) return res.status(400).send("User Not Found.");

        staff.isActive === Constant.ONE ? staff.isActive = Constant.ZERO : staff.isActive = Constant.ONE;
        staff.modifiedAt = (new Date());
        await Staff.save(staff);

        return res.status(200).send({ message: "Set Active User Successfully !" });
    };

    static updateStaff = async (req: Request, res: Response) => {
        console.log(req.body);
        let staff = await Staff.findOne(req.params.id);

        if (!staff) return res.status(400).send({ message: 'User not existed.' });

        staff.hospitalId = req.body.hospital ? req.body.hospital : staff.hospitalId;
        staff.isActive = req.body.isActive ? req.body.isActive : staff.isActive;
        staff.modifiedAt = (new Date());
        await Staff.save(staff);

        let infor = UserService.updateUser(req, res, staff.userId);
        if (!infor) return res.status(400).send({ message: 'User not existed.' });

        return res.status(200).send({ message: "Update User Successfully !" });
    }


    static deleteStaff = async (req: Request, res: Response) => {
        const staff = await Staff.findOne(req.params.id);
        if (!staff) return res.status(400).send({ message: "User Not Found." });

        await Staff.delete(staff.id);
        await User.delete(staff.userId);

        return res.status(200).send({ message: "Delete User Successfully !" });
    };

};

export default StaffService;
