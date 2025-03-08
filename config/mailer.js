const nodemailer = require('nodemailer');

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

const sendMail = async (firstname, email, message) => {
    const mailOptions = {
        from: {
            name: "Cutting Edge",
            address: process.env.EMAIL,
        },
        to: ["greesegilbertvijay@gmail.com", "info@spincotech.com", "cuttingedge@spincotech.com"],
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

module.exports = { sendMail };
