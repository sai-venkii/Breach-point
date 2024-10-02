const mongoose = require("mongoose");
const conn=require("../../connection_round_2")
const cred_schema=new mongoose.Schema({
    teamsSolved:{
        type:[Array],
        default:[]
    },
    user:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:""
    }
});

const cred=conn.model("Cred",cred_schema);
module.exports=cred