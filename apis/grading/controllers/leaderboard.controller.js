import {getLeaderboard, getTopK} from "../services/leaderboard.service.js";

export const leaderboardController = async (req, res) => {
    const response = await getLeaderboard()
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}

export const topkController = async (req, res) => {
    try{
        parseInt(req.query.k)
    } catch (e) {
        res.status(400).send({
            status: 'error',
            message: 'Parsing error'
        })
    }
    const k = parseInt(req.query.k) || 3
    const response = await getTopK(k)
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}