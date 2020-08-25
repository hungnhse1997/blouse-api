import { Request, Response } from "express";
import { User } from "../models/user";
import { Staff } from "../models/staff";
import { Hospital } from "../models/hospital";
import { getRepository, getConnection } from "typeorm";
import { Constant } from "../utils/constant";
import Common from "../utils/common";


class HospitalService {

    static getAllHospital = async (req: Request, res: Response) => {
        let count, hospital, user;
        let page = req.query.page || "1";
        let size = req.query.size || "10";

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        //Get user ID
        let currentUserId = await Common.getCurrentUserId(req, res);
        if (currentUserId !== null) {
            user = await User.findOne(currentUserId);
        }
        // Role Admin || Patient || Guest
        if (!user || user.role !== Constant.STAFF) {
            count = await Hospital.count();
            if (count == 0) return res.status(400).send({ message: "Hospital Not Found." });

            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            hospital = await getRepository(Hospital)
                .createQueryBuilder("hospital")
                .orderBy("hospital.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        }
        // Role staff
        else if (user.role === Constant.STAFF) {
            let staff = await Staff.findOne({ where: { userId: user.id } });
            count = await Hospital.count({ where: { id: staff.hospitalId } });
            if (count == 0) return res.status(400).send({ message: "Hospital Not Found." });

            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            hospital = await getRepository(Hospital)
                .createQueryBuilder("hospital")
                .where(`hospital.id = '${staff.hospitalId}'`)
                .orderBy("hospital.id")
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
            data: hospital
        });
    };

    static getNameHospital = async (req: Request, res: Response) => {
        let count = await Hospital.count();
        if (count == 0) return res.status(400).send({ message: "Hospital Not Found." });
        
        let hospital = await getRepository(Hospital)
            .createQueryBuilder("hospital")
            .select(["hospital.id", "hospital.name"])
            .orderBy("hospital.name")
            .getMany();

        return res.status(200).send(hospital);
    };

    static searchHospital = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let txtSearch = req.query.txtSearch;
        let count, hospital;

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";

        if (!txtSearch) {
            count = await Hospital.count();

            if (count == 0) return res.status(400).send({ message: "Hospital Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            hospital = await getRepository(Hospital)
                .createQueryBuilder("hospital")
                .orderBy("hospital.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();

        } else {
            count = hospital = await getRepository(Hospital)
                .createQueryBuilder("hospital")
                .where(`(hospital.name like '%${txtSearch}%' OR hospital.phoneNumber like '%${txtSearch}%' 
                        OR hospital.email like '%${txtSearch}%' OR hospital.website like '%${txtSearch}%')`)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "Hospital Not Found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            hospital = await getRepository(Hospital)
                .createQueryBuilder("hospital")
                .where(`(hospital.name like '%${txtSearch}%' OR hospital.phoneNumber like '%${txtSearch}%' 
                        OR hospital.email like '%${txtSearch}%' OR hospital.website like '%${txtSearch}%')`)
                .orderBy("hospital.id")
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
            data: hospital
        });

    }

    static createHospital = async (req: Request, res: Response) => {
        let hospital = await Hospital.findOne({
            where: [
                { name: req.body.name },
                { phoneNumber: req.body.phoneNumber },
                { website: req.body.website },
                { email: req.body.email }]
        });
        if (hospital) return res.status(400).send('Hospital already existed.');

        hospital = new Hospital();
        hospital.name = req.body.name;
        hospital.address = req.body.address;
        hospital.phoneNumber = req.body.phoneNumber;
        hospital.website = req.body.website;
        hospital.email = req.body.email;
        hospital.establishedDate = req.body.establishedDate;
        hospital.description = req.body.description;
        hospital.logo = req.body.logo;
        hospital.isActive = req.body.isActive;
        hospital.createdAt = (new Date());
        hospital.modifiedAt = (new Date());

        Hospital.save(hospital);

        return res.status(200).send({ message: 'Create hospital Successfully!' });
    }

    static updateHospital = async (req: Request, res: Response) => {
        let hospital = await Hospital.findOne({ id: req.body.id });

        if (!hospital) return res.status(400).send({ message: 'Hospital not existed.' });

        hospital.name = req.body.name ? req.body.name : hospital.name;
        hospital.address = req.body.address ? req.body.address : hospital.address;
        hospital.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : hospital.phoneNumber;
        hospital.website = req.body.website ? req.body.website : hospital.website;
        hospital.email = req.body.email ? req.body.email : hospital.email;
        hospital.establishedDate = req.body.establishedDate ? req.body.establishedDate : hospital.establishedDate;
        hospital.description = req.body.description ? req.body.description : hospital.description;
        hospital.logo = req.body.logo ? req.body.logo : hospital.logo;
        hospital.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : hospital.isActive;
        hospital.modifiedAt = (new Date());

        await Hospital.save(hospital);

        return res.status(200).send({ message: "Update Hospital Successfully !" });
    }

    static getHospitalById = async (req: Request, res: Response) => {
        let hospital = await Hospital.findOne(req.params.id);

        if (!hospital) return res.status(400).send({ message: 'Hospital not existed.' });

        return res.status(200).send(hospital);
    };

    static setActiveHospital = async (req: Request, res: Response) => {
        let hospital = await Hospital.findOne(req.params.id);
        if (!hospital) return res.status(400).send("Hospital Not Found.");

        hospital.isActive === Constant.ONE ? hospital.isActive = Constant.ZERO : hospital.isActive = Constant.ONE;
        hospital.modifiedAt = (new Date());
        await Hospital.save(hospital);

        return res.status(200).send({ message: "Set Active Hospital Successfully !" });
    };

    static deleteHospital = async (req: Request, res: Response, userRole: string) => {
        //TODO

    }

}

export default HospitalService;