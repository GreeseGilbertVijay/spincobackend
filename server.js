const express = require('express');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
const { sendMail } = require('./config/mailer');
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Send Main
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


// Dynamic Content
const contentFilePath = path.join(__dirname, "data", "content.json");

app.get('/paragraph', (req, res) => {
    fs.readFile(contentFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading content.json:", err);
            return res.status(500).json({ error: 'Failed to load data' });
        }
        res.json(JSON.parse(data));
    });
});

//App Update
app.get('/version', (req, res) => {
    fs.readFile('./data/version.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to load version data' });
        res.json(JSON.parse(data));
    });
});

// Path Slider
const sliderFilePath = path.join(__dirname, "data", "slider.json");

// API endpoint to fetch slider data
app.get("/slider", (req, res) => {
  fs.readFile(sliderFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading slider.json:", err);
      return res.status(500).json({ error: "Failed to load slider data" });
    }
    try {
      const sliderData = JSON.parse(data);
      res.json(sliderData);
    } catch (parseError) {
      console.error("Error parsing slider.json:", parseError);
      res.status(500).json({ error: "Invalid JSON format in slider.json" });
    }
  });
});

  // Root route to display "Hello World"
app.get("/", (req, res) => {
    console.log("Server Running Successfully");
    res.send("Server Running Successfully");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;