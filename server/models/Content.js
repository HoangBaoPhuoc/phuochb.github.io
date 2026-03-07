import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    // Intro Screen
    intro: {
      title: { type: String, default: "Hi cục cưng của anh!" },
      subtitle: {
        type: String,
        default: "Anh có 1 món quà nhỏ dành cho em nèe!",
      },
      description: {
        type: String,
        default: "Chơi game rùi mới được đọc thư nhaa",
      },
      buttonText: { type: String, default: "Start game" },
    },

    // Game Screen
    game: {
      title: {
        type: String,
        default: "Đố em tìm thấy bông hoa đẹp nhất của HBP!",
      },
      subtitle: {
        type: String,
        default: "Chọn 2 card dúng nhau để mở nha",
      },
      movesLabel: { type: String, default: "Moves:" },
      backButtonText: { type: String, default: "Back" },
    },

    // Victory Screen
    victory: {
      heading: { type: String, default: "Flowers for you" },
      subheading: {
        type: String,
        default: "Bấm vô bức thư để đọc tâm tình",
      },
    },

    // Victory Modal
    victoryModal: {
      title: {
        type: String,
        default: "Ỏ, cục cưng của anh giỏi dữ trờiii!",
      },
      text: {
        type: String,
        default: "Thiệt ra em lúc nào cũng là bông hoa đẹp nhất hết kkk!",
      },
      buttonText: { type: String, default: "Bấm tiếp đi nèe" },
    },
  },
  { timestamps: true },
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
