import express from 'express'
import { submitController } from '../controllers/submit.controller.js'
import { authorize } from '../../middlewares/auth/authorize.middleware.js'
import { roles } from '../../middlewares/auth/roles.js'
import { leaderboardController, topkController } from '../controllers/leaderboard.controller.js'
import {heatmapController, solvedChallengesController} from "../controllers/stats.controller.js";

const gradingRouter = express.Router()

gradingRouter.post('/submit', authorize([roles.Coder]), submitController)
gradingRouter.get('/leaderboard', authorize([roles.Coder]), leaderboardController)
gradingRouter.get('/leaderboard/topk', authorize([roles.Coder]), topkController)
gradingRouter.get('/heatmap', authorize([roles.Coder]), heatmapController)
gradingRouter.get('/stats', authorize([roles.Coder]), solvedChallengesController)


export default gradingRouter;