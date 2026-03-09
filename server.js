require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

/* ---------------- ALLOWED ORIGINS ---------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.recyclamine.com",
  "https://recyclamine.vercel.app/"

];

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));



const PORT = process.env.PORT || 6000;



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.post("/api/lead", async (req, res) => {

  const {
    fname,
    lname,
    email,
    orgName,
    country,
    designation,
    phone
  } = req.body;


  if (!fname || !lname || !email || !orgName || !country) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Brochure Download Lead",
    html: `
      <h2>New Lead Capture</h2>

      <p><strong>First Name:</strong> ${fname}</p>
      <p><strong>Last Name:</strong> ${lname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organization:</strong> ${orgName}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Designation:</strong> ${designation || "N/A"}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Email failed"
    });

  }

});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});












  