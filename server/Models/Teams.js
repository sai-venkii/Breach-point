const mongoose = require("mongoose")
const Schema = mongoose.Schema

const teamModels = new Schema(  
    {
        name:{
            type:String,
            required:true,
            unique:true
        },
        score:{
            type:Number,
            required:true,
        },
        isVerified:{
            type:Boolean,
            required:true,
            default:false,
        },
        scoreTime:{
            type:Date,
            required:true,
        }
    }
)
const Teams = mongoose.model("Teams",teamModels)
export default Teams;