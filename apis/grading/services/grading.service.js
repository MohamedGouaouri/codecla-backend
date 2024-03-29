/**
 Submission:
{
    "code": "def factorial(n):\n\tif n == 0: return 1 \n\treturn n * factorial(n-1)",
    "challenge_id": "1112546548798"
}
*/
import axios from 'axios'
import { Challenge } from "../../challenges/models/Challenge.js";
import { PY_RCE_SERVER, JS_RCE_SERVER } from '../../../config/server.config.js';
import { ServiceResponseFailure, ServiceResponseSuccess } from '../../common/service_response.js';
import { ResourceNotFoundException, SubmissionFailedException } from '../../common/exceptions.js';
import { Submission } from '../models/submission.model.js';
import {Coder} from "../../auth/models/Coder.js";
import {getCoderRank, getCoderScore} from "./leaderboard.service.js";

export const grade = async (submission, coder_id) => {
    /**
     * Get challenge object
     * Invoke RCE service
     * if all tests are passed then
     *      - Calculate score based on the optimal code (low running time)
     *      - Add to leaderboard
     * end
     */
    const {challenge_id, code, lang} = submission;
    try {
        const challenge = await Challenge.findById(challenge_id);
        if (challenge) {
            const {code: challenge_code, tests} = challenge;
            const {function_name: func_name} = challenge_code
            // Search for an exising passed submission
            if (await Submission.findOne({
                coder: coder_id,
                challenge: challenge_id,
                isPassed: true
            }).exec()) {
                return new ServiceResponseFailure(
                    new SubmissionFailedException('You already passed this challenge')
                );
            }

            const submission = new Submission({
                coder: coder_id,
                challenge: challenge_id,
                code: {
                    text: code,
                    language: lang,
                }
            })
            // Save submission
            await submission.save()

            // Call rce to grade submission
            const rceReq = {
                lang,
                code,
                func_name,
                tests
            }
            // Invoke rce
            let rceResp
            switch (lang) {
                case 'py':
                    rceResp = await (await axios.post(PY_RCE_SERVER, rceReq)).data
                    break;
                case 'js':
                        rceResp = await (await axios.post(JS_RCE_SERVER, rceReq)).data
                        break;
                default:
                    return new ServiceResponseFailure(
                        new SubmissionFailedException('Non supported language')
                    );
            }


            if (allTestsPassed(rceResp)) {
                const score = await calculateScore(challenge, rceResp)
                submission.isPassed = true
                submission.grade = score
                submission.code = {
                    language: lang,
                    text: code,
                }
                await submission.save()
                // Update coder rank
                await Coder.findByIdAndUpdate(coder_id, {
                    $inc: {
                        'score': score
                    }

                }).exec()
                return new ServiceResponseSuccess(
                    {
                        passed: true,
                        score,
                    }
                )
            }
            if (rceResp.message) {
                return new ServiceResponseFailure(
                    new SubmissionFailedException(rceResp.message)
                )
            }
            return new ServiceResponseFailure(
                new SubmissionFailedException('Some tests have failed, Try a new submission')
            )
        }
        return new ServiceResponseFailure(
            new ResourceNotFoundException('No challenge found')
        )
    } catch (error) {
        return new ServiceResponseFailure(
            new ResourceNotFoundException('Can not grade your submission')
        )
    }
}

const allTestsPassed = (rceResp) => {
    return rceResp && rceResp.status === 'passed'
}

const calculateScore = async (challenge, rceResp) => {
    const {test_results} = rceResp;
    let score = 0
    for (const test_result of test_results) {
        const {test_id} = test_result;
        const weight = await getTestWeight(challenge, test_id)
        score += weight * 100;
    }
    return Math.round(score)
}

const getTestWeight = async (challenge, test_id) => {
    const test = challenge.tests.find((t) => t._id.toHexString() === test_id)
    if (!test) {
        throw new ResourceNotFoundException('Test not found')
    }
    return test.weight || 0
}