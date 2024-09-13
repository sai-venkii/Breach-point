const express = require("express")
require("dotenv").config()
const authMiddleware=require('../Auth/Auth-middleware')
const router = express.Router()
const Problems=require('../Models/Problems');
router.get("/:id",authMiddleware,async (req,res)=>{
    const id=req.params.id;
    if(!id){
        try {
            const problems = await Problems.getAllProblems();
            res.json(problems);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Error fetching'});
        }
    }else{
        try {
            const problems = await Problems.getSingleProblem(id);
            res.send(problems[0]);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: `Error fetching problem ${id}`});
        }
    }
    
})

router.post("/",async (req,res)=>{
    // console.log(req.body);
    try{
        const {
            challenge_name, flag, challenge_description, files, hints, category, points, solves, connectionInfo, solved_teams
        } = req.body;
    
        const problem = new Problems({
            name: challenge_name,
            flag: flag,
            description: challenge_description,
            files: files,
            hints: hints,
            category: category,
            points: points,
            solves: solves,
            connectionInfo: connectionInfo,
            solvedTeams:solved_teams
        })
        await problem.save();
        res.status(200).json({
            message:"Problem added"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Cannot be Added"});
    }
})

router.get("/hint/:id",authMiddleware,async (req,res)=>{
    try{
        const challenge_id = req.params.id;
        const hint = await Problems.getHint(challenge_id);
        // console.log(hint);
        res.status(200).send(hint[0]);
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Couldn't fetch hint"
        })
    }
})

module.exports=router