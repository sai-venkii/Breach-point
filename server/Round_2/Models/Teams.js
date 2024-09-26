const mongoose = require("mongoose");
const conn = require("../../connection_round_2");
const Round1_Teams=require("../../Round_1/Models/Teams");
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        default:""
    },
    points: {
        type: Number,
        default: 0,
    },
    solved_type: {
        type: [String],
        default: []
    },
    machine_assigned: {
        type: String,
        required: true,
        unique:true
    },
    score_update_time: {
        type: Date,
        default: Date.now()
    }
});
teamSchema.pre('save',async function(next){
    try{
        // console.log(this);
        const {password} = (await Round1_Teams.getPassword(this.name));
        if(!password){
            throw new Error("Team not found");
        }
        // console.log(team_password);
        this.password = password;
        next();
    }catch(err){
        console.log("Error getting password");
        next(err);
    }
});

teamSchema.statics.getTeam = async function(team_name){
    return await this.findOne({name:team_name},'-password -_id -__v');
}
const Teams = conn.model("Teams", teamSchema);

module.exports = Teams;
