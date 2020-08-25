import { Router } from "express";
import StaffService from "../services/staff-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all staff
router.get("/", [AuthToken, checkRole([Constant.ADMIN])], StaffService.getAllStaff);

//Search staff
router.get("/search", [AuthToken, checkRole([Constant.ADMIN])], StaffService.searchStaff);

//Get one staff by ID
router.get("/:id", [AuthToken, checkRole([Constant.ADMIN])], StaffService.getStaffbyId);

//Create new staff
router.post("/", [AuthToken, checkRole([Constant.ADMIN])], StaffService.createStaff);

//Update new staff
router.put("/:id", [AuthToken, checkRole([Constant.ADMIN])], StaffService.updateStaff);

//Set active one staff
router.put("/setActive/:id", [AuthToken, checkRole([Constant.ADMIN])], StaffService.setActiveStaff);

//Delete one staff
router.delete("/:id", [AuthToken, checkRole([Constant.ADMIN])], StaffService.deleteStaff);

export default router;