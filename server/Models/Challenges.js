const mongoose = require("mongoose");
const Teams = require("./Teams");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
    type: String,
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
    required: true,
  },
});

challengeSchema.plugin(AutoIncrement, {
  inc_field: "id",
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

challengeSchema.statics.getHint = async function (id) {
  try {
    return await this.find({ id: id }, "hints -_id").limit(1);
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
        "-solvedTeams -_id -hints -__v -flag"
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
  return await this.find({id:id},{
    $inc:{solves:1}
  })
}

const Challenges = mongoose.model("Problems", challengeSchema);
module.exports = Challenges;
