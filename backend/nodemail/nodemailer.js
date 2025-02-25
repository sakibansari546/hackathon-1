import nodemailer from "nodemailer";

// Create a transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "sakib1335ansari@gmail.com",
      pass: "xxvs kvoc rorv lgje",
    },
  });
};

// Send generic email (common function)
export const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: "sakib1335ansari@gmail.com",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, // for sending HTML formatted emails
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
