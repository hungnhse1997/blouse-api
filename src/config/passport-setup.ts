const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
import { User } from "../models/user"
import { Patient } from "../models/patient";
import { v4 as uuid } from 'uuid';
import { Constant } from "../utils/constant";


passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
    User.findOne(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID_GOOGLE,
        clientSecret: process.env.CLIENT_SECRET_GOOGLE,
        callbackURL: process.env.CALL_BACK_URL_GOOGLE
    },
    async (accessToken: any, refreshToken: any, openid: any, profile: any, done: any) => {
        console.log(openid)
        console.log(profile)
        let user = await User.findOne({ where: { email: profile._json.email } });
        if (user) {
            done(null, user);
        } else {
            // Creat new user
            user = new User();
            user.id = uuid();
            user.fullName = profile._json.name;
            user.email = profile._json.email;
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
            done(null, user);
        }
    }
));
