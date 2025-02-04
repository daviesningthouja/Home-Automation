const mongoose = require('mongoose');

const relaySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Number, required: true },
  manualControl: { type: Number, default: 0 }, // 0 = Auto, 1 = Manual
});

module.exports = mongoose.model('Relay', relaySchema);
