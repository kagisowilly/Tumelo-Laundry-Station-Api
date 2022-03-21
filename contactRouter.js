const express = require("express");
const nodemailer = require("nodemailer");
const app = express.Router();
require("dotenv").config();

app.get("/", (req, res) => res.send("contact using"));

app.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  var transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    // secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  var mailOptions = {
    from: `${email}`,
    to: `${process.env.EMAIL}`,
    subject: `${subject}`,
    text: `${name} has messaged you saying: ${message} email: ${email}
    `,
  };

  transporter.verify((error, success) => {
    if (error) {
      console.log(error)
    }
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

      res.status(400).send({ msg: "Your email could not be sent" + error });
    } else {cont-content
      console.log("Email sent: " + info.response);

      res.send({ msg: "Message sent successfully" });
    }
  });
});

module.exports = app;