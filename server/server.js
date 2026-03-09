require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
connectDB();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.json({ message: "Cafe-OS API running" }));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is busy. Run: killall -9 node`);
    process.exit(1);
  }
});

