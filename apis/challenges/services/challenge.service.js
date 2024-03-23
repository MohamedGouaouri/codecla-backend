import { DBOperationException, ResourceNotFoundException } from "../../common/exceptions.js"
import { ServiceResponseFailure, ServiceResponseSuccess } from "../../common/service_response.js"
import { Submission } from "../../grading/models/submission.model.js"
import { roles } from "../../middlewares/auth/roles.js"
import { Challenge } from "../models/Challenge.js"


export const getAll = async (user) => {
  const {id, role} = user
  let challenges
  switch (role) {
    case roles.Manager:
      // Return manager's created challenges paginated
      challenges = await Challenge
        .find({creator: id})
        .select(['title', 'category', 'description', 'level', 'creator'])
        .populate('creator')
        .exec();
      if (!challenges) {
        return new ServiceResponseSuccess([])
      }
      return new ServiceResponseSuccess(challenges)
    case roles.Coder:
        // Return challenges for coder
        // TODO: Include status of the challenge for that
        challenges = await Challenge
          .find()
          .select(['title', 'category', 'description', 'level', 'creator'])
          .exec()
          ;
        if (!challenges) {
          return new ServiceResponseSuccess([challenges])
        }

        challenges = await mergeStatus(challenges, id)
        return new ServiceResponseSuccess(challenges)
  
    default:
      return new ServiceResponseSuccess([])
  }

}

export const createChallenge = async (challenge, creator) => {
  try {
    const newChallenge = new Challenge(challenge)
    newChallenge.creator = creator
    await newChallenge.save()
    return new ServiceResponseSuccess(
      newChallenge,
      true,
    )
  } catch (e) {
    console.log(e);
    return new ServiceResponseFailure(
      new DBOperationException()
    )
  }
}
export const getChallengeById = async (challengeId) => {
  try {
    let challenge = await Challenge.findById(challengeId, '-__v')

    if (!challenge) return new ServiceResponseFailure(
      new ResourceNotFoundException(
        'Challenge not found',
      )
    )
      
    return new ServiceResponseSuccess(
      challenge,
    )
  } catch (e) {
    console.log(e);
    return new ServiceResponseFailure(
      new DBOperationException()
    )
  }
}
export const getChallengeTestsById = async (challengeId) => {
  try {
    const challenge = await Challenge.findById(challengeId)

    if (!challenge) return ServiceResponseFailure(
      new ResourceNotFoundException(
        'Challenge not found',
      )
    )
    return new ServiceResponseSuccess({
      func_name: challenge.func_name,
      tests: challenge.tests
    }) 

  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(
      new DBOperationException()
    )
  }
}

export const getChallengesByCategorie = async (categorie) => {
  try {
    const challenges = await Challenge.find({ categorie: categorie });
    return new ServiceResponseSuccess(
      challenges,
    )
  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(
      new DBOperationException()
    )
  }
}


const getChallengeStatus = async (coder_id, challenge_id) => {
  // Search in submissions
  const accpetedSubmission = await Submission.findOne({
    coder: coder_id,
    challenge: challenge_id,
    isPassed: true,
  }).exec()
  if (accpetedSubmission) return 'Completed'
  const attemptedSubmission = await Submission.findOne({
    coder: coder_id,
    challenge: challenge_id,
    isPassed: false,
  }).exec()
  if (attemptedSubmission) return 'Attempted'
  return 'Waiting'
}

const mergeStatus = async (challenges, coder_id) => {
  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i].toObject()
    challenge['status'] = await getChallengeStatus(challenge._id, coder_id)
    challenges[i] = challenge
  }
  return challenges
}