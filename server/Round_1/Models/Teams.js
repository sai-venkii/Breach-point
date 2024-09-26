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
  scoreTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  solvedChallenges: {
    type: [Number],
    default: [],
  }
});


teamModels.statics.getScore=async function (teamName){
  try{
    return await this.find({name:teamName},'name score -_id');
  }catch(err){
    console.log("Could not fetch score from db");
    console.log(err);
  }
}

teamModels.statics.updateScore = async function (teamName,points) {
  // console.log(teamName, question_id);
 
  // console.log(points);
  return await this.findOneAndUpdate({name:teamName},{
      $inc:{score:points},
      scoreTime:Date.now()
    },
    {new:true}
  );
};

teamModels.statics.getTeam=async function(teamName){
  return await this.find({name:teamName},'-_id -password -__v');
}

teamModels.statics.addCompletedChallenge=async function(team,challenge_id){
  return await this.findOneAndUpdate({name:team},{
    $addToSet:{
      solvedChallenges:challenge_id
    }
  },{new:true});
}
teamModels.statics.getPassword=async function(team) {
  const res= await this.findOne({name:team},'password -_id');
  return res;
}

const Teams = mongoose.model("Teams", teamModels);
module.exports = Teams;
