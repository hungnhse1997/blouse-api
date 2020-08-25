import { Request, Response } from "express";
import { Feedback } from "../models/feedback";
import { Constant } from "../utils/constant";
import { getRepository, getManager } from "typeorm";

class FeedbackService {
    static getFeedbackbyDoctorId = async (req: Request, res: Response) => {
        let count = await getRepository(Feedback)
            .createQueryBuilder("feedback")
            .leftJoin("feedback.medicalExamination", "medicalExamination")
            .where(`medicalExamination.doctorId = '${req.params.id}'`)
            .getCount();

        if (count == 0) return res.status(400).send({ message: "Feedback Not Found." });

        let feedback = await getRepository(Feedback)
            .createQueryBuilder("feedback")
            .leftJoin("feedback.medicalExamination", "medicalExamination")
            .where(`medicalExamination.doctorId = '${req.params.id}'`)
            .getMany();


        let oneStar = 0, twoStar = 0, threeStar = 0, fourStar = 0, fiveStar = 0, averageStar = 0;
        for (let value of feedback) {
            if (value.rating === Constant.ONE) oneStar++;
            else if (value.rating === Constant.TWO) twoStar++;
            else if (value.rating === Constant.THREE) threeStar++;
            else if (value.rating === Constant.FOUR) fourStar++;
            else if (value.rating === Constant.FIVE) fiveStar++;
        }

        averageStar = (oneStar * 1 + twoStar * 2 + threeStar * 3 + fourStar * 4 + fiveStar * 5) / count;

        return res.status(200).send({
            oneStar: oneStar,
            twoStar: twoStar,
            threeStar: threeStar,
            fourStar: fourStar,
            fiveStar: fiveStar,
            averageStar: Math.ceil(averageStar * 10) / 10,
            totalRating: count
        });
    }

    static createFeedback = async (req: Request, res: Response) => {
        let feedback = new Feedback();

        feedback.medicalExaminationId = req.body.medicalExaminationId;
        feedback.rating = req.body.rating;
        feedback.isActive = Constant.ONE;
        feedback.createdAt = (new Date());
        feedback.modifiedAt = (new Date());

        await Feedback.save(feedback);
        return res.status(200).send({ message: "Create Feedback Successfully!" });

    }

    static deleteFeedback = async (req: Request, res: Response) => {
        let feedback = await Feedback.findOne(req.params.id);
        if (!feedback) return res.status(400).send({ message: "Feedback Not Found." });

        await Feedback.delete(feedback.id);

        return res.status(200).send({ message: "Delete Feedback Successfully !" });
    }

}
export default FeedbackService;