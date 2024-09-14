const express = require("express");
const mongoose = require("mongoose");
const Teams = require("../Models/Teams");
const Challenges = require("../Models/Challenges");
const router = express.Router();
const authMiddleware = require("../Auth/Auth-middleware");

router.get("/score", authMiddleware, async (req, res) => {
  const { team } = req.user;
  try {
    const score = (await Teams.getScore(team))[0];
    res.status(200).json(score);
  } catch (err) {
    console.log(err);
    res.send(500).json({ message: "Could not fetch team score" });
  }
});

router.post("/submit/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const user_flag = req.body.flag;
    const {team}=req.user;
    if (!id) {
      res.status(201).json({
        message: "Incorrect Parameters",
      });
    }
    const {flag} = (await Challenges.getSingleChallenge(id, false))[0];
    // console.log(flag,user_flag);
    if (flag === user_flag) {
      const updated_team = await Teams.updateScore(team,id);
      // console.log(updated_team);
      res.status(200).send("Solved");
    } else {
      res.status(200).send("Incorrect Flag");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't validate flag",
    });
  }
});

module.exports = router;
