import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { roles } from '../../middlewares/auth/roles.js'
import { Manager } from '../models/Manager.js'

const managersRouter = express.Router();

managersRouter.post("/register", async (req, res) => {
    const data = req.body
  const validator = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const validationResult = validator.validate(data)
  if (!validationResult.error) {
    const { first_name, last_name, email, password } = req.body
    const salt = await bcrypt.genSalt(parseInt(process.env.ROUNDS | 10));
    const hashPassowrd = await bcrypt.hash(password, salt)
    try {
      await Manager.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashPassowrd
      })
      res.json({
        status: "success",
        message: "manager registered successfully"
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({
        status: "error",
        message: "Couldn't create the manager",
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


managersRouter.post("/login", async (req, res) => {
    const data = req.body
    const validator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })

  const validationResult = validator.validate(data)
  if (!validationResult.error) {
    const { email, password } = req.body
    const manager = await Manager.findOne({ email: email }).exec()
    if (!manager) {
      return res.status(404).json({
        status: "error",
        message: `No manager of email ${email} was found`
      })

    }
    // manager found
    // 1. Compare password
    console.log(manager)
    const passwordDoesMatch = await bcrypt.compare(password, manager.password)
    if (!passwordDoesMatch) {
      return res.status(401).json({
        status: "error",
        message: "Password is incorrect"
      })
    }

    // 2. Generate toke with role
    const token = jwt.sign({
      id: manager._id,
      role: roles.Manager
    }, process.env.JWT_SECRET | 'secret', {
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


export default managersRouter;