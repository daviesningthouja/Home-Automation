const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.register = async (req,res) => {
    const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

exports.login = async (req,res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
  
      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ success: true, token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
}