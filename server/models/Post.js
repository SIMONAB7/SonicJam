const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  link: { type: String, required: true },
  platform: { type: String },
  description: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true }, 
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);
