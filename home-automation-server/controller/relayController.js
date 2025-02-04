const Relay = require('../model/relay.model');
const Temp = require('../model/temp.model')
// GET /api/relays - Fetch all relay states
exports.getRelays = async (req, res) => {
  try {
    const relays = await Relay.find();
    res.status(200).json(relays);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch relay states' });
  }
};

// PUT /api/relays - Update relay states
exports.updateRelays = async (req, res) => {
  try {
    const updates = req.body; // Array of { name, state }

    for (const update of updates) {
      await Relay.updateOne(
        { name: update.name },
        { state: update.state, manualControl: update.manualControl  },
        { upsert: true } // Create if it doesn't exist
      );
    }

    res.status(200).json({ message: 'Relay states updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update relay states' });
  }
};

exports.postTemp = async (req, res) => {
  const { temperature } = req.body;

  try {
    const newTemp = new Temp({ temperature });
    await newTemp.save();
    res.status(200).json({ message: "Temperature logged" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log temperature" });
  }
}

exports.getTemp = async (req,res) => {
  try {
    const latestTemp = await Temp.findOne().sort({ timestamp: -1 });
    res.status(200).json(latestTemp);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch temperature" });
  }
}
