const mongoose = require("mongoose");
const Challenges = require("./Challenges");
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


teamModels.statics.getScore=async function (teamName){
  try{
    return await this.find({name:teamName},'name score -_id');
  }catch(err){
    console.log("Could not fetch score from db");
    console.log(err);
  }
}

teamModels.statics.updateScore = async function (teamName, question_id) {
  // console.log(teamName, question_id);
  const {points}=await Challenges.getScore(question_id);
  // console.log(points);
  return await this.findOneAndUpdate({name:teamName},{
      $inc:{score:points},
      scoreTime:Date.now
    },
    {new:true}
  );
};

const Teams = mongoose.model("Teams", teamModels);
module.exports = Teams;
