import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Staff from "../models/staff.js";
import Patient from "../models/paitent.js";

import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/genrateTokenAndSetCoookie.js";
import { sendPatientLoginInfo } from "../nodemail/emails.js";

export const staffLogin = async (req, res) => {
  try {
    const { email, loginId } = req.body;
    if (!email || !loginId) {
      return res
        .status(400)
        .json({ success: false, message: "Email and LoginId is required!" });
    }

    const existStaff = await Staff.findOne({ email });
    if (!existStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff is not in the database!" });
    }

    if (existStaff.loginId !== loginId) {
      return res
        .status(400)
        .json({ success: false, message: "Login id is incorrect!" });
    }

    const payload = { staffId: existStaff._id };
    generateTokenAndSetCookie(res, payload);

    return res.status(200).json({
      success: true,
      message: "Login success fully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const staffLogout = async (req, res) => {
  try {
    // Clearing the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const checkStaffAuth = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staffId).populate({
      path: "departments",
      path: "patients",
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Satff not found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff found successfully.",
      staff,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { staffId, departmentId } = req.params;

    if (!name || !email || !departmentId || !staffId) {
      return res.status(400).json({
        success: false,
        message: "name and email i required!",
      });
    }

    const existPatient = await Patient.findOne({ email });
    if (existPatient) {
      return res
        .status(401)
        .json({ success: false, message: "This patient is already exist!" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "department is not found!" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "staff is not found!" });
    }

    // 4. Generate a unique loginId (8 random bytes in hex format)
    const loginId = crypto.randomBytes(3).toString("hex");
    console.log(loginId);
    const newPatient = await Patient.create({
      name,
      email,
      loginId,
    });

    department.patients.push(newPatient._id);
    staff.patients.push(newPatient._id);
    Promise.all([department.save(), staff.save()]);

    const info = {
      name: newPatient.name,
      loginId: newPatient.loginId,
    };
    sendPatientLoginInfo(newPatient.email, info);

    return res.status(200).json({
      success: true,
      message: "Patient created success fully!",
      newPatient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
    s;
  }
};
