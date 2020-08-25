import { Request, Response } from "express";
import { PaymentHistory } from '../models/payment-history';
import https from 'https';
import crypto from 'crypto';
import config from '../config';

class MomoService {

    static getMomoPayURL = async (req: Request, res: Response) => {

        const endpoint = config.API_ENDPOINT;
        const partnerCode = config.PARTNER_CODE;
        const accessKey = config.ACCESS_KEY;
        const serectkey = config.SECRET_KEY;
    
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
        const signature = crypto.createHmac('sha256', serectkey)
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
            // console.log(`Status: ${res.statusCode}`);
            // console.log(`Headers: ${JSON.stringify(response.headers)}`);
            response.setEncoding('utf8');
            response.on('data', async (body) => {
            //   console.log('Body');
            //   console.log(body);
            //   console.log('payURL');
            //   console.log(JSON.parse(body).payUrl);
                res.status(200).send(JSON.parse(body));
            });
            response.on('end', () => {
              console.log('No more data in response.');
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
        let payment = await PaymentHistory.findOne(req.body.requestId);
        
        payment.status = req.body.errorCode === 0 ? 1 : 0; //errorCode === 0 ~ success
        // payment.transId = req.body.transId;
        // payment.message = req.body.message;
        payment.modifiedAt = req.body.responseTime;
        await PaymentHistory.save(payment);

        return true;
    }
}

export default MomoService;