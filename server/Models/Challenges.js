const mongoose = require("mongoose");
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
  solvedTeams: {
    type: Array,
    default: [],
  },
});

challengeSchema.plugin(AutoIncrement, {
  inc_field: "id",
});

challengeSchema.statics.getAllChallenges = async function () {
  try {
    return await this.find({}, "id name category points -_id");
    // const result = await this.aggregate([
    //     {
    //         $group:{
    //             _id:"$category",
    //             challenges:{
    //                 $push:{
    //                     name:"$name",
    //                     id:"$id",
    //                     points:"$points"
    //                 }
    //             }
    //         },
    //     },
    //     {
    //         $project:{
    //             _id:0,
    //             category:"$_id",
    //             challenges:1
    //         }
    //     },
    // ])
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
  } catch (err) {}
};

challengeSchema.statics.updateScore = async function (teamName, question_id) {
  console.log(teamName, question_id);
};

const Challenges = mongoose.model("Problems", challengeSchema);
module.exports = Challenges;
