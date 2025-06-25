// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Resume Builder API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
