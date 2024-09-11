const mongoose = require("mongoose")
const Schema = mongoose.Schema

const problemModel = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
        description:{
            type:String,
            required:true,
        },
        files:{
            type:String,
        },
        hints:{
            type:String,
        },
        category:{
            type:String,
            required:true,
        },
        points:{
            type:Number,
            required:true,
        },
        solves:{
            type:Number,
            required:true,
        },
        connectionInfo:{
            type:String,
            required:true,
        },
        id:{
            type:Number,
            required:true
        },
        solvedTeams:{
            type:Array,
            required:true,

        },
    }
)

const Problems = mongoose.model("Problems",problemModel)

export default Problems