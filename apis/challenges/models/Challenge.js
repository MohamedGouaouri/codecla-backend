import mongoose from 'mongoose';
const functionInputDefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false,
  }
}, { _id : false })

const functionInputValueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: false,
  },
}, { _id : false })

const testCaseSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  inputs: [functionInputValueSchema],
  output: { type: Object },
}, { timestamps: true });


const codeSchema = new mongoose.Schema({
  function_name: {
    type: String, required: true,
  },
  code_text: {
    type: String, required: true,
  },
  inputs: [functionInputDefSchema],
})

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

  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'Manager',
  },

  code: codeSchema,
  tests: [testCaseSchema]
}, { timestamps: true });

export const Challenge = mongoose.model("Challenge", challengeSchema);
