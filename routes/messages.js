const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Ensure user is logged in
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

router.get("/new", isAuthenticated, (req, res) => {
    res.render("new_message");
});

router.post("/new", isAuthenticated, async (req, res) => {
    const { title, text } = req.body;
    const userId = req.user.id; // Ensure user ID is from logged-in user
    const created_at = new Date();

    try {
        await db.query(
            "INSERT INTO messages (title, text, created_at, user_id) VALUES ($1, $2, $3, $4)",
            [title, text, created_at, userId]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error inserting message:", err);
        res.status(500).send("Error posting message");
    }
});

module.exports = router;
