const express = require("express");
const router = express.Router();
const Challenge = require("../Models/Challenge");
const logger= require("./challengesLogger");
router.post("/add", async (req, res) => {
  try {
    const { machine_name, flag, category, points, points_deduct } = req.body;
    const newChallenge = new Challenge({
      machine_name: machine_name,
      flag: flag,
      category: category,
      points: points,
      points_deduct: points_deduct,
    });
    await newChallenge.save();
    res.status(200).json({
      message: "Challenge Added Successfully",
    });
    logger.info("Challenge created", {
      machine_name: machine_name,
      flag: flag,
      category: category,
      points: points,
      points_deduct: points_deduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating challenge",
    });
    logger.error("Error creating challenge", {
      error: err.message,
    });
  }
});
module.exports = router;
