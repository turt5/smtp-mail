const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

//setup the server with port
const app = express();
const port = 3000;

//use cors middleware
app.use(cors());

//body parser middleware to parse POST request body
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// create a transporter object using SMPTP transport

app.post("/send-email", (req, res) => {
  const { subject, text, from, to, html } = req.body;
  const email = req.headers.email;
  const security = req.headers.security;

  let mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html:html
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: security,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred: ", error.message);

      return res
        .status(500)
        .json({ status: "unsuccessful", error: error.message });
    }

    console.log("Email sent successfully!");

    return res.status(200).json({ status: "successful" });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
