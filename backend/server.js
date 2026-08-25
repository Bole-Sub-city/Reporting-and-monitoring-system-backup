const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const planRoutes = require("./routes/planRoutes");
const subcityRoutes = require("./routes/subcityRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Reporting System Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subcity", subcityRoutes);
app.use("/api/announcements", announcementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
