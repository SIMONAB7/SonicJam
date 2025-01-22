const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  ratings: Number,
  hits: Number,
  pageType: String,
  difficulty: String,
  key: String,
  capo: String,
  tuning: String,
});

const MusicModel = mongoose.model('Music', MusicSchema);

module.exports = MusicModel;

