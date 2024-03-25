import { getLeaderboard } from "../services/leaderboard.service.js";

export const leaderboardController = async (req, res) => {
    const response = await getLeaderboard()
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}