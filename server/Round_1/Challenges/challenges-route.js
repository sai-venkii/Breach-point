const express = require("express");
require("dotenv").config();
const authMiddleware = require("../../Auth/Auth-middleware");
const router = express.Router();
const Teams = require("../Models/Teams");
const solvedChallenges = require("../Models/SolvedChallenges");
const Challenges = require("../Models/Challenges");
const logger=require("./challengesLogger");

router.get("/{:id}", authMiddleware, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    try {
      const challenges = await Challenges.getAllChallenges();
      res.json(challenges);
      logger.info("Fetched all challenges", {
        team: req.user.team,
        challenges: challenges,
      });
    } catch (err) {
      logger.error("Error fetching all challenges", { error: err });
      res.status(500).json({ message: "Error fetching" });
    }
  } else {
    try {
      var challenge = (await Challenges.getSingleChallenge(id))[0];
      var hint_points_reduction = [];
      const hints = challenge.hints;
      for (var i = 0; i < hints.length; i++) {
        hint_points_reduction.push(hints[i].pointReduce);
      }
      challenge.hints = undefined;
      challenge = JSON.parse(JSON.stringify(challenge));
      challenge["points reduction"] = hint_points_reduction;
      res.json(challenge);
      logger.info("Fetched challenge", {
        team: req.user.team,
        challenge: challenge,
      });
    } catch (err) {
      logger.error("Error fetching challenge", { error: err });
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
    // console.log(hints);
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
    logger.info("Challenge added", {
      team: req.user.team,
      challenge_name: challenge_name,
    });
  } catch (err) {
    logger.error("Error adding challenge", { error: err });
    res.status(500).json({ message: "Cannot be Added" });
  }
});

router.get("/:challengeId/hint/:hintId", authMiddleware, async (req, res) => {
  try {
    const challenge_id = req.params.challengeId;
    const hint_id = Number(req.params.hintId);
    const { team } = req.user;
    const query_result_hints = await Challenges.getHint(challenge_id);
    if (!query_result_hints) {
      res.status(200).send("No hint for this challenge");
      logger.info("No hint for this challenge", {
        team: req.user.team,
        challengeId: challenge_id,
      });
    } else {
      const required_hint = query_result_hints[0].hints.find(
        (hint) => hint.id === hint_id
      );
      if (!required_hint) {
        res.status(202).json({ message: "Invalid hint id" });
        logger.error("Invalid hint id", {
          team: req.user.team,
          challengeId: challenge_id,
          hintId: hint_id,
        });
      } else {
        res.status(200).json(required_hint);
        await solvedChallenges.trackHint(challenge_id, team, {
          hintId: required_hint.id,
          pointsReduce: required_hint.pointReduce,
        });
        logger.info("Hint fetched", {
          team: req.user.team,
          challengeId: challenge_id,
          hintId: required_hint.id,
        });
      }
    }
  } catch (err) {
    logger.error("Error fetching hint", { error: err });
    res.status(500).json({
      message: "Couldn't fetch hint",
    });
  }
});

module.exports = router;
