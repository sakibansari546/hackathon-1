import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Staff from "../models/staff.js";
import Patient from "../models/paitent.js";

import Report from "../models/report.js";
import PDFDocument from "pdfkit";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

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
      data: existStaff,
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
    // 1) Find the staff by ID
    // 2) Populate departments (if staff.departments is an array)
    // 3) Populate patients (if staff.patients is an array)
    // 4) Nested populate each patient's reports
    const staff = await Staff.findById(req.staffId).populate({
      path: "patients",
      populate: {
        path: "reports",
      },
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff found successfully.",
      data: staff,
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
        message: "name, email, departmentId, and staffId are required!",
      });
    }

    const existPatient = await Patient.findOne({ email });
    if (existPatient) {
      return res
        .status(400)
        .json({ success: false, message: "This patient already exists!" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found!" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found!" });
    }

    // Generate a unique loginId
    const loginId = crypto.randomBytes(3).toString("hex");

    // Create new patient
    const newPatient = await Patient.create({
      name,
      email,
      loginId,
    });

    // Link patient to department & staff
    department.patients.push(newPatient._id);
    staff.patients.push(newPatient._id);
    await department.save();
    await staff.save();

    // Optionally send an email with login info
    sendPatientLoginInfo(newPatient.email, {
      name: newPatient.name,
      loginId: newPatient.loginId,
    });

    // Retrieve updated staff with populated patients
    const updatedStaff = await Staff.findById(staffId).populate("patients");

    return res.status(200).json({
      success: true,
      message: "Patient created successfully!",
      data: updatedStaff,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const createPDFReport = async (req, res) => {
  try {
    const { patientId } = req.params; // Only patientId
    const { name, age, sex, medicines } = req.body;

    // 1) Validate patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // 2) Generate PDF in-memory using pdfkit
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      // 3) Upload PDF to Cloudinary
      let uploadResult;
      try {
        uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "pdf_reports",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(pdfData).pipe(uploadStream);
        });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading PDF to Cloudinary",
        });
      }

      // 4) Create new Report doc
      const newReport = await Report.create({
        link: uploadResult.secure_url,
        name: `Report for ${name}`,
        patientId: patient._id,
      });

      // 5) Push the report into patient's "reports"
      patient.reports.push(newReport._id);
      await patient.save();

      // 6) Return the updated patient
      const updatedPatient = await Patient.findById(patientId).populate(
        "reports"
      );

      return res.status(201).json({
        success: true,
        message: "PDF created & uploaded successfully!",
        data: updatedPatient,
      });
    });

    // 7) Fill PDF content
    doc.fontSize(20).text("Medical Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${name}`);
    doc.text(`Age: ${age}`);
    doc.text(`Sex: ${sex}`);
    doc.moveDown();

    doc.text("Medicines:", { underline: true });
    medicines.forEach((m, i) => {
      doc.text(
        `${i + 1}. Name: ${m.medicineName}, Dosage: ${m.dosage}, Instruction: ${
          m.instruction
        }`
      );
    });

    doc.end();
  } catch (error) {
    console.error("createPDFReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
