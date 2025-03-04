const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { jwtDecode } = require("jwt-decode");


console.log("Available models:", Object.keys(db));

const User = db.User;
const User_Save_Profile = db.User_Save_Profile; // Make sure this matches the export in your models/index.js

if (!User || !User_Save_Profile) {
  console.error("Required models are not properly initialized!");
  process.exit(1);
}

router.use(cors());

process.env.SECRET_KEY = "secret";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    req.decoded = jwtDecode(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/save-profile", verifyToken, async (req, res) => {
  try {
    const user_id = req.decoded.id;
    const { user_profile_url } = req.body;

    if (!user_profile_url) {
      return res.status(400).json({ error: "Profile ID is required" });
    }

    // Check if profile exists
    const profileExists = await User.findOne({
      where: { user_profile_url },
    });
    if (!profileExists) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Check if already saved
    const existingSave = await User_Save_Profile.findOne({
      where: {
        user_id,
        profile_id:profileExists.id,
      },
    });

    if (existingSave) {
      return res.status(400).json({ error: "Profile already saved" });
    }
    const today = new Date();
    // Save the profile
    const savedProfile = await User_Save_Profile.create({
      user_id,
      profile_id:profileExists.id,
      created: today,
    });

    res.json({
      message: "Profile saved successfully",
      data: savedProfile,
    });
  } catch (error) {
    console.error("Save Profile Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/saved-profiles", verifyToken, async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwtDecode(token);
    const user_id = decoded.id; // Get user ID from token


    const savedProfiles = await User_Save_Profile.findAll({
      where: { user_id: user_id }, // Filter by user_id
      include: [
        {
          model: User,
          as: "profile", // Ensure this matches the alias in `User_Save_Profile.js`
          attributes: ["id", "first_name", "last_name", "email", "profile_image", "website", "user_profile_url"]
        }
      ]
    });

    res.json({
      message: "Saved profiles fetched successfully",
      data: savedProfiles,
    });
  } catch (error) {
    console.error("Error fetching saved profiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/delete-profile/:profileId", verifyToken, async (req, res) => {
  try {
      const authHeader = req.headers["authorization"];
      console.log("Received Authorization Header:", authHeader); // Debugging

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Missing or invalid Authorization header" });
      }

      const token = authHeader.split(" ")[1];
      console.log("Extracted Token:", token); // Debugging

      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // Debugging

      const user_id = decoded.id;
      const { profileId } = req.params;

      const profileIdNum = parseInt(profileId, 10);
      if (isNaN(profileIdNum)) {
          return res.status(400).json({ error: "Invalid profile ID" });
      }

      const savedProfile = await User_Save_Profile.findOne({
          where: { profile_id: profileIdNum, user_id },
      });

      if (!savedProfile) {
          return res.status(404).json({ error: "Profile not found or unauthorized to delete" });
      }

      await savedProfile.destroy();
      res.json({ message: "Saved profile deleted successfully" });

  } catch (error) {
      console.error("Error deleting saved profile:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;
