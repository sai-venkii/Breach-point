const express = require("express");
const mongoose = require("mongoose");
const Teams = require("../Models/Teams");
const Challenges = require("../Models/Challenges");
const solvedChallenges = require("../Models/SolvedChallenges");
const authMiddleware = require("../../Auth/Auth-middleware");
const router = express.Router();
const logger=require("./teamsLogger");
router.get("/score", authMiddleware, async (req, res) => {
  try {
    const { team } = req.user;
    const score = (await Teams.getScore(team))[0];
    res.status(200).json(score);
    logger.info("Score fetched successfully", {
      team: team,
      score: score,
    });
  } catch (err) {
    logger.error("Error fetching score", {  
      error: err.message,
      team: req.user.team,
    });
    res.send(500).json({ message: "Could not fetch team score" });
  }
});

router.get("/solved", authMiddleware, async (req, res) => {
  try {
    const { team } = req.user;
    const teams = await Teams.getTeam(team);
    const challenges_solved = teams[0].solvedChallenges;
    res.status(200).json({
      solved: challenges_solved,
    });
    logger.info("Solved challenges fetched successfully", {
      team: team,
      solved: challenges_solved,
    });
  } catch (err) {
    
    res.send(500).json({
      message: "Couldn't fetch solved challenges",
    });
  }
});
router.post("/submit/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const user_flag = req.body.flag;
    const { team } = req.user;
    if (!id) {
      res.status(201).json({
        message: "Incorrect Parameters",
      });
    }
    const flag = await Challenges.getSingleChallenge(id, false);
    const team_details = await Teams.getTeam(team);
    if (!flag[0]) {
      res.status(200).json({ message: "Incorrect challenge ID" });
      logger.warning("Challenge not found in submitting challenge", {
        id: id,
      });
    } else if (team_details[0].solvedChallenges.includes(id)) {
      res.status(200).json({
        message: "Already Solved!!",
      });
      logger.warning("Challenge already solved", {
        id: id,
      });
    } else {
      if (flag[0].flag === user_flag) {
        let { points } = await Challenges.getScore(id);
        const { usedHints } = await solvedChallenges.getAttemptedChallenge(
          team,
          id
        );
        for (let i = 0; i < usedHints.length; i++) {
          points -= usedHints[i].pointsReduce;
        }
        const updated_team = await Teams.updateScore(team, points);
        await Challenges.updateSolves(id);
        logger.info("No of people solved challenges updated",{
          id: id,
          team: team
        })
        await Teams.addCompletedChallenge(team, id);
        logger.info("Team completed challenge updated",{
          id: id,
          team: team
        })
        await solvedChallenges.markSolved(team, id);
        logger.info("Challenge marked solved", {
          team: team,
          id: id,
        });
        res.status(200).json({
          status: "Solved",
          score: updated_team.score,
        });
      } else {
        logger.warning("Incorrect flag submitted", {
          team: team,
          id: id,
        });
        res.status(202).json({ message: "Incorrect Flag" });
      }
    }
  } catch (err) {
    logger.error("Error in submitting flag", {
      error: err.message,
      team: req.user.team,
    });
    res.status(500).json({
      message: "Couldn't validate flag",
    });
  }
});

module.exports = router;
