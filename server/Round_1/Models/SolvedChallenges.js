const mongoose=require('mongoose')

const hint=new mongoose.Schema({
    hintId: {
        type: Number,
        required: true,
    },
    pointsReduce: {
        type: Number,
        required: true,
    }
},{_id:false})


const solvedChallengesSchema=new mongoose.Schema({
    teamName:{
        type: String,
        required:true
    },
    challengeId:{
        type: Number,
        required:true,
    },
    usedHints: {
        type: [hint],
        default:[]
    },
    isSolved:{
        type:Boolean,
        default:false
    },
    solvedAt:{
        type: Date,
        default: Date.now(),      
    }
})

solvedChallengesSchema.statics.trackHint=async function (challenge_id,teamName,hint) {
    try{
        // console.log(hint);
        const existingChallenge=await this.findOne({
            teamName:teamName,
            challengeId:challenge_id
        })
        if(!existingChallenge){
            const newSolvedChallenge=await this.create({
                teamName:teamName,
                challengeId:challenge_id,
                usedHints:[hint]
            })
            // console.log("Solved challenge created",newSolvedChallenge);
        }else{
            const ishintExists = existingChallenge.usedHints.some(
                (existing_hint) => hint.hintId === existing_hint.hintId
              );        
              if (ishintExists){
                // console.log("Hint already Present");
                return;
              }
              existingChallenge.usedHints.push(hint);
              await existingChallenge.save();
            //   console.log('Hint added successfully:', existingChallenge);
        }
    }catch(err){
        console.log("Error in tracking Hint");
        console.log(err);
    }
}

solvedChallengesSchema.statics.getAttemptedChallenge=async function(teamName,challenge_id){
    try{
        var attemptedChallenge = await this.findOne({teamName:teamName,challengeId:challenge_id});
        if(!attemptedChallenge){
            attemptedChallenge = await this.create({
                teamName:teamName,
                challengeId:challenge_id,
            })
        }
        // console.log(attemptedChallenge);
        return attemptedChallenge;
    }catch(err){
        console.log(err);
    }
    
}

solvedChallengesSchema.statics.markSolved=async function (teamName,challenge_id) {
    try{
       await this.findOneAndUpdate(
            {teamName:teamName,challengeId:challenge_id},
            {$set:{isSolved:true}},
        );
    }catch(err){

    }
}
const solvedChallenges = mongoose.model("Attempted Challenges",solvedChallengesSchema)

module.exports = solvedChallenges