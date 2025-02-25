import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Staff from "../models/staff.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/genrateTokenAndSetCoookie.js";
import { sendStaffLoginInfo } from "../nodemail/emails.js";

export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists.",
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the admin in DB
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Generate JWT
    //    - Payload can include user ID and any other relevant info
    // Once you have the user (e.g., newAdmin):
    const payload = { adminId: newAdmin._id };
    const token = generateTokenAndSetCookie(res, payload);

    // 7. Return a success response
    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
      token, // you can choose whether to return token in JSON
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // 2. Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate JWT & set cookie
    const payload = { adminId: admin._id };
    const token = generateTokenAndSetCookie(res, payload);

    // 5. Return success response
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token, // Optionally include token in JSON
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const adminLogout = async (req, res) => {
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

export const checkAdminAuth = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).populate({
      path: "departments",
      populate: {
        path: "staffs",
        // populate: {
        //   path: "patients",
        // },
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin found successfully.",
      admin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const { adminId } = req.params;

    // 1. Basic validation
    if (!name || name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 3 characters long",
      });
    }
    // const objectAdminId = mongoose.Types.ObjectId(adminId);
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const newDepartment = await Department.create({ name });
    admin.departments.push(newDepartment._id);
    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { adminId, departmentId } = req.params;

    // 1. Basic validation
    if (!name || !email || !adminId || !departmentId) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, adminId, and departmentId.",
      });
    }

    // 2. Check if Staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "This staff already exists.",
      });
    }

    // 3. Validate adminId and departmentId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid adminId.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid departmentId.",
      });
    }
    // 7. Link Staff to the Department
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    // 6. Link Staff to the Admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // 4. Generate a unique loginId (8 random bytes in hex format)
    const loginId = crypto.randomBytes(3).toString("hex");

    // 5. Create the new Staff
    const newStaff = await Staff.create({
      name,
      email,
      loginId,
      departmentId, // references the Department
    });

    admin.staffs.push(newStaff._id);
    await admin.save();

    department.staffs.push(newStaff._id);
    await department.save();

    // Send Email
    const mailInfo = {
      name: name,
      email: email,
      departmentName: department.name,
      loginId: newStaff.loginId,
    };
    sendStaffLoginInfo(email, mailInfo);

    // 8. Return success response
    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staff: newStaff,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
