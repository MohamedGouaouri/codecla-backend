import express from 'express'
import { submitController } from '../controllers/submit.controller.js'
import { authorize } from '../../middlewares/auth/authorize.middleware.js'
import { roles } from '../../middlewares/auth/roles.js'
import { leaderboardController } from '../controllers/leaderboard.controller.js'
const gradingRouter = express.Router()

gradingRouter.post('/submit', authorize([roles.Coder]), submitController)
gradingRouter.get('/leaderboard', authorize([roles.Coder]), leaderboardController)

export default gradingRouter;