import * as challengeService from "../services/challenge.service.js";

export const getAll = async (req, res) => {
  const user = req.user
  if (!user) return res.end()
  const {category} = req.query
  const serviceResponse = await challengeService.getAll(user, {category});
  return res
    .status(serviceResponse.getHttpStatus())
    .json(serviceResponse.getHttpResponse());
}

export const getAllCategories = async (req, res) => {
  const user = req.user
  if (!user) return res.end()
  const serviceResponse = await challengeService.getAllCategories(user);
  return res
      .status(serviceResponse.getHttpStatus())
      .json(serviceResponse.getHttpResponse());
}


export const createChallenge = async (req, res) => {
  // TODO:  Request validation
  const {id: creator} = req.user
  const serviceResponse = await challengeService.createChallenge(req.body, creator);
  return res
    .status(serviceResponse.getHttpStatus())
    .json(serviceResponse.getHttpResponse());
}

export const getChallengeById = async (req, res) => {
  const challengeId = req.params.id
  const serviceResponse = await challengeService.getChallengeById(challengeId, req.user);
  return res
    .status(serviceResponse.getHttpStatus())
    .json(serviceResponse.getHttpResponse());
}


export const getTrendingCategories = async (req, res) => {
  const serviceResponse = await challengeService.getTrendingCategories();
  return res
      .status(serviceResponse.getHttpStatus())
      .json(serviceResponse.getHttpResponse());
}

