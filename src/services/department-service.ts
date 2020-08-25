import { Request, Response } from "express";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { Department } from "../models/department";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import Common from "../utils/common";

class DepartmentService {
    static getAllDepartment = async (req: Request, res: Response) => {
        let count, department, user;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        ///Get user ID
        let currentUserId = await Common.getCurrentUserId(req, res);
        if (currentUserId !== null) {
            user = await User.findOne(currentUserId);
        }
        // Role Admin || Patient || Guest
        if (!user || user.role !== Constant.STAFF) {
            count = await Department.count();
            if (count == 0) return res.status(400).send({ message: "Department Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            department = await getRepository(Department)
                .createQueryBuilder("department")
                .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                    "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                .leftJoin("department.hospital", "hospital")
                .orderBy("department.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        }
        // Role Staff
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });

            count = await Department.count({ where: { hospitalId: staff.hospitalId } });
            if (count == 0) return res.status(400).send({ message: "Department Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            department = await getRepository(Department)
                .createQueryBuilder("department")
                .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                    "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                .leftJoin("department.hospital", "hospital")
                .where(`department.hospitalId = '${staff.hospitalId}'`)
                .orderBy("department.id")
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
            data: department
        });
    };

    static searchDepartment = async (req: Request, res: Response) => {
        let count, department;
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let hospitalId = req.query.hospitalId;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        //Get user ID
        let currentUserId = res.locals.jwtPayload.id;
        let user = await User.findOne(currentUserId);

        if (user.role === Constant.ADMIN) {
            if (hospitalId) {
                if (txtSearch) {
                    count = await getRepository(Department)
                        .createQueryBuilder("department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                            OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                        .getCount();

                    if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    department = await getRepository(Department)
                        .createQueryBuilder("department")
                        .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                            "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .andWhere(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                                OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                        .orderBy("department.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }
                else {
                    count = await Department.count({ where: { hospitalId: hospitalId } });
                    if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    department = await getRepository(Department)
                        .createQueryBuilder("department")
                        .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                            "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                        .leftJoin("department.hospital", "hospital")
                        .where(`department.hospitalId = '${hospitalId}'`)
                        .orderBy("department.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
            else {
                if (txtSearch) {
                    count = await getRepository(Department)
                        .createQueryBuilder("department")
                        .leftJoin("department.hospital", "hospital")
                        .where(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                            OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                        .getCount();
                    if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    department = await getRepository(Department)
                        .createQueryBuilder("department")
                        .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                            "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                        .leftJoin("department.hospital", "hospital")
                        .where(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                            OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                        .orderBy("department.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();

                }
                else {
                    count = await Department.count();
                    if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                    if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                    department = await getRepository(Department)
                        .createQueryBuilder("department")
                        .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                            "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                        .leftJoin("department.hospital", "hospital")
                        .orderBy("department.id")
                        .skip((Number(page) - 1) * Number(size))
                        .take(Number(size))
                        .getMany();
                }

            }
        }
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });
            if (txtSearch) {
                count = await getRepository(Department)
                    .createQueryBuilder("department")
                    .leftJoin("department.hospital", "hospital")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .andWhere(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                            OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                    .getCount();
                if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                department = await getRepository(Department)
                    .createQueryBuilder("department")
                    .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                        "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                    .leftJoin("department.hospital", "hospital")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .andWhere(`(department.name like '%${txtSearch}%' OR department.phoneNumber like '%${txtSearch}%' 
                            OR department.website like '%${txtSearch}%' OR department.email like '%${txtSearch}%')`)
                    .orderBy("department.id")
                    .skip((Number(page) - 1) * Number(size))
                    .take(Number(size))
                    .getMany();
            }
            else {
                count = await Department.count({ where: { hospitalId: staff.hospitalId } });
                if (count == 0) return res.status(400).send({ message: "Department Not Found." });
                if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

                department = await getRepository(Department)
                    .createQueryBuilder("department")
                    .select(["department.id", "department.name", "department.address", "department.phoneNumber", "department.website",
                        "department.email", "department.description", "department.isActive", "hospital.id", "hospital.name"])
                    .leftJoin("department.hospital", "hospital")
                    .where(`department.hospitalId = '${staff.hospitalId}'`)
                    .orderBy("department.id")
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
            data: department
        });
    }

    static createDepartment = async (req: Request, res: Response) => {
        let department = await Department.findOne({
            where: [
                { phoneNumber: req.body.phoneNumber },
                { website: req.body.website },
                { email: req.body.email }]
        });
        if (department) return res.status(400).send('Department already existed.');

        department = new Department();
        department.name = req.body.name;
        department.address = req.body.address;
        department.phoneNumber = req.body.phoneNumber;
        department.website = req.body.website;
        department.email = req.body.email;
        department.description = req.body.description;
        department.hospitalId = req.body.hospitalId;
        department.isActive = req.body.isActive;
        department.createdAt = (new Date());
        department.modifiedAt = (new Date());

        Department.save(department);

        return res.status(200).send({ message: 'Create Department Successfully!' });
    }

    static updateDepartment = async (req: Request, res: Response) => {
        let department = await Department.findOne({ id: req.body.id });

        if (!department) return res.status(400).send({ message: 'Department not existed.' });

        department.name = req.body.name ? req.body.name : department.name;
        department.address = req.body.address ? req.body.address : department.address;
        department.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : department.phoneNumber;
        department.website = req.body.website ? req.body.website : department.website;
        department.email = req.body.email ? req.body.email : department.email;
        department.description = req.body.description ? req.body.description : department.description;
        department.hospitalId = req.body.hospitalId ? req.body.hospitalId : department.hospitalId;
        department.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : department.isActive;
        department.modifiedAt = (new Date());

        await Department.save(department);

        return res.status(200).send({ message: "Update Department Successfully !" });
    }

    static getDepartmentById = async (req: Request, res: Response) => {
        let department = await Department.findOne(req.params.id);

        if (!department) return res.status(400).send({ message: 'Department not existed.' });

        return res.status(200).send(department);
    };

    static getDepartmentByHospitalId = async (req: Request, res: Response) => {
        let department = await Department.find({ where: { hospitalId: req.params.id } });

        if (!department) return res.status(400).send({ message: 'Department not existed.' });

        return res.status(200).send(department);
    };

    static getDepartmentNameByHospitalId = async (req: Request, res: Response) => {
        let count = await Department.count({ where: { hospitalId: req.params.id } });

        if (count == 0) return res.status(400).send({ message: 'Department not existed.' });

        let department = await getRepository(Department)
            .createQueryBuilder("department")
            .select(["department.id", "department.name"])
            .where(`department.hospitalId = '${req.params.id}'`)
            .orderBy("department.name")
            .getMany();
        return res.status(200).send(department);
    };

    static setActiveDepartment = async (req: Request, res: Response) => {
        let department = await Department.findOne(req.params.id);
        if (!department) return res.status(400).send("Department Not Found.");

        department.isActive === Constant.ONE ? department.isActive = Constant.ZERO : department.isActive = Constant.ONE;
        department.modifiedAt = (new Date());
        await Department.save(department);

        return res.status(200).send({ message: "Set Active Department Successfully !" });
    };

    static deleteDepartment = async (req: Request, res: Response, userRole: string) => {
        //TODO
    }

}

export default DepartmentService;