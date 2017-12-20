let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: String,
  password: String,
  friends: Array,
  requested_friends: Array
});

userSchema.pre('save', function(next) {
  //sort arrays
  next();
});

let roomSchema = new mongoose.Schema({
  name: String,
  owner: Object,
  picture: String,
  participants: Array,
  ready: Boolean,
  pieces: Array
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Room: mongoose.model('Room', roomSchema)
};
