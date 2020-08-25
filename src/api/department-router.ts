import { Router } from "express";
import departmentService from "../services/department-service";
import { Constant } from "../utils/constant";
import { AuthToken } from "../middleware/auth-token";
import { checkRole } from "../middleware/check-role";

const router = Router();

//Get all department
router.get("/", departmentService.getAllDepartment);

//Search department
router.get("/search", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.searchDepartment);

//Get one department by ID
router.get("/:id", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.getDepartmentById);

//Get name department by hospital ID
router.get("/department-name-by-hospital/:id", departmentService.getDepartmentNameByHospitalId);

//Get all department by hospital ID
router.get("/department-by-hospital/:id", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.getDepartmentByHospitalId);

//Create new department
router.post("/", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.createDepartment);

//Update new department
router.put("/", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.updateDepartment);

//SetActive department
router.put("/setActive/:id", [AuthToken, checkRole([Constant.ADMIN, Constant.STAFF])], departmentService.setActiveDepartment);

export default router;