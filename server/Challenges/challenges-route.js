const express = require("express");
require("dotenv").config();
const authMiddleware = require("../Auth/Auth-middleware");
const router = express.Router();
const Challenges = require("../Models/Challenges");
router.get("/{:id}", authMiddleware, async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  if (!id) {
    try {
      const challenges = await Challenges.getAllChallenges();
      res.json(challenges);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching" });
    }
  } else {
    try {
      const challenges = await Challenges.getSingleChallenge(id);
      // console.log(challenges)
      res.send(challenges[0]);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Error fetching Challenge ${id}` });
    }
  }
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const {
      challenge_name,
      flag,
      challenge_description,
      files,
      hints,
      category,
      points,
      solves,
      connectionInfo,
    } = req.body;

    const Challenge = new Challenges({
      name: challenge_name,
      flag: flag,
      description: challenge_description,
      files: files,
      hints: hints,
      category: category,
      points: points,
      solves: solves,
      connectionInfo: connectionInfo,
    });
    await Challenge.save();
    res.status(200).json({
      message: "Challenge added",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Cannot be Added" });
  }
});

router.get("/hint/:id", authMiddleware, async (req, res) => {
  try {
    const challenge_id = req.params.id;
    const hint = await Challenges.getHint(challenge_id);
    // console.log(hint);
    res.status(200).send(hint[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't fetch hint",
    });
  }
});

module.exports = router;
