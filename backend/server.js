import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

import { connectDB } from "./db/db.js";

// MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);

// ROutes
import adminRoute from "./routes/admin.js";
import staffRoute from "./routes/staff.js";
import patientRoute from "./routes/patient.js";

app.use("/admin", adminRoute);
app.use("/staff", staffRoute);
app.use("/patient", patientRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port : ${PORT}`);
});
