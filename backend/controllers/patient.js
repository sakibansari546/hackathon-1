import Patient from "../models/paitent.js";
import { generateTokenAndSetCookie } from "../utils/genrateTokenAndSetCoookie.js";

export const patientLogin = async (req, res) => {
  try {
    const { email, loginId } = req.body;
    if (!email || !loginId) {
      return res.status(400).json({
        success: false,
        message: "Email and LoginId are required!",
      });
    }

    const existPatient = await Patient.findOne({ email });
    if (!existPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient is not in the database!",
      });
    }

    if (existPatient.loginId !== loginId) {
      return res.status(400).json({
        success: false,
        message: "Login id is incorrect!",
      });
    }

    // Generate a token with patientId in the payload
    const payload = { patientId: existPatient._id };
    generateTokenAndSetCookie(res, payload);

    return res.status(200).json({
      success: true,
      message: "Patient logged in successfully!",
      data: existPatient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const checkPatientAuth = async (req, res) => {
  try {
    // Find the patient by ID from the token payload (req.patientId)
    // and populate any referenced fields you want, for example "reports".
    console.log(req.patientId);

    const patient = await Patient.findById(req.patientId).populate("reports");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient found successfully.",
      data: patient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
