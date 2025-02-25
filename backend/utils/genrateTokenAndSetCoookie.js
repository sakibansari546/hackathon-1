import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, payload) => {
  // 1. Generate the token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // token valid for 1 day
  });

  // 2. Set the token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use HTTPS in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  // 3. Return the token if you need to use it in the response body
  return token;
};
