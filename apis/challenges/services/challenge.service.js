import { DBOperationException, ResourceNotFoundException } from "../../common/exceptions.js";
import { ServiceResponseFailure, ServiceResponseSuccess } from "../../common/service_response.js";
import { Submission } from "../../grading/models/submission.model.js";
import { roles } from "../../middlewares/auth/roles.js";
import { Challenge } from "../models/Challenge.js";

export const getAll = async (user, filters) => {
  const { id, role } = user;
  const {category} = filters
  let challenges;
  let query = {}
  if (category && category != 'All') {
    query = {...query, category}
  }
  switch (role) {
    case roles.Manager:
      query = {...query, creator: id}
      challenges = await Challenge
        .find(query)
        .select(['title', 'category', 'description', 'level', 'creator'])
        .populate('creator')
        .exec();
      return new ServiceResponseSuccess(challenges || []);
    
    case roles.Coder:
      challenges = await Challenge
        .find(query)
        .select(['title', 'category', 'description', 'level', 'creator'])
        .exec();

      challenges = challenges ? challenges.map(challenge => challenge.toObject()) : [];
      challenges = challenges ? await mergeStatus(challenges, id) : [];
      challenges = challenges ? await mergeRate(challenges) : [];

      return new ServiceResponseSuccess(challenges);
  
    default:
      return new ServiceResponseSuccess([]);
  }
};

export const createChallenge = async (challenge, creator) => {
  try {
    const newChallenge = new Challenge(challenge);
    newChallenge.creator = creator;
    await newChallenge.save();
    return new ServiceResponseSuccess(newChallenge, true);
  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(new DBOperationException());
  }
};

export const getChallengeById = async (challengeId) => {
  try {
    const challenge = await Challenge.findById(challengeId, '-__v');
    if (!challenge)
      return new ServiceResponseFailure(new ResourceNotFoundException('Challenge not found'));
    return new ServiceResponseSuccess(challenge);
  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(new DBOperationException());
  }
};

export const getChallengeTestsById = async (challengeId) => {
  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return new ServiceResponseFailure(new ResourceNotFoundException('Challenge not found'));
    return new ServiceResponseSuccess({ func_name: challenge.func_name, tests: challenge.tests });
  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(new DBOperationException());
  }
};

export const getChallengesByCategory = async (category) => {
  try {
    const challenges = await Challenge.find({ category });
    return new ServiceResponseSuccess(challenges);
  } catch (e) {
    console.error(e);
    return new ServiceResponseFailure(new DBOperationException());
  }
};

export const getAllCategories = async () => {
  return new ServiceResponseSuccess(
      await Challenge.distinct('category')
  )
}

export const getTrendingCategories = async () => {
  // const categories = await Challenge.distinct('category')
  const aggregatedCategoryStats = await Submission.aggregate([
    {
      $match: { isPassed: true } // Filter for passed submissions
    },
    {
      $lookup: {
        from: "challenges", // Assuming the collection name is "challenges"
        localField: "challenge",
        foreignField: "_id",
        as: "challengeDetails"
      }
    },
    {
      $unwind: "$challengeDetails"
    },
    // Group by challenge category and count the passed submissions
    {
      $group: {
        _id: "$challengeDetails.category",
        count: { $sum: 1 }
      }
    },
    {
      $addFields: {
        category: "$_id"
      }
    },
    // Sort by total passed submissions in descending order
    {
      $sort: { totalPassedSubmissions: -1 }
    },
    {
      $project: {
        _id: 0,
        category: 1,
        count: 1,
      }
    }
  ]).exec();
  return new ServiceResponseSuccess(aggregatedCategoryStats)
}


const getChallengeStatus = async (coderId, challengeId) => {
  const acceptedSubmission = await Submission.findOne({ coder: coderId, challenge: challengeId, isPassed: true }).exec();
  if (acceptedSubmission) return 'Completed';
  
  const attemptedSubmission = await Submission.findOne({ coder: coderId, challenge: challengeId, isPassed: false }).exec();
  if (attemptedSubmission) return 'Attempted';
  
  return 'Waiting';
};

const getChallengeSolutionRate = async (challengeId) => {
  const sumbissions = await Submission.find({
    challenge: challengeId,
    isPassed: true,
  }).exec()
  return sumbissions.length
}

const mergeStatus = async (challenges, coderId) => {
  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i];
    challenge['status'] = await getChallengeStatus(challenge._id, coderId);
    challenges[i] = challenge;
  }
  return challenges;
};

const mergeRate = async (challenges) => {
  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i];
    challenge['solution_rate'] = await getChallengeSolutionRate(challenge._id);
    challenges[i] = challenge;
  }
  return challenges;
};