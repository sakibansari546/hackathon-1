import express from "express";
const router = express.Router();

import {
  checkStaffAuth,
  createPatient,
  createPDFReport,
  staffLogin,
  staffLogout,
} from "../controllers/staff.js";
import { authenticateStaff } from "../middlewares/auth-check.js";

router.post("/login", staffLogin);
router.get("/check-auth", authenticateStaff, checkStaffAuth);
router.post("/logout", staffLogout);

router.post(
  "/:staffId/:departmentId/create-patient",
  authenticateStaff,
  createPatient
);

router.post("/:staffId/:patientId/create-pdf-report", createPDFReport);

export default router;
