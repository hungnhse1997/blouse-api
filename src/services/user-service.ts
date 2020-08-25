import config from "../config";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user";
import { Constant } from "../utils/constant";
import MailService from "../services/mail-service";
const generator = require('generate-password');
import Common from "../utils/common";

class UserService {

    static registerUser = async (req: Request, res: Response, userId: string, userRole: string) => {
        let user = await User.findOne({
            where: [
                { username: req.body.username },
                { phoneNumber: req.body.phoneNumber },
                { email: req.body.email }]
        });
        if (user) return false;

        user = new User();
        user.id = userId;
        user.phoneNumber = req.body.phoneNumber;
        user.email = req.body.email;
        user.username = req.body.username;
        user.password = req.body.password;
        user.avatar = process.env.AVATAR_DEFAULT || 'uploads/user/avatar/avatar_default.png'
        user.role = userRole;
        user.isVerified = Constant.ZERO;
        user.createdAt = (new Date());
        user.modifiedAt = (new Date());
        await User.save(user);

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });

        let infor = MailService.sendEmail(req, res, token);
        if (!infor) return false;

        return true;
    };

    static verifyUser = async (req: Request, res: Response) => {
        const token = req.params.id;

        if (!token) return res.status(400).send('Invalid token!');

        try {
            //Validate the token
            const decoded = <any>jwt.verify(token, process.env.JWT_SECRET);
            res.locals.jwtPayload = decoded;

            const { id, role } = decoded;
            const user = await User.findOne(id);
            if (user.isVerified) return res.status(400).send("Account Had Verified.");

            user.isVerified = Constant.ONE;
            user.modifiedAt = (new Date());
            await User.save(user);

            return res.status(200).send({ message: "Verify User Successfully !" });
        } catch (error) {
            return res.status(400).send('Incorrect or expired link');
        }
    };

    static createUser = async (req: Request, res: Response, userId: string, userRole: string) => {
        let user = await User.findOne({
            where: [
                { username: req.body.username },
                { phoneNumber: req.body.phoneNumber },
                { email: req.body.email }]
        });
        if (user) return false;
        // Generate password
        let password = generator.generate({
            length: 8,
            numbers: true
        });

        user = new User();
        user.id = userId;
        user.fullName = req.body.fullName;
        user.title = req.body.title;
        user.gender = req.body.gender;
        user.phoneNumber = req.body.phoneNumber;
        user.dateOfBirth = req.body.dateOfBirth;
        user.address = req.body.address;
        user.email = req.body.email;
        user.username = req.body.username;
        user.password = password;
        user.avatar = process.env.AVATAR_DEFAULT || 'uploads/user/avatar/avatar_default.png'
        user.role = userRole;
        user.isVerified = Constant.ONE;
        user.createdAt = (new Date());
        user.modifiedAt = (new Date());

        await User.save(user);

        let infor = MailService.sendEmailPassword(req, res, password);
        if (!infor) return false;

        return true;
    }

    static updateUser = async (req: Request, res: Response, userId: string) => {
        let user = await User.findOne(userId);
        if (!user) return false;

        user.fullName = req.body.fullName ? req.body.fullName : user.fullName;
        user.title = req.body.title ? req.body.title : user.title;
        user.gender = req.body.gender ? req.body.gender : user.gender;
        user.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : user.phoneNumber;
        user.dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : user.dateOfBirth;
        user.address = req.body.address ? req.body.address : user.address;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? req.body.password : user.password;
        user.modifiedAt = (new Date());
        await User.save(user);

        return true;
    }

    static uploadAvatar = async (req: Request, res: Response) => {
        //Get user ID
        let currentUserId = await Common.getCurrentUserId(req, res);
        let user = await User.findOne({ id: currentUserId });
        let file = req['file'];
        if (!file) return res.status(400).send({ message: 'Images not found.' });

        user.avatar = file.path;
        user.modifiedAt = (new Date());
        await User.save(user);

        return res.status(200).send({ message: "Upload Avatar Successfully !" });
    }

}

export default UserService;