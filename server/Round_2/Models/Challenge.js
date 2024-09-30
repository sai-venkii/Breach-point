const mongoose = require("mongoose");
const conn = require("../../connection_round_2");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const challengeSchema = new mongoose.Schema({
    machine_name: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default:0
    },
    points_deduct:{
        type:Number,
        required:true,
        default:0
    }
});
challengeSchema.plugin(AutoIncrement, {
    inc_field: "challenge_id",
  });
challengeSchema.statics.getChallenge = async function(machine_assigned,flag){
    return await this.findOne({machine_name:machine_assigned,flag:flag},'-_id -__v');
}

const Challenges = conn.model("Challenges", challengeSchema);

module.exports = Challenges;
