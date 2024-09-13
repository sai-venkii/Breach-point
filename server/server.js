const express=require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./Auth/Auth-middleware");
const app=express();
const homeRoute=require('./Home/home-route')
app.use(cookieParser())
app.use(express.json());
require('dotenv').config();

require('./connection')();

const PORT = process.env.PORT || 5500
app.use('/auth',authRoute);
app.use("/api",homeRoute);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})