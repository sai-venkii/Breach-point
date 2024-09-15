const express=require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors=require("cors")
const authMiddleware = require("./Auth/Auth-middleware");
const challengeRoute=require('./Challenges/challenges-route');
const teamRoute=require('./Team/teams-route');
const app=express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
require('dotenv').config();

require('./connection')();

const PORT = process.env.PORT || 5500
app.use('/auth',authRoute);
app.use('/api/team',authMiddleware,teamRoute);
app.use("/api/challenges",challengeRoute);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})