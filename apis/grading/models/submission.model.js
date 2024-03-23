import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
    coder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coder'
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
    },
    submittedAt: {
        type: Date,
        default: new Date()
    },
    grade: {
        type: Number,
    },
    isPassed: {
        type: Boolean,
        default: false,
    }
})

export const Submission = mongoose.model('Submission', submissionSchema);