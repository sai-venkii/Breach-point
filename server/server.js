const express=require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const app=express();
require('./connection')();

const PORT = process.env.PORT || 5500
app.use('/',authRoute);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})