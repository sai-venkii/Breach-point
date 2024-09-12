const express=require("express");
require('dotenv').config();
const jwt=require("jsonwebtoken");
const authMiddleware= (req,res)=>{
    //console.log(req)
    const authHeader = req.headers['Authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(403).send("Login Required")
    }else{
        
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded_userId)=>{
            if(err) return res.status(302).send("Invalid Login");
            req.user = decoded_userId;
            next();
        });
    }
}

module.exports=authMiddleware