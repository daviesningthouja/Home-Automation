const express = require("express");
const connection = require('./db');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection connected on db file
connection();

const buttonRoutes = require("./routes/buttonRoute");
const relayRoutes = require("./routes/relayRoute")
const userRoutes = require("./routes/userRoute");
const {authmiddleware} = require('./middleware/authmiddleware')
// Define Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/buttons", buttonRoutes);
// Routes
app.use("/api/relays",relayRoutes);
app.use("/api/auth",userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
