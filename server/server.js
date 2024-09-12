const express=require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./Auth/Auth-middleware");
const app=express();
app.use(cookieParser())
require('dotenv').config();

require('./connection')();

const PORT = process.env.PORT || 5500
app.use('/auth',authRoute);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})