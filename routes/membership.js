const express = require("express");
const router = express.Router();
const db = require("../models/db");
require("dotenv").config();

const SECRET_PASSCODE = "club123"; //

// Show Membership Form
router.get("/", (req, res) => {
    if (!req.user) {
        return res.redirect("/");
    }
    res.render("membership", { user: req.user, error: null });
});

// Handle Membership Form Submission
router.post("/", async (req, res) => {
    if (!req.user) {
        return res.redirect("/");
    }

    const { passcode } = req.body;

    if (passcode === SECRET_PASSCODE) {
        try {
            await db.none("UPDATE users SET membership = true WHERE id = $1", [
                req.user.id,
            ]);
            req.user.membership = true; // Update session data
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.render("membership", {
                user: req.user,
                error: "An error occurred. Please try again.",
            });
        }
    } else {
        res.render("membership", {
            user: req.user,
            error: "Incorrect passcode!",
        });
    }
});

module.exports = router;
