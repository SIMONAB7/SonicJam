const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  link: { type: String, required: true },
  platform: { type: String },
  description: { type: String }, // ✅ ADD THIS LINE
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
