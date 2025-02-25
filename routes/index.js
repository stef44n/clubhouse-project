const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../models/db");
const passport = require("passport");

router.get("/", async (req, res) => {
    if (req.session.user) {
        const user = await db.oneOrNone("SELECT * FROM users WHERE id = $1", [
            req.session.user.id,
        ]);
        req.session.user = user; // Keep session updated
    }
    res.render("index", { user: req.user });
});

// Signup Page
router.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

// Handle Signup Submission
router.post(
    "/signup",
    [
        body("firstName")
            .trim()
            .notEmpty()
            .withMessage("First name is required"),
        body("lastName").trim().notEmpty().withMessage("Last name is required"),
        body("username").isEmail().withMessage("Valid email is required"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("signup", { errors: errors.array() });
        }

        const { firstName, lastName, username, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.none(
                "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
                [firstName, lastName, username, hashedPassword]
            );

            const newUser = await db.one(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );
            req.session.user = newUser;
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.render("signup", {
                errors: [
                    { msg: "Username already exists or an error occurred" },
                ],
            });
        }
    }
);

const SECRET_PASSCODE = "club123"; //

// Show Membership Form
router.get("/membership", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    res.render("membership", { error: null });
});

// Handle Membership Form Submission
router.post("/membership", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    const { passcode } = req.body;

    if (passcode === SECRET_PASSCODE) {
        try {
            await db.none("UPDATE users SET membership = true WHERE id = $1", [
                req.session.user.id,
            ]);
            req.session.user.membership = true; // Update session data
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.render("membership", {
                error: "An error occurred. Please try again.",
            });
        }
    } else {
        res.render("membership", { error: "Incorrect passcode!" });
    }
});

// Show Login Page
router.get("/login", (req, res) => {
    res.render("login", { messages: req.flash() });
});

// Handle Login Submission
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            // console.log("User logged in, session:", req.session); // Debugging session data
            return res.redirect("/");
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
