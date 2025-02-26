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

// Middleware to check if user is authenticated and admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.status(403).send("Forbidden: Admins only");
}

// Delete a message (only for admin users)
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        await db.none("DELETE FROM messages WHERE id = $1", [req.params.id]);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).send("Error deleting message");
    }
});

module.exports = router;
