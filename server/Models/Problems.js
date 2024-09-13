const mongoose = require("mongoose")
const AutoIncrement=require("mongoose-sequence")(mongoose);

const problemSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
        flag:{
            type:String,
            required:true
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
            default:0
        },
        connectionInfo:{
            type:String,
            required:true,
        },
        solvedTeams:{
            type:Array,
            default:[],
        },
    }
)

problemSchema.plugin(AutoIncrement,{
    inc_field:'id'
})

problemSchema.statics.getAllProblems = async function() {
    try {
        return await this.find({}, 'id name category points');
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching problems');
    }
};

const Problems = mongoose.model("Problems", problemSchema);
module.exports = Problems;