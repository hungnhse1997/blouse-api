import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";


export const AuthToken = (req: Request, res: Response, next: NextFunction) => {
    //let token = req.signedCookies.access_token;
    let token = req.cookies.access_token //for unit test
    
    if (!token) return res.status(400).send('Access denied. No token provided.');

    try {
        //Validate the token and get data
        const decoded = <any>jwt.verify(token, process.env.JWT_SECRET || '@Hung123');
        res.locals.jwtPayload = decoded;

        //The token is valid for 1 hour
        //Send a new token on every request
        const { id, role } = decoded;
        const newToken = jwt.sign({ id, role }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });

        res.cookie('access_token', newToken, {
            maxAge: 60 * 60 * 1000,
            // signed: true,
            // httpOnly: true,     // chỉ có http mới đọc được token
            // secure: true;    //ssl nếu có, nếu chạy localhost thì comment nó lại
        })
    } catch (error) {
        res.status(400).send('Invalid token!');
        return;
    }
    next();
};
