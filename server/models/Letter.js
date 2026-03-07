import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "My Letter for You",
    },
    greeting: {
      type: String,
      default: "Dear my love,",
    },
    paragraphs: {
      type: [String],
      required: true,
    },
    signature: {
      type: String,
      default: "With all my love,\nYour beloved",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Letter = mongoose.model("Letter", letterSchema);
export default Letter;
