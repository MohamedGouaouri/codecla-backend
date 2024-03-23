
import mongoose from 'mongoose'
const ManagerSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, {
    collection: "managers"
})


export const Manager = mongoose.model("Manager", ManagerSchema)
