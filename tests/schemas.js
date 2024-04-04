const mongoose = require('mongoose');

const CoderSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: false },
    last_name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    about: { type: String, required: false, default: '' },
    score: { type: Number, required: true, default: 0 },
    avatar_url: { type: String, required: false, default: '' },
}, {
    collection: "coders"
})

const Coder = mongoose.model("Coder", CoderSchema)

const ManagerSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, {
    collection: "managers"
})

const Manager = mongoose.model("Manager", ManagerSchema)

const challengeSchema = new mongoose.Schema({
    title: {
        type: String, required: true,
    },
    category: {
        type: String, required: true,
    },
    description: {
        type: String, required: true,
    },
    level: {
        type: String, required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'Manager',
    },
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);

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
        default: 0,
    },
    isPassed: {
        type: Boolean,
        default: false,
    }
})

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = {
    Coder,
    Manager,
    Submission,
    Challenge
}