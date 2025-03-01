import { Router } from "express";
import {
  checkPatientAuth,
  patientLogin,
  patientLogout,
} from "../controllers/patient.js";
import { authenticatePatient } from "../middlewares/auth-check.js";
const router = Router();

router.post("/login", patientLogin);
router.get("/check-auth", authenticatePatient, checkPatientAuth);
router.post("/logout", patientLogout);

export default router;
