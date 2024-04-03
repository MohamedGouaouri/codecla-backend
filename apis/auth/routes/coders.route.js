import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Coder } from '../models/Coder.js'
import { roles } from '../../middlewares/auth/roles.js'
import { authorize } from '../../middlewares/auth/authorize.middleware.js'
import {fireBaseUpload, supabaseUpload, upload} from "../../common/upload.js";
import {getCoderRank} from "../../grading/services/leaderboard.service.js";
import delay from "delay";
import {sendVerificationMail} from "../../common/mail.js";


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
    let user = await Coder.findById(id).select(['-__v', '-_id']).exec();
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Coder not found'
      })
    }
    // Get user rank
    const rank = await getCoderRank(id)
    user = user.toObject()
    user['rank'] = rank
    return res.status(200).json({
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
    const salt = await bcrypt.genSalt(parseInt(process.env.ROUNDS || 10));
    const hashPassword = await bcrypt.hash(password, salt)
    try {
      const coder  = await Coder.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashPassword,
      })
      const token = jwt.sign({
        id: coder._id,
        role: roles.Coder
      }, 'secret', {
        expiresIn: '1d'
      })
      const url = `http://localhost:3000/auth/coder/verify/${token}`
      sendVerificationMail(email, url)
      res.json({
        status: "success",
        message: "coder registered successfully, a confirmation email is sent to you, please check your inbox!"
      })
    } catch (e) {
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


// TODO: Add validator
codersRouter.put("/profile", authorize([roles.Coder]), upload.single('avatar'), async (req, res) => {
  const {id} = req.user
  try{
    const downloadUrl = await supabaseUpload(req)
   // Search for coder
    const coder = await Coder.findById(id).select('-__v').exec()
    if (!coder) {
      return res.status(404).json({
        status: "error",
        message: `No coder found`
      })
    }
    const {first_name, last_name, about} = req.body
    if(downloadUrl) coder.avatar_url  = downloadUrl
    if (first_name) coder.first_name = first_name
    if (last_name) coder.last_name = last_name
    if (about) coder.about = about

    await coder.save()
    return res.json({
      status: "success",
      message: "coder profile updated",
      data: coder
    })
  }catch (e) {
    res.status(500).end()
  }
});


codersRouter.post("/verify/:token", async (req, res) => {
  const {token} = req.params;
    try {
      jwt.verify(token, 'secret', async (err, user) => {
        if (err) {
          return res.status(400).send('Invalid token')
        }
        const {id} = user
        const coder = await Coder.findById(id).exec()
        if (!coder) {
          return res.status(400).send('Bad request')
        }
        coder.is_verified = true
        await coder.save()
        // TODO: Update this to html template
        return res.status(200).send('Email confirmed')
      })
    } catch (e) {
      res.status(500).json({
        status: "error",
        message: "Couldn't create the coder",
        error: e.message,
      })
    }
})


export default codersRouter;