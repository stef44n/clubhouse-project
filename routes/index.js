const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");
const db = require("../models/db");
// const passport = require("passport");
require("dotenv").config();

router.get("/", async (req, res) => {
    try {
        // If user is logged in, update session user data
        if (req.session.user) {
            const user = await db.oneOrNone(
                "SELECT * FROM users WHERE id = $1",
                [req.session.user.id]
            );
            req.session.user = user; // Keep session updated
        }

        // Fetch all messages and join with users to get author names
        const messages = await db.manyOrNone(
            `SELECT messages.id, messages.title, messages.text, messages.created_at, 
                    users.first_name, users.last_name, users.membership
             FROM messages 
             JOIN users ON messages.user_id = users.id 
             ORDER BY created_at DESC`
        );

        // Render the homepage with user and messages
        res.render("index", { user: req.user, messages });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.render("index", { user: req.user, messages: [] });
    }
});

module.exports = router;
