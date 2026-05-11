const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    content: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);