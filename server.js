require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



const transporter = nodemailer.createTransport({
  service: "gmail",
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


app.listen(process.env.PORT || 6000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});