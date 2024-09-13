const express=require("express");
require('dotenv').config();
const jwt=require("jsonwebtoken");
const authMiddleware= (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(302).redirect('/login');
    }else{
        
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded_userId)=>{
            if(err) return res.status(302).send("Invalid Login");
            req.user = decoded_userId;
            next()
        });
    }
}

module.exports=authMiddleware