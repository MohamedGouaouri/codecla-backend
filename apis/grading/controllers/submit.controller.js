import { validateSubmission } from "../../middlewares/grading/grading.validator.js"
import { grade } from "../services/grading.service.js"

export const submitController = async (req, res) => {
    const submission = req.body
    // TODO: Validate submission
    await validateSubmission(req, res)
    // Grade the submission
    const {id: coder_id} = req.user
    const response= await grade(submission, coder_id)
    return res.status(response.getHttpStatus()).json(response.getHttpResponse());
}