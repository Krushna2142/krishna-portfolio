// testMail.js
import nodemailer from "nodemailer";

async function testMail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krushnapokharkar4@gmail.com",
        pass: "brzcgouhaeqaezzn", // <-- your real Gmail App Password
      },
    });

    const success = await transporter.verify();
    console.log("✅ Transporter verified:", success);
  } catch (err) {
    console.error("❌ Failed:", err);
  }
}

testMail();
