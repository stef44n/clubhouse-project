const express = require("express");
const app = express();
const session = require("express-session");
const methodOverride = require("method-override");
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
    })
);

// Routes (will create later)
app.use("/", require("./routes/index"));

// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
