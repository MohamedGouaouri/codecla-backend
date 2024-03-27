import {Submission} from "../models/submission.model.js";
import mongoose from "mongoose";
import {ServiceResponseSuccess} from "../../common/service_response.js";
import {Challenge} from "../../challenges/models/Challenge.js";

export const getCoderHeatmap = async (coder_id, {start_date, end_date}) => {

    const currentDate = new Date();

    // Check if start date is null
    if (!start_date) {
            // Set start date to current date minus one year
            start_date = new Date(currentDate);
            start_date.setFullYear(start_date.getFullYear() - 1);
    } else {
        start_date = new Date(start_date)
    }

    // Check if end date is null
    if (!end_date) {
            // Set end date to current date
        end_date = new Date(currentDate);
    }else {
        end_date = new Date(end_date);
    }
    return new ServiceResponseSuccess(
        await Submission.aggregate([
            {
                $match: {
                    coder: new mongoose.Types.ObjectId(coder_id),
                    isPassed: true,
                    submittedAt: {
                        $gte: start_date,
                        $lte: end_date,
                    }
                }
            },
            {
                $addFields: {
                    date: {$dateToString: {format: "%Y/%m/%d", date: "$submittedAt"}}
                }
            },

            {
                $group: {
                    _id: "$date",
                    count: {$sum: 1},
                    date: { $first: "$date" },
                }
            },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    count: 1,
                }
            }
        ]).exec()
    );
}


export const getSolvedChallengesStats = async (coder_id) => {
    // return new ServiceResponseSuccess(
    //
    // );
    const totalEasyChallenges = (await Challenge.find({level: 'Easy'}).exec()).length
    const totalModerateChallenges = (await Challenge.find({level: 'Moderate'}).exec()).length
    const totalHardChallenges = (await Challenge.find({level: 'Hard'}).exec()).length

    const solved = await Submission.aggregate([
        {
            $match: {coder: new mongoose.Types.ObjectId(coder_id), isPassed: true}
        },
        {
            $lookup: {
                from: 'challenges',
                localField: 'challenge',
                foreignField: '_id',
                as: 'challengeDetails'
            }
        },
        {
            $unwind: "$challengeDetails" // Unwind to flatten the challenge details array
        },

        {
            $group: {
                _id: null,
                totalEasySolvedChallenges: {
                    $sum: {
                        $cond: [
                            {$eq: ['$challengeDetails.level', 'Easy']},
                            1,
                            0
                        ]
                    }
                },
                totalModerateSolvedChallenges: {
                    $sum: {
                        $cond: [
                            {$eq: ['$challengeDetails.level', 'Moderate']},
                            1,
                            0
                        ]
                    }
                },
                totalHardSolvedChallenges: {
                    $sum: {
                        $cond: [
                            {$eq: ['$challengeDetails.level', 'Hard']},
                            1,
                            0
                        ]
                    }
                },
            }
        },
        {
            $project: {
                _id: 0,
                totalEasySolvedChallenges: 1,
                totalModerateSolvedChallenges: 1,
                totalHardSolvedChallenges: 1,
            }
        }
    ]).exec()
    if (solved.length === 0) {
        return new ServiceResponseSuccess({
            totalEasyChallenges,
            totalModerateChallenges,
            totalHardChallenges
        })
    }
    return new ServiceResponseSuccess(
        {
            ...solved[0],
            totalEasyChallenges,
            totalModerateChallenges,
            totalHardChallenges
        }
    )
}