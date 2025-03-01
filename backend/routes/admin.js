import { Router } from "express";
const router = Router();

import {
  adminLogin,
  adminLogout,
  adminSignup,
  checkAdminAuth,
  createDepartment,
  createStaff,
} from "../controllers/admin.js";
import { authenticateAdmin } from "../middlewares/auth-check.js";

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

router.get("/check-auth", authenticateAdmin, checkAdminAuth);

router.post("/:adminId/create-department", authenticateAdmin, createDepartment);

router.post(
  "/:adminId/:departmentId/create-staff",
  authenticateAdmin,
  createStaff
);

export default router;
