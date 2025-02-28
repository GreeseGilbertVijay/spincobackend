const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Function to send email
const sendMail = async (firstname, email, message) => {
    const mailOptions = {
        from: {
            name: "Cutting Edge",
            address: process.env.EMAIL,
        },
        to: ["greesegilbertvijay@gmail.com", "info@spincotech.com"],
        subject: "New Mail From Cutting Edge App",
        html: `
            <h2>Cutting Edge App</h2>
            <p>Name: ${firstname} </p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        console.error("Error Sending Email:", error);
        throw error;
    }
};

app.post("/send-email", async (req, res) => {
    try {
        const { firstname, email, message } = req.body;
        
        if (!firstname || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required!" 
            });
        }

        const result = await sendMail(firstname, email, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to send Email" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

