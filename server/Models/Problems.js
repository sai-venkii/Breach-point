const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const problemSchema = new mongoose.Schema({
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

problemSchema.plugin(AutoIncrement, {
  inc_field: "id",
});

problemSchema.statics.getAllProblems = async function () {
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
    throw new Error("Error fetching problems");
  }
};

problemSchema.statics.getHint = async function (id) {
  try {
    return await this.find({ id: id }, "hints -_id").limit(1);
  } catch (err) {
    console.log(err);
    throw new Error("Error returning Hint");
  }
};

problemSchema.statics.getSingleProblem = async function (id, hide_flag = true) {
  try {
    if (hide_flag) {
      return this.find({ id: id }, "-solvedTeams -_id -hints -__v -flag").limit(1);
    } else {
      return this.find({ id: id }, "flag -_id").limit(1);
    }
  } catch (err) {}
};
const Problems = mongoose.model("Problems", problemSchema);
module.exports = Problems;
