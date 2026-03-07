import express from "express";
import Letter from "../models/Letter.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// DEBUG: Get letter without auth (remove this in production)
router.get("/debug", async (req, res) => {
  try {
    const letter = await Letter.findOne();
    const count = await Letter.countDocuments();
    res.json({
      count,
      letter: letter || "No letter found",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET letter content (protected route)
router.get("/", requireAuth, async (req, res) => {
  try {
    // Get the first (and should be only) letter
    const letter = await Letter.findOne();

    if (!letter) {
      return res.status(404).json({
        message: "No letter found in database. Please seed the letter first.",
      });
    }

    res.json(letter);
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE letter content (protected route - only authenticated users)
router.put("/", requireAuth, async (req, res) => {
  try {
    const { title, greeting, paragraphs, signature } = req.body;

    let letter = await Letter.findOne();

    if (!letter) {
      // Create new letter if doesn't exist
      letter = new Letter({
        title,
        greeting,
        paragraphs,
        signature,
      });
    } else {
      // Update existing letter
      if (title !== undefined) letter.title = title;
      if (greeting !== undefined) letter.greeting = greeting;
      if (paragraphs !== undefined) letter.paragraphs = paragraphs;
      if (signature !== undefined) letter.signature = signature;
    }

    await letter.save();
    res.json(letter);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
