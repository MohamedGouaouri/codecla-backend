import {getCoderHeatmap, getSolvedChallengesStats} from "../services/stats.service.js";


export const heatmapController = async (req, res) => {
    const {id} = req.user
    const {start_date, end_date} = req.query
    const response = await getCoderHeatmap(id, {start_date, end_date})
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}

export const solvedChallengesController = async (req, res) => {
    const {id} = req.user
    const response = await getSolvedChallengesStats(id)
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}