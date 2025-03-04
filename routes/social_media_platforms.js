const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { jwtDecode } = require("jwt-decode");


const SocialMediaPlatforms = db.social_media_platforms;
const UserSocialLinks = db.user_social_links;
console.log("Available models:", Object.keys(db));

if (!SocialMediaPlatforms) {
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

router.post("/add-platform", verifyToken, async (req, res) => {
  try {
    const platforms = req.body.platforms;

    // Validate input
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide an array of social media platforms"
      });
    }

    // Validate each platform object
    for (const platform of platforms) {
      if (!platform.social_name) {
        return res.status(400).json({
          status: false,
          message: "Social Media Name is required for each platform"
        });
      }
    }

    // Get all social names from request
    const socialNames = platforms.map(platform => platform.social_name.toLowerCase());

    // Check for duplicates within the request array
    if (new Set(socialNames).size !== socialNames.length) {
      return res.status(400).json({
        status: false,
        message: "Duplicate social media names found in request"
      });
    }

    // Check if any platforms already exist in database
    const existingPlatforms = await SocialMediaPlatforms.findAll({
      where: {
        social_name: socialNames
      }
    });

    if (existingPlatforms.length > 0) {
      const existingNames = existingPlatforms.map(platform => platform.social_name);
      return res.status(400).json({
        status: false,
        message: "Some social media platforms already exist",
        existing_platforms: existingNames
      });
    }

    // Prepare data for bulk creation
    const platformsToCreate = platforms.map(platform => ({
      social_name: platform.social_name,
      social_icon: platform.social_icon || "icon",
      social_status: platform.social_status || 1,
      created: new Date(),
      updated: new Date()
    }));

    // Bulk create platforms
    const createdPlatforms = await SocialMediaPlatforms.bulkCreate(platformsToCreate);

    res.json({
      status: true,
      message: "Social Media platforms created successfully",
      data: createdPlatforms
    });

  } catch (error) {
    console.error("Social Media Error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

router.get("/platforms", verifyToken, async (req, res) => {
  try {
    const platforms = await SocialMediaPlatforms.findAll();
    res.json({
      message: "Social Media Platforms Fetched successfully",
      data: platforms,
    });
  } catch (error) {
    console.error("Social Media Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add-social-links", verifyToken, async (req, res) => {
  try {
    const user_id = req.decoded.id;
    const socialLinks = req.body.socialLinks;

    if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide an array of social links" });
    }

    const updatedLinks = [];
    for (const link of socialLinks) {
      const { social_type_id, social_link, user_social_status = 1 } = link;

      if (!social_type_id || !social_link) {
        return res.status(400).json({ error: "Complete All Mandatory Fields" });
      }

      const data = await UserSocialLinks.create({
        social_type_id,
        social_link,
        user_social_status,
      });
      updatedLinks.push(data);
    }

    res.json({
      message: "Social Link saved successfully",
      data: updatedLinks,
    });
  } catch (error) {
    console.error("Social Media Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
