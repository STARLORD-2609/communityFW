require("dotenv").config(); // TOP ला ठेव

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();

// IMPORTANT for Render
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ROOT route (VERY IMPORTANT)
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

// Quiz save
app.post("/quiz", async (req, res) => {
    const { name, age, score, awareness_level } = req.body;
    console.log("DATA RECEIVED:", name, age, score);

    try {
        await pool.query(
            "INSERT INTO quiz(name, age, score) VALUES($1, $2, $3)",
            [name, age, score]
        );

        res.json({ message: "Quiz saved successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving quiz" });
    }
});

// Feedback save
app.post("/feedback", async (req, res) => {
    try {
        const { name, rating, message } = req.body;

        await pool.query(
            "INSERT INTO feedback(name, rating, message) VALUES ($1,$2,$3)",
            [name, rating, message]
        );

        res.send("Feedback saved");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving feedback");
    }
});

// Get all quiz data (ADMIN)
app.get("/quiz", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM quiz ORDER BY score DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// START SERVER (IMPORTANT CHANGE)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});