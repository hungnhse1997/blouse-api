import { Request, Response } from "express";
import { FavoritedDoctor } from "../models/favorited-doctor";
import { Constant } from "../utils/constant";

class FavoritedDoctorService{
    static getFavoritedDoctorbyPatientId = async (req: Request, res: Response) => {
        let favoritedDoctor = await FavoritedDoctor.find({where: {patientId: req.params.id}});

        if(!favoritedDoctor) return res.status(400).send({ message: "Doctor Not Found." });

        return res.status(200).send(favoritedDoctor);
    }

    static createFavoritedDoctor = async (req: Request, res: Response) => {
        let favoritedDoctor = new FavoritedDoctor();

        favoritedDoctor.patientId = req.body.patientId;
        favoritedDoctor.doctorId = req.body.doctorId;
        favoritedDoctor.isActive = Constant.ONE;
        favoritedDoctor.createdAt = (new Date());
        favoritedDoctor.modifiedAt = (new Date());

        await FavoritedDoctor.save(favoritedDoctor);
        return res.status(200).send({ message: "Create Favorited Doctor Successfully!" });
    }

    static deleteFavoritedDoctor = async (req: Request, res: Response) => {
        const favoritedDoctor = await FavoritedDoctor.findOne(req.params.id);
        if (!favoritedDoctor) return res.status(400).send({ message: "Favorited Doctor Not Found." });

        await FavoritedDoctor.delete(favoritedDoctor.id);

        return res.status(200).send({ message: "Delete Favorited Doctor Successfully !" });
    }

}
export default FavoritedDoctorService;