const mongoose = require("mongoose");

const ButtonStateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Button name
  state: { type: Number, default: 0 },   // 0 = OFF, 1 = ON
});

module.exports = mongoose.model("ButtonState", ButtonStateSchema);
