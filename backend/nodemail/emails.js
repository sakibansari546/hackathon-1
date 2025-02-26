import { sendEmail } from "./nodemailer.js";

export const sendStaffLoginInfo = (to, info) => {
  sendEmail({
    to: to,
    subject: info.name,
    text: "Added to department",
    html: `Hey! ${info.name} you added on ${info.departmentName} department! 
    Here your loginId to access them
    ${info.loginId}`,
  });
};

export const sendPatientLoginInfo = (to, info) => {
  sendEmail({
    to: to,
    subject: info.name,
    text: "Added to department",
    html: `Hey! ${info.name} you added on department! 
    Here your loginId to access them
    ${info.loginId}`,
  });
};
