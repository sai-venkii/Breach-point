const mongoose = require("mongoose");
const Teams = require("./Teams");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const hintsSchema = new mongoose.Schema({
  id: {
    type:Number,
    required:true,
  },
  hint: {
    type:String,
    required:true
  },
  pointReduce: {
    type: Number,
    required:true
  },
},{_id:false})

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  flag: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {
    type: String,
  },
  hints: {
    type:[hintsSchema],
    default:[]
  },
  hintCount:{
    type:Number,
    required:true,
    default:0
  },  
  category: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  solves: {
    type: Number,
    default: 0,
  },
  connectionInfo: {
    type: String,
  },
});

challengeSchema.plugin(AutoIncrement, {
  inc_field: "id",
});

challengeSchema.pre('save', function (next) {
  this.hintCount = this.hints.length;
  next();
});

challengeSchema.statics.getAllChallenges = async function () {
  try {
    return await this.find({}, "id name category points -_id");
    // // console.log(result)
    // return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching challenges");
  }
};

challengeSchema.statics.getHint = async function (challenge_id) {
  try {
    return await this.find({ id: challenge_id }, "hints -_id").limit(1);
  } catch (err) {
    console.log(err);
    throw new Error("Error returning Hint");
  }
};

challengeSchema.statics.getSingleChallenge = async function (
  id,
  hide_flag = true
) {
  try {
    if (hide_flag) {
      return await this.find(
        { id: id },
        "-solvedTeams -_id -__v -flag"
      ).limit(1);
    } else {
      return await this.find({ id: id }, "flag -_id").limit(1);
    }
  } catch (err) {
    console.log("Error fetching single problem");
  }
};

challengeSchema.statics.getScore=async function(id){
  // console.log(id)
  return (await this.find({id:id},'points -_id'))[0];
}

challengeSchema.statics.updateSolves=async function (id) {
  return await this.findOneAndUpdate({id:id},{
    $inc:{solves:1}
  })
}

const Challenges = mongoose.model("Challenges", challengeSchema);
module.exports = Challenges;
