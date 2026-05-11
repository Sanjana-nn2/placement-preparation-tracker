const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: String,
    targetRole: String,
    status: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);