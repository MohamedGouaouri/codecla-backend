import mongoose from 'mongoose'
import { codeTextSchema } from '../../challenges/models/Challenge.js';

const submissionSchema = new mongoose.Schema({
    coder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coder'
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
    },
    code: codeTextSchema,
    submittedAt: {
        type: Date,
        default: new Date()
    },
    grade: {
        type: Number,
        default: 0,
    },
    isPassed: {
        type: Boolean,
        default: false,
    }
})

export const Submission = mongoose.model('Submission', submissionSchema);