const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testName: String,
    score: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);