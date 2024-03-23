import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Coder } from '../models/Coder.js'
import { roles } from '../../middlewares/auth/roles.js'
import { authorize } from '../../middlewares/auth/authorize.middleware.js'

const codersRouter = express.Router();

codersRouter.get('/profile', authorize([roles.Coder]) ,async (req, res, next) => {
  const {id} = req.user;
  if (!id) {
    return res.status(500).json({
      status: 'error',
      message: 'Could find coder id'
    })
  }
  try {
    const user = await Coder.findById(id).select(['-__v', '-_id']).exec();
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Coder not found'
      })
    }
    return res.status(404).json({
      status: 'success',
      data: user
    })
  } catch(error) {
    return res.status(500).json({
      status: 'error',
      message: 'Unexpected error happened',
      error: error.message,
    })
  }
  
});

codersRouter.post("/register", async (req, res) => {
  const data = req.body
  const validator = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const validationResult = validator.validate(data)
  if (!validationResult.error) {
    const { first_name, last_name , email, password } = req.body
    const salt = await bcrypt.genSalt(parseInt(process.env.ROUNDS | 10));
    const hashPassowrd = await bcrypt.hash(password, salt)
    try {
      await Coder.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashPassowrd,
        rank: await getLastCoderRank() + 1
      })
      res.json({
        status: "success",
        message: "coder registered successfully"
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({
        status: "error",
        message: "Couldn't create the coder",
        error: e.message,
      })
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "validation error",
      error: validationResult.error,
    })
  }
})


codersRouter.post("/login", async (req, res) => {
  const data = req.body
  const validator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  const validationResult = validator.validate(data)
  if (!validationResult.error) {
    const { email, password } = req.body
    const coder = await Coder.findOne({ email: email }).exec()
    if (!coder) {
      return res.status(404).json({
        status: "error",
        message: `No coder of email ${email} was found`
      })

    }
    // coder found
    // 1. Compare password
    console.log(coder)
    const passwordDoesMatch = await bcrypt.compare(password, coder.password)
    if (!passwordDoesMatch) {
      return res.status(401).json({
        status: "error",
        message: "Password is incorrect"
      })
    }

    // 2. Generate toke with role
    const token = jwt.sign({
      id: coder._id,
      role: roles.Coder
    }, 'secret', {
      expiresIn: 36000
    })

    // 3. Send token
    return res.json({
      status: "success",
      token
    })
  } else {
    res.status(401).json({
      status: "error",
      message: "validation error",
      error: validationResult.error,
    })
  }
})



const getLastCoderRank = async () => {
  const ranks = await Coder.find({}).select('rank',).sort({
    'rank': -1,
  }).exec();
  if (!ranks || ranks.length == 0) {
    return 1
  }
  return ranks[0].rank;
}

export default codersRouter;