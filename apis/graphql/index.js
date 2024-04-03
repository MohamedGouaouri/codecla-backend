import graphql from "graphql";
import {Manager} from "../auth/models/Manager.js";
import {getAll, getAllCategories, getChallengeById} from "../challenges/services/challenge.service.js";
import jwt from 'jsonwebtoken'

export const schema = graphql.buildSchema(`
    type Query {
        challenges(token: String!, category: String, level: String): [Challenge]
        challenge(token: String!, id:  String!): Challenge
        categories: [String]
    }
    type Coder {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        about: String
        score: Float!
        avatar_url: String
        is_verified: Boolean
    }
    type Manager {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
    }
    type FunctionInputDef {
      name: String!
      type: String
    }
    type FunctionInputValue {
      name: String!
      value: Float
    }
    
    type CodeText {
      text: String!
      language: String!
    }
    type TestCase {
      weight: Float!
      inputs: [FunctionInputValue!]!
      output: Float
    }
    type Code {
      function_name: String!
      code_text: [CodeText!]!
      inputs: [FunctionInputDef!]!
    }
    type Challenge {
      _id: ID!
      title: String!
      category: String!
      description: String!
      level: String!
      creator: Manager!
      code: Code!
      tests: [TestCase!]!
      createdAt: String!
      updatedAt: String!
      solution_rate: Float
      status: String
    }
    type Submission {
      _id: ID!
      coder: Coder!
      challenge: Challenge!
      code: CodeText!
      submittedAt: String!
      grade: Float!
      isPassed: Boolean!
    }
`)

export const root = {
    managers: async () => {
        return Manager.find().select('-__v').exec();
    },
    challenges: async (parent) => {
        const decoded = jwt.decode(parent.token)
        const response = await getAll({
            id: decoded.id,
            role: decoded.role,
        }, {
            category: parent.category,
            level: parent.level,
        })
        return response.data
    },
    challenge: async (parent, args, context, info) => {
        const decoded = jwt.decode(parent.token)
        const response = await getChallengeById(parent.id, {
            id: decoded.id,
            role: decoded.role,
        })
        return response.data
    },
    categories: async () => {
        const service_response = await getAllCategories()
        return service_response.data
    }
}
