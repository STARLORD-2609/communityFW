require("dotenv").config();   // ✅ MUST BE TOP

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // bodyParser नको, express मध्ये already आहे

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
    res.send("Server is working");
});

// -------------------- SAVE QUIZ --------------------
app.post("/quiz", async (req, res) => {
    const { name, age, score } = req.body;

    console.log("DATA RECEIVED:", name, age, score);

    // 🔒 basic validation
    if (!name || !age || score === undefined) {
        return res.status(400).json({ error: "Missing data" });
    }

    try {
        await pool.query(
            "INSERT INTO quiz(name, age, score) VALUES($1, $2, $3)",
            [name, age, score]
        );

        res.json({ message: "Quiz saved successfully" });

    } catch (err) {
        console.error("DB ERROR:", err.message);
        res.status(500).json({ error: "Error saving quiz" });
    }
});

// -------------------- GET QUIZ (ADMIN) --------------------
app.get("/quiz", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM quiz ORDER BY score DESC"
        );

        res.json(result.rows);

    } catch (err) {
        console.error("FETCH ERROR:", err.message);
        res.status(500).json({ error: "Error fetching data" });
    }
});

// -------------------- SAVE FEEDBACK --------------------
app.post("/feedback", async (req, res) => {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
        return res.status(400).json({ error: "Missing feedback data" });
    }

    try {
        await pool.query(
            "INSERT INTO feedback(name, rating, message) VALUES ($1,$2,$3)",
            [name, rating, message]
        );

        res.json({ message: "Feedback saved successfully" });

    } catch (err) {
        console.error("FEEDBACK ERROR:", err.message);
        res.status(500).json({ error: "Error saving feedback" });
    }
});

// -------------------- SERVER START --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});