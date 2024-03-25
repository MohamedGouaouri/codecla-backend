import {getCoderHeatmap} from "../services/stats.service.js";


export const heatmapController = async (req, res) => {
    const {id} = req.user
    const response = await getCoderHeatmap(id)
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}