import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Patient } from "../models/patient";
import { v4 as uuid } from 'uuid';
import { Constant } from "../utils/constant";

class AuthService {
    static login = async (req: Request, res: Response) => {
        let { username, password } = req.body;
        if (!(username && password)) return res.status(400).send("Invalid Username or Password.");

        try {
            const user = await User.findOne({ username: username });

            if (!user) return res.status(400).send("Invalid Username.");

            if (!user.isVerified) return res.status(400).send("Account Is Not Verify.");

            if (user.password !== password) return res.status(400).send("Invalid Password.");

            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
            res.cookie('access_token', token, {
                maxAge: 60 * 60 * 1000,
                // signed: true, 
                // httpOnly: true,     // chỉ có http mới đọc được token
                // secure: true;    //ssl nếu có, nếu chạy localhost thì comment nó lại
            })
            return res
                .status(200)
                .header("Access-Control-Expose-Headers", "access_token")
                .header("access_token", token)
                .send({ message: "Login Successful." });

        } catch (error) {
            return res.status(400).send(error);
        }
    };

    static loginWithGoogle = async (req: Request, res: Response) => {
        let user = <User>req.user;
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        res.cookie('access_token', token, {
            maxAge: 60 * 60 * 1000,
            // signed: true,
            // httpOnly: true,     // chỉ có http mới đọc được token
            // secure: true;    //ssl nếu có, nếu chạy localhost thì comment nó lại
        })
        return res.status(200).send({ message: "Login Successful." });
    };

    static oauthGoogle = async (req: Request, res: Response) => {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Creat new user
            user = new User();
            user.id = uuid();
            user.fullName = req.body.name;
            user.email = req.body.email;
            user.role = Constant.PATIENT;
            user.avatar = process.env.AVATAR_DEFAULT || 'uploads/user/avatar/avatar_default.png'
            user.isVerified = Constant.ONE;
            user.createdAt = (new Date());
            user.modifiedAt = (new Date());

            //Creat new patient
            let patient = new Patient();
            patient.id = uuid();
            patient.userId = user.id;
            patient.isActive = Constant.ONE;
            patient.createdAt = (new Date());
            patient.modifiedAt = (new Date());

            await User.save(user);
            await Patient.save(patient);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        res.cookie('access_token', token, {
            maxAge: 60 * 60 * 1000,
            // signed: true,
            // httpOnly: true,     // chỉ có http mới đọc được token
            // secure: true;    //ssl nếu có, nếu chạy localhost thì comment nó lại
        })
        return res.status(200).send({ message: "Login Successful." });
    };

}
export default AuthService;