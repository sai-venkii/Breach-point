const express = require("express");
const router = express.Router();
const Teams = require("../Models/Teams");
const Challenges = require("../Models/Challenge");
const authMiddleware = require("../../Auth/Auth-middleware");
const Cred = require("../Models/UserCred");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("./teamsLogger");
const { log } = require("winston");

router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { team } = req.user;
    const user_flag = req.body.flag;
    const db_team = await Teams.getTeam(team);
    if (!db_team) {
      logger.warning("Team not found in submitting challenge", { team });
      throw Error("Team not found", err);
    }
    let challenge = await Challenges.findOne({ flag: user_flag }, "-_id");
    if (!challenge) {
      logger.warning("Challenge not found in submitting challenge");
      return res.status(202).json({ message: "Incorrect Flag" });
    }
    const machine_assigned = db_team.machine_assigned;
    if (challenge.machine_name !== machine_assigned) {
      logger.warning("Challenge not found in submitting challenge", {
        machine_assigned,
      });
      return res.status(201).json({
        message: "Wrong Flag",
      });
    }
    const challengeID = challenge.challenge_id;
    // console.log(typeof(challengeID));
    const { solved_challenges } = db_team;
    // console.log(solved_type);
    if (solved_challenges.includes(challengeID)) {
      logger.warning("Challenge already solved", { challengeID });
      res.status(203).json({
        message: "Challenge has been solved already.",
      });
    } else {
      //Increment points
      const updateTeamScore = await Teams.findOneAndUpdate(
        { name: team },
        {
          $inc: { points: challenge.points },
          $addToSet: { solved_challenges: challengeID },
          $set: {
            score_update_time: Date.now(),
          },
        },
        { new: true }
      );
      res.status(200).json({
        message: "Solved",
        score: updateTeamScore.points,
      });
      logger.info(
        `${updateTeamScore.name} has solved challenge ${challengeID}`
      );
    }
    // console.log(category);
  } catch (err) {
    logger.error("Error in submitting flag", { error: err.message });
    res.status(500).json({
      message: "Failed Flag submit",
    });
  }
});

router.get("/cred", authMiddleware, async (req, res) => {
  try {
    const cred = await Cred.find({}, "user -_id");
    let cred_arry = [];
    for (let i = 0; i < cred.length; i++) {
      cred_arry.push(cred[i].user);
    }
    res.status(200).json({
      cred: cred_arry,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error cred",
    });
  }
});

router.post("/cred", authMiddleware, async (req, res) => {
  try {
    const { team } = req.user;
    const { user, password } = req.body;
    const cred = await Cred.findOne({ user: user });
    if (!cred) {
      return res.status(201).json({
        message: "Wrong user",
      });
    }
    const corr_password = cred.password;
    if (corr_password === password) {
      if (cred.teamsSolved.includes(team)) {
        return res.status(202).json({ message: "Already Submitted" });
      }
      cred.teamsSolved.push(team);
      await cred.save();
      res.status(200).json({
        message: "Correct",
      });
    } else {
      res.status(201).json({
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed evaluating credentials",
    });
  }
});

router.post("/addCred", async (req, res) => {
  try {
    const { user, password } = req.body;
    const existing_cred = await Cred.findOne({
      user: user,
      password: password,
    });
    if (existing_cred) {
      return res.status(201).json({
        message: "Credentials already exist",
      });
    }
    const cred = new Cred({
      user: user,
      password: password,
    });
    await cred.save();
    res.status(200).json({
      message: "Added",
    });
  } catch (err) {
    console.log(err);
    res.status(500).status({
      message: "Could not add cred",
    });
  }
});

router.get("/score", authMiddleware, async (req, res) => {
  try {
    const { team } = req.user;
    const db_team = await Teams.findOne(
      { name: team.toString() },
      "-_id -__v -password -score_update_time"
    );
    // console.log(db_team);
    if (db_team) {
      const box = await Challenges.find({
        machine_name: db_team.machine_assigned,
      });
      // console.log(box.length);
      logger.info("Team score fetched", {
        team: db_team.name,
        points: db_team.points,
      });
      return res.status(200).json({
        name: db_team.name,
        points: db_team.points,
        solved: db_team.solved_challenges.length,
        machine_assigned: db_team.machine_assigned,
        total_flags: box.length,
      });
    }
    res.status(201).json({
      message: "Could not fetch team score",
    });
    logger.warning("Team not found in getting score", { team });
  } catch (err) {
    logger.error("Error in getting team score", { error: err.message });
    res.status(500).json({
      message: "Error getting team Score",
    });
  }
});
router.post("/addteam", async (req, res) => {
  try {
    const { name, machine_name } = req.body;
    // console.log(name,machine_name);
    const user = await Teams.findOne({ name: name });
    const machine = await Teams.findOne({ machine_assigned: machine_name });
    if (user) {
      res.status(202).json({ message: "Team already exists" });
      logger.warning("Team already exists", { name });
    } else {
      const newTeam = new Teams({
        name: name,
        machine_assigned: machine_name,
      });
      // console.log(name,machine_name)
      await newTeam.save();
      res.status(200).json({
        message: "Team Created",
      });
      logger.info("New team created", { name });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error Adding Team",
    });
    logger.error("Error in adding team", { error: err.message });
  }
});

router.post("/auth/login", async (req, res) => {
  const { teamName, password } = req.body;
  try {
    const team = await Teams.findOne({ name: teamName });
    if (!team) {
      logger.warning("Team not found in login", { teamName });
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
        logger.info("Team logged in", { teamName });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      logger.warning("Invalid credentials for team login", { teamName });
    }
  } catch (err) {
    logger.error("Error in team login", { error: err.message });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
