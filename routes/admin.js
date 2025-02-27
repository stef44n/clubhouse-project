const express = require("express");
const router = express.Router();
const db = require("../models/db");
require("dotenv").config();

router.get("/", (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    if (!req.user.membership) {
        return res.status(403).send("Only members can become admins.");
    }

    res.render("admin", { user: req.user, error: null });
});

router.post("/", async (req, res) => {
    const { passcode } = req.body;
    const ADMIN_PASSCODE = process.env.ADMIN_SECRET;

    if (!req.user) {
        return res.redirect("/login");
    }

    if (!req.user.membership) {
        return res.status(403).send("Only members can become admins.");
    }

    if (passcode === ADMIN_PASSCODE) {
        try {
            await db.none("UPDATE users SET admin = true WHERE id = $1", [
                req.user.id,
            ]);
            req.user.admin = true; // Update req.user to reflect the change
            return res.redirect("/");
        } catch (err) {
            console.error(err);
            return res.render("admin", {
                user: req.user,
                error: "Something went wrong. Please try again.",
            });
        }
    } else {
        return res.render("admin", {
            user: req.user,
            error: "Incorrect passcode. Try again.",
        });
    }
});

module.exports = router;
