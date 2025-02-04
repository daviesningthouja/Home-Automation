const express = require("express");
const router = express.Router();
const ButtonState = require("../model/button.model");

// Fetch all button states
router.get("/", async (req, res) => {
  const states = await ButtonState.find();
  res.json(states);
});

// Update button state
router.post("/update", async (req, res) => {
  const { name, state } = req.body;

  const button = await ButtonState.findOneAndUpdate(
    { name },
    { state },
    { new: true, upsert: true } // Create new if not exists
  );
  console.log(button);
  res.json(button);

});

module.exports = router;
