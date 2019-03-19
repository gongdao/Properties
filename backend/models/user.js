const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, reqtuired: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 11 }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
