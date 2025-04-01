const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Teams = require("../Round_1/Models/Teams");
const bcrypt = require("bcrypt");
require("dotenv").config();
router.use(express.json());
const logger = require("./authLogger");
const ratelimit = require("express-rate-limit");

router.post("/register", async (req, res) => {
  const { teamName, password, email } = req.body;
  try {
    const user = await Teams.findOne({ email: email.toString() });
    const username = await Teams.findOne({ name: teamName.toString() });
    if (user) {
      logger.warning("Email already exists", { email });
      return res.status(400).json({ message: "Email Already Exists" });
    }
    if (username) {
      logger.warning("Team name already exists", { teamName });
      return res.status(400).json({ message: "Team name Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeam = new Teams({
      name: teamName,
      email: email,
      password: hashedPassword,
    });
    await newTeam.save();
    res.status(201).json({ message: "Team created successfully" });
    logger.info("Team created successfully", { teamName });
  } catch (err) {
    res.status(500).json({ message: "Team not created" });
    logger.error("Team not created", { error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { teamName, password } = req.body;

  try {
    const team = await Teams.findOne({ name: teamName.toString() });
    if (!team) {
      logger.warning("Team not found", { teamName });
      return res.status(404).json({ message: "Team not found" });
    }
    const match = await bcrypt.compare(password, team.password);
    if (match) {
      const user = {
        team: team.name,
      };
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "5hr",
      });
      res
        .cookie("auth", token, {
          maxAge: 3 * 60 * 60 * 1000,
          httpOnly: false,
          sameSite: "None",
          secure: true,
        })
        .send("Success");
      logger.info("Login successful", { teamName });
    } else {
      logger.warning("Invalid credentials", { teamName });
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    logger.error("Login failed", { error: err.message });
    res.status(500).json({ message: "Login could not be validated" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth", {
    path: "/",
    httpOnly: false,
    sameSite: "None",
    secure: true,
  });
  logger.info("Logout successful", { teamName: req.user.team });
  return res.sendStatus(200);
});

module.exports = router;
