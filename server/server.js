const express = require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authMiddleware = require("./Auth/Auth-middleware");
const challengeRoute = require("./Round_1/Challenges/challenges-route");
const teamRoute = require("./Round_1/Team/teams-route");
const round_2_teamRoute=require("./Round_2/Teams/teams-route");
const round_2_challengeRoute=require("./Round_2/Challenges/challenges-route");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://breach-point.vercel.app",
    // origin: "http://localhost:5173",
    credentials:true
  })
);
require("dotenv").config();

require("./connection")();

const PORT = process.env.PORT || 5500;
app.use("/auth", authRoute);
app.use("/api/team", authMiddleware, teamRoute);
app.use("/api/challenges", challengeRoute);
app.use("/api/round_2",round_2_teamRoute);
app.use("/api/round_2/challenges",round_2_challengeRoute);
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
