import {Submission} from "../models/submission.model.js";
import mongoose from "mongoose";
import {ServiceResponseSuccess} from "../../common/service_response.js";

export const getCoderHeatmap = async (coder_id) => {
    return new ServiceResponseSuccess(
        await Submission.aggregate([
            {
                $match: {coder: new mongoose.Types.ObjectId(coder_id)}
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
        ])
    );
}
