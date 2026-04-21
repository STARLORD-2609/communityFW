require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});


// ================= QUIZ SAVE =================
app.post("/quiz", async (req, res) => {
    try {
        const { name, age, score, correct_answers, awareness_level } = req.body;

        // VALIDATION
        if (!name || !age || score === undefined || correct_answers === undefined || !awareness_level) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // 👉 IMPORTANT: same user ची जुनी entry delete (latest ठेवतो)
        await pool.query(
            "DELETE FROM quiz WHERE name = $1 AND age = $2",
            [name, age]
        );

        // 👉 नवीन insert
        await pool.query(
            `INSERT INTO quiz (name, age, score, correct_answers, awareness_level)
             VALUES ($1, $2, $3, $4, $5)`,
            [name, age, score, correct_answers, awareness_level]
        );

        res.json({ message: "Quiz data saved successfully" });

    } catch (err) {
        console.error("Quiz Insert Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// ================= GET QUIZ DATA =================
app.get("/quiz", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT name, age, score, correct_answers, awareness_level 
             FROM quiz
             ORDER BY score DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: "Error fetching data" });
    }
});


// ================= FEEDBACK =================
app.post("/feedback", async (req, res) => {
    try {
        const { name, rating, message } = req.body;

        if (!name || !rating || !message) {
            return res.status(400).json({
                error: "All fields required"
            });
        }

        await pool.query(
            "INSERT INTO feedback(name, rating, message) VALUES ($1,$2,$3)",
            [name, rating, message]
        );

        res.json({ message: "Feedback saved successfully" });

    } catch (err) {
        console.error("Feedback Error:", err);
        res.status(500).json({ error: "Error saving feedback" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});