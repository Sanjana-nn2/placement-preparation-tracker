const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: String,
    difficulty: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);