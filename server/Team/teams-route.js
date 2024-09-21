const express = require("express");
const mongoose = require("mongoose");
const Teams = require("../Models/Teams");
const Challenges = require("../Models/Challenges");
const solvedChallenges = require("../Models/SolvedChallenges");
const router = express.Router();

router.get("/score", async (req, res) => {
  const { team } = req.user;
  try {
    const score = (await Teams.getScore(team))[0];
    res.status(200).json(score);
  } catch (err) {
    console.log(err);
    res.send(500).json({ message: "Could not fetch team score" });
  }
});

router.get("/solved",async (req,res)=>{
  const {team}=req.user;
  try{
    const teams=await Teams.getTeam(team);
    // console.log(teams);
    const challenges_solved=teams[0].solvedChallenges;
    res.status(200).json({
      solved:challenges_solved
    })
  }catch(err){
    console.log(err);
    res.send(500).json({
      message:"Couldn't fetch solved challenges"
    })
  }
})
router.post("/submit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user_flag =  req.body.flag;
    const {team}=req.user;
    if (!id) {
      res.status(201).json({
        message: "Incorrect Parameters",
      });
    }
    const flag = await Challenges.getSingleChallenge(id, false);
    const team_details= await Teams.getTeam(team); 
    // console.log(team_details[0])
    // console.log(flag,user_flag);
    if(!flag[0]){
    res.status(200).json({message:"Incorrect challenge ID"});
    }else if(team_details[0].solvedChallenges.includes(id)){
      res.status(200).json({
        message:"Already Solved!!"
      })
    }
    else{
      if (flag[0].flag === user_flag) {
        let {points}=await Challenges.getScore(id);
        const {usedHints} = await solvedChallenges.getAttemptedChallenge(team,id);
        // console.log(usedHints);
        for(let i=0;i<usedHints.length;i++){
            points-=usedHints[i].pointsReduce;
        }
        // console.log(points);
        const updated_team=(await Teams.updateScore(team,points));
        res.status(200).json({
          status:"Solved",
          score:updated_team.score
        });
        await Challenges.updateSolves(id);
        // console.log(updated_team);
        await Teams.addCompletedChallenge(team,id);
        await solvedChallenges.markSolved(team,id);
      } else {
        res.status(202).json({message:"Incorrect Flag"});
      }
    } 
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't validate flag",
    });
  }
});

module.exports = router;
