const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const db = require("./models/db");
const app = express();

// Route files
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const membershipRoutes = require("./routes/membership");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");
require("dotenv").config();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Change to true if using HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    // console.log("Session user on each request:", req.user); // Debugging
    res.locals.user = req.user;
    // console.log("res.locals.user:", res.locals.user); // New debug log
    next();
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.oneOrNone(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );

            if (!user) {
                return done(null, false, { message: "No user found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    // console.log("Serializing user:", user); // Debugging output
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone("SELECT * FROM users WHERE id = $1", [
            id,
        ]);
        // console.log("Deserializing user:", user); // Debugging output
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.use("/", indexRoutes); // Homepage, general routes
app.use("/", authRoutes); // Login, signup, logout
app.use("/membership", membershipRoutes);
app.use("/messages", messageRoutes);
app.use("/admin", adminRoutes);

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
