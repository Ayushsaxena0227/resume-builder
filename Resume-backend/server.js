require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const skillroutes = require("./routes/skillRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const shareRoutes = require("./routes/feedbackRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/user", skillroutes);
app.use("/api/user", achievementRoutes);
app.use("/api/user", educationRoutes);
app.use("/api/user", experienceRoutes);
app.use("/api/user", projectRoutes);
app.use("/api/user", resumeRoutes);
app.use("/api/user", shareRoutes);
// app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
