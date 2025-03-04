var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const db = require("./models");

// Import Google Auth Config
require("./config/auth");

var app = express();
var port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Session Middleware (Required for Passport)
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
var Users = require("./routes/Users");
var UserSaveProfile = require("./routes/User_Save_Profile");
var SocialMediaPlatforms = require("./routes/social_media_platforms");
var authRoutes = require("./routes/authRoutes"); // Import Auth Routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", Users);
app.use("/saved-profiles", UserSaveProfile);
app.use("/social-media-platforms", SocialMediaPlatforms);
app.use("/auth", authRoutes); // Google Auth Routes

app.listen(port, function () {
  console.log("Server is running on port: " + port);
});