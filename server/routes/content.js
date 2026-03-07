import { Router } from "express";
import Content from "../models/Content.js";

const router = Router();

// GET all content
router.get("/", async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
