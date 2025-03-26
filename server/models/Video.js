const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  artist: String,
  songName: String,
  tuning: String,
  description: String,
  url: String,
  isAnonymous: Boolean,
  type: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //reference to the user that posted the video
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
