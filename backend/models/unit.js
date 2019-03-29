const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  unitName: { type: String, reqtuired: true },
  orientation: { type: String, required: true },
  floor: { type: Number, reqtuired: true },
  bedroom: { type: Number, reqtuired: true },
  washroom: { type: Number, reqtuired: true },
  area: { type: Number, reqtuired: true },
  rent: { type: Number, reqtuired: true },
  imagePath: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: { type: Number, default: 0 }
});

module.exports = mongoose.model('Unit', postSchema);
