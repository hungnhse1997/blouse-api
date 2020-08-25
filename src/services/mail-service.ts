import nodemailer from 'nodemailer';
import { Request, Response } from "express";

class MailService {
    static sendEmail = async (req: Request, res: Response, token: string) => {
        let transporter = nodemailer.createTransport('smtps://' + process.env.USER_EMAIL + '%40gmail.com:' + process.env.PASSWORD_EMAIL + '@smtp.gmail.com');

        let mailOptions = {
            from: '"Blouse" <blouse-system@gmail.com>',
            to: req.body.email,
            subject: "[Blouse] Email xác thực thông tin tài khoản người dùng " + req.body.username,
            text: "",
            html: `
            <div style="background:#f3f3f3;color:#444;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;min-height:100%!important;line-height:1.5em;margin:0;padding:0;width:100%!important" bgcolor="#f3f3f3"><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>

                        <tr>
                            <td align="center" bgcolor="#f3f3f3">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;padding:0px 10px">
                                    <tbody>
                                        <tr>
                                            <td style="padding:20px;border-bottom:2px solid #dddddd" bgcolor="#ffffff">
                                                <p>Xin chào <strong>${req.body.username}</strong>,</p>
                                                <p>Cảm ơn bạn đã đăng ký tài khoản trên <span class="il">Blouse</span>.xxx. Để có được trải nghiệm dịch vụ và được hỗ trợ tốt nhất, bạn cần hoàn thiện xác thực tài khoản.</p>
                                                <p>Vui lòng bấm nút Xác thực để hoàn tất quá trình này</p>
                                                <p style="text-align:center">
                                                    <a href="${process.env.CLIENT_URL}/user/verify-user/${token}" style="color:#fff;text-decoration:none;display:inline-block;background-color:#0ba25e;padding:12px 20px;font-weight:bold;border-radius:4px" target="_blank" 
                                                    data-saferedirecturl="${process.env.CLIENT_URL}/user/verify-user/${token}"><strong>Xác thực</strong></a>
                                                </p>
                                                <p>Liên hệ với chúng tôi để được hỗ trợ nhiều hơn: <br>
                                                    Hotline: <strong>096 368 1997</strong> <br>
                                                    Email: <strong><a href="mailto:blousesystem@gmail.com" target="_blank">blousesystem@<span class="il">gmail</span>.com</a></strong> <br>
                                                </p>
                                                <p><strong>Trân trọng, <br>
                                                    <span class="il">Blouse</span></strong>
                                                </p>
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;color:#f73d3d;font-size:0.9em;padding-top:10px">
                                                Chú ý: Đây là email tự động từ <span class="il">Blouse</span>.xxx. Vui lòng không trả lời lại email này!
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                    </tbody>
                </table><br>
            </div>`
        };

        // send mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) return false;
            return true;
        });
    }

    static sendEmailPassword = async (req: Request, res: Response, password: string) => {
        let transporter = nodemailer.createTransport('smtps://' + process.env.USER_EMAIL + '%40gmail.com:' + process.env.PASSWORD_EMAIL + '@smtp.gmail.com');

        let mailOptions = {
            from: '"Blouse" <blouse-system@gmail.com>',
            to: req.body.email,
            subject: "[Blouse] Email cung cấp thông tin tài khoản người dùng",
            text: "",
            html: `
            <div style="background:#f3f3f3;color:#444;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;min-height:100%!important;line-height:1.5em;margin:0;padding:0;width:100%!important" bgcolor="#f3f3f3"><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>

                        <tr>
                            <td align="center" bgcolor="#f3f3f3">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;padding:0px 10px">
                                    <tbody>
                                        <tr>
                                            <td style="padding:20px;border-bottom:2px solid #dddddd" bgcolor="#ffffff">
                                                <p>Xin chào <strong>${req.body.fullName}</strong>,</p>
                                                <p>Tin nhắn này là để cung cấp mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào liên kết dưới đây và làm theo hướng dẫn để thay đổi mật khẩu của bạn</p>
                                                <p>Mật Khẩu của bạn là: <strong>${password}</strong></p>
                                                <p>https://blousesystem.com/change-password/</p>
                                                <p>Liên hệ với chúng tôi để được hỗ trợ nhiều hơn: <br>
                                                    Hotline: <strong>096 368 1997</strong> <br>
                                                    Email: <strong><a href="mailto:blousesystem@gmail.com" target="_blank">blousesystem@<span class="il">gmail</span>.com</a></strong> <br>
                                                </p>
                                                <p><strong>Trân trọng, <br>
                                                    <span class="il">Blouse</span></strong>
                                                </p>
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;color:#f73d3d;font-size:0.9em;padding-top:10px">
                                                Chú ý: Đây là email tự động từ <span class="il">Blouse</span>.xxx. Vui lòng không trả lời lại email này!
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                    </tbody>
                </table><br>
            </div>`
        };

        // send mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) return false;
            return true;
        });
    }

    static sendPaymentNotification = async (req: Request, res: Response) => {
        let transporter = nodemailer.createTransport('smtps://' + process.env.USER_EMAIL + '%40gmail.com:' + process.env.PASSWORD_EMAIL + '@smtp.gmail.com');

        let mailOptions = {
            from: '"Blouse" <blouse-system@gmail.com>',
            to: req.body.email,
            subject: "[Blouse] Email xác nhận thanh toán",
            text: "",
            html: `
            <div style="background:#f3f3f3;color:#444;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;min-height:100%!important;line-height:1.5em;margin:0;padding:0;width:100%!important" bgcolor="#f3f3f3"><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>

                        <tr>
                            <td align="center" bgcolor="#f3f3f3">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;padding:0px 10px">
                                    <tbody>
                                        <tr>
                                            <td style="padding:20px;border-bottom:2px solid #dddddd" bgcolor="#ffffff">
                                                <p style="margin: 0 0 15px 0; font-size: 14px; font-family: Helvetica Neue, Arial, sans-serif; color: #3c4043; text-align: left; line-height: 24px;">
                                                    Xin chào <strong>${req.body.username}</strong>,<br />
                                                    Rất cảm ơn bạn đã sử dụng dịch vụ của Ví điện tử MoMo.
                                                </p>
                                                <div style="padding-top: 15px;">
                                                    <p style="margin: 0; font-size: 16px; font-family: Helvetica Neue, Arial, sans-serif; color: #969696; text-align: center;">
                                                        Khoản thanh toán
                                                    </p>
                                                    <p style="margin-top: 10px; font-size: 28px; font-family: Helvetica Neue, Arial, sans-serif; color: #3c4043; text-align: center; font-weight: 500;">
                                                        ${req.body.amount}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p style="margin: 0; font-size: 13px; font-family: Helvetica Neue, Arial, sans-serif; color: #969696; text-align: left; font-weight: bold;">
                                                        CHI TIẾT GIAO DỊCH
                                                    </p>
                                                    <p style="margin-top: 10px; border-top: 1px solid #ececec;"></p>
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Mã giao dịch
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.orderId}
                                                        </p>
                                                    </div>
                                                    
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Số tiền
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.amount}
                                                        </p>
                                                    </div>
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Thông tin đơn hàng
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.orderInfo}
                                                        </p>
                                                    </div>
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Trạng thái
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.localMessage}
                                                        </p>
                                                    </div>
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Thời gian
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.responseTime}
                                                        </p>
                                                    </div>
                                                    <div style="column-count: 2;">                                            
                                                        <p style="text-align: left; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px; padding-right: 10px;">
                                                            Hình thức
                                                        </p>
                                                        <p style="text-align: right; color: #3c4043; margin: 0px; font-size: 12px; line-height: 22px; font-weight: normal; font-size: 15px;">
                                                            ${req.body.payType}
                                                        </p>
                                                    </div>
                                                </div>
                                                <br>
                                                <p>Liên hệ với chúng tôi để được hỗ trợ nhiều hơn: <br>
                                                    Hotline: <strong>096 368 1997</strong> <br>
                                                    Email: <strong><a href="mailto:blousesystem@gmail.com" target="_blank">blousesystem@<span class="il">gmail</span>.com</a></strong> <br>
                                                </p>
                                                <p><strong>Trân trọng, <br>
                                                    <span class="il">Blouse</span></strong>
                                                </p>
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:center;color:#f73d3d;font-size:0.9em;padding-top:10px">
                                                Chú ý: Đây là email tự động từ <span class="il">Blouse</span>.xxx. Vui lòng không trả lời lại email này!
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                    </tbody>
                </table><br>
            </div>`
        }

        // send mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) return false;
            return true;
        });
    }
}

export default MailService;