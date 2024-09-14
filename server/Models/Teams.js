const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamModels = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  scoreTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
});


teamModels.statics.getScore=async (teamName)=>{
  try{
    return await this.find({name:teamName},'score').limit(1);
  }catch(err){
    console.log("Could not fetch score from db");
  }
}
const Teams = mongoose.model("Teams", teamModels);
module.exports = Teams;
