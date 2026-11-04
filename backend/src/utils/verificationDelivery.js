import nodemailer from "nodemailer";

const createEmailTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const normalizePhone = (phone) => phone.replace(/[^0-9]/g, "").replace(/^0/, "91");

export const sendVerificationCodes = async ({ email, phone, emailCode, phoneCode }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (process.env.NODE_ENV !== "production" && !process.env.MSG91_AUTH_KEY && !process.env.MSG91_TEMPLATE_ID) {
      console.log(`[verification] ${email}: email code ${emailCode}; phone ${phone}: phone code ${phoneCode}`);
      return { mode: "demo", emailCode, phoneCode };
    }
    throw new Error("Email verification is not configured. Add SMTP settings to the backend .env file.");
  }
  if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) {
    throw new Error("Phone verification is not configured. Add MSG91 settings to the backend .env file.");
  }

  await createEmailTransport().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Bikes Rental Service verification code",
    text: `Your Bikes Rental Service email verification code is ${emailCode}. It expires in 10 minutes.`,
  });

  const response = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_id: process.env.MSG91_TEMPLATE_ID,
      mobile: normalizePhone(phone),
      otp: phoneCode,
    }),
  });

  if (!response.ok) throw new Error("MSG91 could not send the phone verification code.");

  return { mode: "live", emailCode, phoneCode };
};
