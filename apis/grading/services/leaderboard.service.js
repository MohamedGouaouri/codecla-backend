import {Submission} from "../models/submission.model.js";
import mongoose from "mongoose";
import {ServiceResponseSuccess} from "../../common/service_response.js";


export const getLeaderboard = async () => {
    const result =  await Submission.aggregate([
        {
            $match: {isPassed: true},
        },
        {
            $group: {
                _id: "$coder",
                totalScore: { $sum: "$grade" },
                totalChallenges: { $addToSet: "$challenge" } // Count distinct challenges
            }
        },
        // Count the number of solved challenges
        {
            $addFields: {
                numSolvedChallenges: { $size: "$totalChallenges" }
            }
        },
        // Populate the coder details
        {
            $lookup: {
                from: "coders", // Assuming the collection name is "coders"
                localField: "_id",
                foreignField: "_id",
                as: "coder"
            }
        },
        // Project to include only necessary fields from coder details
        {
            $project: {
                _id: 0,
                "coder": 1,
                totalScore: 1,
                numSolvedChallenges: 1
            }
        },
        // Sort the leaderboard by total score in descending order
        {
            $sort: { totalScore: -1 }
        }
    ]).exec();
    return new ServiceResponseSuccess(result)
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
    if (coderRank.length === 0) return 0
    return coderRank[0].rank || 0
}