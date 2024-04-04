import express from 'express';
import contentRouter from "./apis/challenges/routes/challenge.route.js";
import dotenv from 'dotenv'
import authRouter from './apis/auth/routes/auth.router.js';
import gradingRouter from './apis/grading/routes/grader.route.js';
import cors from 'cors'
import morgan from 'morgan';
import env from "./env.js";

env(process.env['APP_ENV'])
const app = express();

app.get("/", (req, res) => {
    res.send("server running");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: '*'
}))
app.use(morgan('tiny'));
app.use("/api/auth", authRouter)
app.use("/api/challenges", contentRouter)
app.use("/api/grading", gradingRouter);

export default app