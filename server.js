// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const skillroutes = require("./routes/skillRoutes");
const achievementRoutes = require("./routes/achievementRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/user", skillroutes);
app.use("/api/user", achievementRoutes);

app.get("/", (req, res) => {
  res.send("Resume Builder API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
