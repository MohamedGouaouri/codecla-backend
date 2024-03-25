import express from 'express'
import { getAll, createChallenge, getChallengeById, getChallengeTestsById, getAllCategories, getTrendingCategories } from '../controllers/challenge.controller.js';
import { authorize } from '../../middlewares/auth/authorize.middleware.js';
import { roles } from '../../middlewares/auth/roles.js';


const contentRouter = express.Router();
contentRouter.get("/", authorize([roles.Coder, roles.Manager]) ,getAll)
contentRouter.get("/categories", authorize([roles.Coder, roles.Manager]) ,getAllCategories)
contentRouter.get("/categories/trending", authorize([roles.Coder, roles.Manager]) ,getTrendingCategories)
contentRouter.post("/create", authorize([roles.Manager]) ,createChallenge)
contentRouter.get("/:id", authorize([roles.Coder, roles.Manager]),getChallengeById)
contentRouter.get("/tests/:id",authorize([roles.Coder, roles.Manager]) ,getChallengeTestsById)

export default contentRouter;