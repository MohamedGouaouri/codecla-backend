import {getCoderRank, getLeaderboard} from "../services/leaderboard.service.js";

export const leaderboardController = async (req, res) => {
    // await getLeaderboard()
    console.log(await getCoderRank(req.user.id))
    return res.end();
}