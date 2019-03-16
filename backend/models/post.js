const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, reqtuired: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
