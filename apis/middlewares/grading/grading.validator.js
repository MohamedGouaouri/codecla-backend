import Joi from 'joi'

// Define the schema for the submission object
const submissionSchema = Joi.object({
    lang: Joi.string().valid('py', 'js').required(),
    code: Joi.string().required(),
    challenge_id: Joi.string().required(),
});

export function validateSubmission(req, res, next) {
    const { error } = submissionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'error', message: 'Validation error', error: error.details[0].message });
    }
}