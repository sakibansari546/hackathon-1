import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

import { connectDB } from "./db/db.js";

app.get("/test", (req, res) => {
  res.json({ success: true, meggase: "Testing" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port : ${PORT}`);
});
