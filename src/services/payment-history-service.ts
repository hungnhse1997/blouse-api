import { MedicalExamination } from './../models/medical-examination';
import { Patient } from './../models/patient';
import { getRepository } from 'typeorm';
import { Request, Response } from "express";
import { PaymentHistory } from "../models/payment-history";
import { Constant } from "../utils/constant";
import config from '../config';
import crypto from 'crypto';
import https from 'https';
import MailService from './mail-service';


class PaymentHistoryService{
    static registerPayment = async (req: Request, res: Response, medicalExaminationId: number, patientId: string) => {
        let payment = new PaymentHistory();

        payment.patientId = patientId;
        payment.medicalExaminationId = medicalExaminationId;
        payment.status = Constant.ZERO;
        payment.isActive = Constant.ONE;
        payment.createdAt = (new Date());
        payment.modifiedAt = (new Date());

        await PaymentHistory.save(payment);
        return true;
    }

    static getAllPayment = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let count = await PaymentHistory.count();

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";
        if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size)) || 1).toString();

        const payments = await getRepository(PaymentHistory)
            .createQueryBuilder("payment")
            .select([
                "payment.id",
                "patient.id",
                "user.fullName",
                "me.id",
                "payment.amount",
                "payment.status",
                "payment.isActive",
                "payment.createdAt",
                "payment.modifiedAt"
            ])
            .leftJoin("payment.patient", "patient")
            .leftJoin("payment.medicalExamination", "me")
            .leftJoin("patient.user", "user")
            .orderBy("payment.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();

        if (!payments) res.status(400).send({ message: "No payments Found." });

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size))
            },
            data: payments
        });
    }

    static searchByPatientName = async (req: Request, res: Response) => {
        let page = req.query.page || "1";
        let size = req.query.size || "10";
        let patientId = req.query.p;
        let txtSearch = req.query.q; //p = patientId, q = searchQuery
        let count, payments: any[];

        if (!Number.isInteger(Number(page)) || Number(page) < 1) page = "1";
        if (!Number.isInteger(Number(size)) || Number(size) < 1) size = "10";
        
        if (txtSearch && !patientId) {
            count = await getRepository(PaymentHistory)
                .createQueryBuilder("payment")
                .leftJoin("payment.patient", "patient")
                .leftJoin("patient.user", "user")
                .where(`
                    user.fullName LIKE '%${txtSearch}%'
                    OR user.phoneNumber LIKE '%${txtSearch}%'
                    OR user.email LIKE '%${txtSearch}%'
                    OR user.username LIKE '%${txtSearch}%'
                `)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User has no payment." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            payments = await getRepository(PaymentHistory)
                .createQueryBuilder("payment")
                .select([
                    "payment.id",
                    "patient.id",
                    "user.fullName",
                    "me.id",
                    "payment.amount",
                    "payment.status",
                    "payment.isActive",
                    "payment.createdAt",
                    "payment.modifiedAt"
                ])
                .leftJoin("payment.patient", "patient")
                .leftJoin("payment.medicalExamination", "me")
                .leftJoin("patient.user", "user")
                .where(`
                    user.fullName LIKE '%${txtSearch}%'
                `)
                .orWhere(`
                    user.phoneNumber LIKE '%${txtSearch}%'
                `)
                .orWhere(`
                    user.email LIKE '%${txtSearch}%'
                `)
                .orWhere(`
                    user.fullName LIKE '%${txtSearch}%'
                `)
                .orderBy("payment.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();
        }
        else if (!txtSearch && patientId) {            
            count = await getRepository(PaymentHistory)
                .createQueryBuilder("payment")
                .leftJoin("payment.patient", "patient")
                .where(`
                    patient.id = '${patientId}'
                `)
                .getCount();

            if (count == 0) return res.status(400).send({ message: "User has no payment." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            payments = await getRepository(PaymentHistory)
                .createQueryBuilder("payment")
                .select([
                    "payment.id",
                    "patient.id",
                    "user.fullName",
                    "me.id",
                    "payment.amount",
                    "payment.status",
                    "payment.isActive",
                    "payment.createdAt",
                    "payment.modifiedAt"
                ])
                .leftJoin("payment.patient", "patient")
                .leftJoin("payment.medicalExamination", "me")
                .leftJoin("patient.user", "user")
                .where(`
                    patient.id = '${patientId}'
                `)
                .orderBy("payment.id")
                .skip((Number(page) - 1) * Number(size))
                .take(Number(size))
                .getMany();
        } else if (!txtSearch && !patientId) {
            count = await PaymentHistory.count();
            
            if (count == 0) return res.status(400).send({ message: "No payment found." });
            if (Number(page) > Math.ceil(count / Number(size))) page = (Math.ceil(count / Number(size))).toString();

            payments = await getRepository(PaymentHistory)
            .createQueryBuilder("payment")
            .select([
                "payment.id",
                "patient.id",
                "user.fullName",
                "me.id",
                "payment.amount",
                "payment.status",
                "payment.isActive",
                "payment.createdAt",
                "payment.modifiedAt"
            ])
            .leftJoin("payment.patient", "patient")
            .leftJoin("payment.medicalExamination", "me")
            .leftJoin("patient.user", "user")
            .orderBy("payment.id")
            .skip((Number(page) - 1) * Number(size))
            .take(Number(size))
            .getMany();
        } else {
            count = 0;
            payments = null;
        }

        if (!payments) return res.status(400).send({ message: "No payments Found." });

        return res.status(200).send({
            page: {
                page_index: Number(page),
                page_size: Number(size),
                total_page: Math.ceil(count / Number(size))
            },
            data: payments
        });
    }

    static getMomoPayURL = async (req: Request, res: Response) => {
        let payment = await PaymentHistory.findOne(req.body.requestId);

        const endpoint = config.API_ENDPOINT;
        const partnerCode = config.PARTNER_CODE;
        const accessKey = config.ACCESS_KEY;
        const secretKey = config.SECRET_KEY;
    
        const orderInfo = req.body.orderInfo;
        const returnUrl = "http://localhost:4200/payment"
        const notifyUrl = "https://webhook.site/9f228634-fe92-46cf-ba2a-f23a226b8abd";
        const amount = req.body.amount;
        const orderId = req.body.orderId;
        const requestId = req.body.requestId;
        const requestType = "captureMoMoWallet";
        const extraData = JSON.stringify(req.body.extraData);
    
        const rawSignature = 
            "partnerCode="+partnerCode+
            "&accessKey="+accessKey+
            "&requestId="+requestId+
            "&amount="+amount+
            "&orderId="+orderId+
            "&orderInfo="+orderInfo+
            "&returnUrl="+returnUrl+
            "&notifyUrl="+notifyUrl+
            "&extraData="+extraData;
        const signature = crypto.createHmac('sha256', secretKey)
                            .update(rawSignature)
                            .digest('hex');        

        const body = JSON.stringify({
            accessKey : accessKey,
            partnerCode : partnerCode,
            requestType : requestType,
            notifyUrl : notifyUrl,
            returnUrl : returnUrl,
            orderId : orderId,
            amount : amount,
            orderInfo : orderInfo,
            requestId : requestId,
            extraData : extraData,
            signature : signature,
        });    
        
        //Create the HTTPS objects
        const options = {
            hostname: config.MOMO_HOSTNAME,
            port: 443,
            path: config.MOMO_PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };    
    
        const request = https.request(options, response => {
            response.setEncoding('utf8');
            response.on('data', async (body) => {
                // payment.orderInfo = orderInfo;
                payment.amount = amount;
                payment.status = Constant.ZERO;
                payment.modifiedAt = (new Date());
                await PaymentHistory.save(payment);

                res.status(200).send(JSON.parse(body));
            });
            response.on('end', () => {
            //   console.log('No more data in response.');
            });
        });
    
        request.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
          
        // write data to request body
        request.write(body);
        request.end();
    }
    
    static catchMomoNotification = async (req: Request, res: Response) => {        
        let payment = await PaymentHistory.findOne(req.body.orderId);
        let examination = await MedicalExamination.findOne(req.body.requestId);
        let mailer;

        if (req.body.errorCode == 0) { //errorCode === 0 ~ success
            payment.status = Constant.TWO;
            payment.purchasedAt = req.body.responseTime;

            examination.status = Constant.TWO;

            mailer = await MailService.sendPaymentNotification(req, res);
        }
        else {
            payment.status = 10000 + parseInt(req.body.errorCode);
            payment.isActive = Constant.ZERO;
        }
        // payment.transId = req.body.transId;
        // payment.message = req.body.message;
        payment.modifiedAt = req.body.responseTime;
        await PaymentHistory.save(payment);
        await MedicalExamination.save(examination);

        let infor = MailService.sendPaymentNotification(req, res);
        if(!infor) return false;
        return true;
    }
}
export default PaymentHistoryService;