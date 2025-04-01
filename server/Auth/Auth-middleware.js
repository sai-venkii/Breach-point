const express=require("express");
require('dotenv').config();
const jwt=require("jsonwebtoken");
const logger=require("./authLogger");
const authMiddleware= (req,res,next)=>{
    const token = req.cookies.auth;
    if(!token){
        logger.warning("Token not found", { token });
        return res.status(403).send("Not Authorized");
    }else{
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded_userId)=>{
            if(err) {
                logger.notice("Invalid token", { token });
                return res.status(302).send("Invalid Login");
            }
            req.user = decoded_userId;
            next()
            logger.info("Token verified successfully", { token });
        });
    }
}

module.exports=authMiddleware