import dotenv from "dotenv";
dotenv.config();
// middlewares/auth.js
import jwt from "jsonwebtoken";

export const authenticateAdmin = (req, res, next) => {
  try {
    // 1. Check if the token exists in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found. Authorization denied.",
      });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the admin ID from the token payload to req
    req.adminId = decoded.adminId;

    // 4. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Authorization denied.",
    });
  }
};

export const authenticateStaff = (req, res, next) => {
  try {
    // 1. Check if the token exists in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found. Authorization denied.",
      });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the admin ID from the token payload to req
    req.staffId = decoded.staffId;

    // 4. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Authorization denied.",
    });
  }
};


export const authenticatePatient = (req, res, next) => {
  try {
    // 1) Check if the token exists in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found. Authorization denied.",
      });
    }

    // 2) Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Attach the patient ID from the token payload to req
    req.patientId = decoded.patientId;

    // 4) Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Authorization denied.",
    });
  }
};
