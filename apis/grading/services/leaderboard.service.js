import {Submission} from "../models/submission.model.js";
import mongoose from "mongoose";
import {ServiceResponseSuccess} from "../../common/service_response.js";
import {Coder} from "../../auth/models/Coder.js";
import delay from "delay";


export const getLeaderboard = async () => {
    let leaderboard = await Coder
        .find()
        .sort({
            score: -1
        })
        .select('-__v -password -email')
        .exec()

    leaderboard = leaderboard.map(l => l.toObject())
    leaderboard = await mergeSolvedChallenges(leaderboard)
    leaderboard = await mergeRanks(leaderboard)
    return new ServiceResponseSuccess(leaderboard)
}

export const getCoderScore = async (coder_id) => {
    const coder = await Coder
        .findById(coder_id).exec()
    
    if (!coder) return 0
    return coder.score || 0
}

export const getCoderSolvedChallenges = async (coder_id) => {
    const submissions = await Submission
        .find({
            coder: coder_id,
            isPassed: true
        }).exec()
    
    if (!submissions) return 0
    return submissions.length
}

export const getCoderRank = async (coder_id) => {
    const coderRank =  await Submission.aggregate([
        {
            $match: {isPassed: true},
        },
        {
            $group: {
                _id: "$coder",
                totalScore: { $sum: "$grade" },
            }
        },
        {
            $setWindowFields: {
                sortBy: { totalScore: -1 },
                output: {
                    rank: {
                        $rank: {}
                    }
                }
            }
        },
        {
            $match: {_id: new mongoose.Types.ObjectId(coder_id)},
        },
        // Project to include only necessary fields from coder details
        {
            $project: {
                _id: 0,
                totalScore: 1,
                rank: 1
            }
        },

    ]).exec();
    if (coderRank.length === 0) return await getLastAssignableRank()
    return coderRank[0].rank || await getLastAssignableRank()
}

export const getTopK = async (k) => {
    console.log(k)
    const topKCoders = await Coder
        .find()
        .sort({
            score: -1,
        })
        .limit(k)
        .select('-__v -email -password')
        .exec()
    return new ServiceResponseSuccess(topKCoders)
}


const getLastAssignableRank = async () => {
    const rankedCoders = await Coder
        .find()
        .sort({
            score: 1,
        })
        .exec()
    if(!rankedCoders || rankedCoders.length === 0) return 1;
    return rankedCoders.length
}

const mergeSolvedChallenges = async (leaderboard) => {
    for (let i = 0; i < leaderboard.length; i++) {
        const coder = leaderboard[i];
        coder['solved_challenges'] = await getCoderSolvedChallenges(coder._id);
        leaderboard[i] = coder;
      }
      return leaderboard;
}

const mergeRanks = async (leaderboard) => {
    for (let i = 0; i < leaderboard.length; i++) {
        const coder = leaderboard[i];
        coder['rank'] = await getCoderRank(coder._id);
        leaderboard[i] = coder;
    }
    return leaderboard;
}