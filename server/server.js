const express=require("express");
const authRoute = require("./Auth/Auth-route");
const mongoose = require("mongoose");
const app=express();

const UserSchema=new mongoose.Schema({
    name:String,
    password:String
})

const userModel=mongoose.model('User',UserSchema)
const PORT = process.env.PORT || 5500
app.use('/',authRoute);
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})