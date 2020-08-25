import { Request, Response } from "express";
import { User } from "../models/user";
import { Admin } from "../models/admin";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import UserService from './user-service';
import { v4 as uuid } from 'uuid';


class AdminService {

    static createAdmin = async (req: Request, res: Response) => {
        let userId = uuid();
        let info = await UserService.createUser(req, res, userId, Constant.ADMIN);
        if (!info) return res.status(400).send({ message: 'User already registered.' });

        let admin = new Admin();
        admin.id = uuid();
        admin.userId = userId;
        admin.isActive = req.body.isActive;
        admin.createdAt = (new Date());
        admin.modifiedAt = (new Date());
        await Admin.save(admin);

        return res.status(200).send({ message: "Create User Successfully!" });
    }

    static getAllAdmin = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let count = await Admin.count();

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";
        if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

        const admin = await getRepository(Admin)
            .createQueryBuilder("admin")
            .select(["admin.id", "admin.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
            .leftJoin("admin.user", "user")
            .orderBy("admin.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();

        if (!admin) return res.status(400).send({ message: "User Not Found." });

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size))
            },
            data: admin
        });
    };

    static getAdminbyId = async (req: Request, res: Response) => {
        const adminId = req.params.id;

        const admin = await getRepository(Admin)
            .createQueryBuilder("admin")
            .select(["admin.id", "admin.isActive", "user.id", "user.fullName", "user.title", "user.gender",
                "user.phoneNumber", "user.dateOfBirth", "user.address", "user.email", "user.username", "user.avatar"])
            .leftJoin("admin.user", "user")
            .where("admin.id = :id", { id: adminId })
            .getOne();
        if (!admin) return res.status(400).send({ message: "User Not Found." });

        return res.status(200).send(admin);
    };

    static setActiveAdmin = async (req: Request, res: Response) => {
        let admin = await Admin.findOne(req.params.id);
        if (!admin) return res.status(400).send({ message: "User Not Found." });

        admin.isActive === Constant.ONE ? admin.isActive = Constant.ZERO : admin.isActive = Constant.ONE;
        admin.modifiedAt = (new Date());
        await Admin.save(admin);

        return res.status(200).send({ message: "Set Active User Successfully !" });
    };

    static updateAdmin = async (req: Request, res: Response) => {
        let admin = await Admin.findOne(req.body.id);

        if (!admin) return res.status(400).send({ message: 'User not existed.' });

        admin.isActive = req.body.isActive ? req.body.isActive : admin.isActive;
        admin.modifiedAt = (new Date());
        await Admin.save(admin);

        let infor = UserService.updateUser(req, res, admin.userId);
        if (!infor) return res.status(400).send({ message: 'User not existed.' });

        return res.status(200).send({ message: "Update User Successfully !" });
    }

    static deleteAdmin = async (req: Request, res: Response) => {
        let admin = await Admin.findOne(req.params.id);
        if (!admin) return res.status(400).send({ message: "User Not Found." });

        await Admin.delete(admin.id);
        await User.delete(admin.userId);

        return res.status(200).send({ message: "Delete User Successfully !" });
    };

};

export default AdminService;
