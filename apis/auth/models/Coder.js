import mongoose from 'mongoose'


const CoderSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: false },
    last_name: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    about: { type: String, required: false, default: '' },
    rank: { type: Number, required: false },
    avatar_url: { type: String, required: false, default: '' },
}, {
    collection: "coders"
})


export const Coder = mongoose.model("Coder", CoderSchema)
