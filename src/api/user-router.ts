import { Router } from "express";
import UserService from "../services/user-service";
import Common from "../utils/common";
import { AuthToken } from "../middleware/auth-token";

const router = Router();
//verify user
router.get("/verify-user/:id", UserService.verifyUser);
//upload avatar
router.post("/upload-avatar", AuthToken, Common.upload.single('avatar'), UserService.uploadAvatar);

export default router;