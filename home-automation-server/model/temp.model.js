const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
    temperature: { type: Number, required: true }, // Current temperature
    timestamp: { type: Date, default: Date.now },  // Timestamp
  });
  
  module.exports =  mongoose.model("Temperature", temperatureSchema);