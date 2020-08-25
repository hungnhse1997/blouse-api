import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import multer from 'multer';
import { User } from "../models/user";

class Common {
    static getCurrentUserId = (req: Request, res: Response) => {
        //let token = req.signedCookies.access_token;
        let token = req.cookies.access_token //for unit test
        if (!token) return null;
        try {
            const { id } = <any>jwt.verify(token, process.env.JWT_SECRET || '@Hung123');
            return id;
        } catch (error) {
            return null;
        }
    }

    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/user/avatar/');
        },
        filename: (req, file, cb) => {
            cb(null, req.body.id + '.png');
        }
    });

    static upload = multer({ storage: Common.storage});
}

export default Common;