import { Router } from "express";
import AuthController from "../services/auth-service";
const passport = require("passport");

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Login with google
router.get("/google", passport.authenticate('google', {
    scope: ['openid','profile', 'email']
}));
// Callback
router.get("/google/callback", passport.authenticate('google'), AuthController.loginWithGoogle);

//oauth google
router.post("/oauth/google", AuthController.oauthGoogle);

export default router;