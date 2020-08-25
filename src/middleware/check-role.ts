import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the Profile ID from previous midleware
        const id = res.locals.jwtPayload.id;
        try {
            const user = await User.findOneOrFail(id);
            //Check if array of authorized roles includes the user's role
            if (roles.indexOf(user.role) > -1) next();
            else res.status(400).send("Access Denied !");
        } catch (error) {
            res.status(400).send(error);
        }
    };
};
