const express=require("express");
require('dotenv').config();
const jwt=require("jsonwebtoken");
const authMiddleware= (req,res)=>{
    const authHeader = req.headers('Authorization')
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.redirect('/login',302);
    }else{
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded_userId)=>{
            if(err) return res.redirect('/login',302);
            req.user = decoded_userId;
            next();
        });
    }
}

module.exports=authMiddleware