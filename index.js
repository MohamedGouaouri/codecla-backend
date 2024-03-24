import express from 'express';
import { connectDatabase } from './config/db.config.js';
import contentRouter from "./apis/challenges/routes/challenge.route.js";
import dotenv from 'dotenv'
import authRouter from './apis/auth/routes/auth.router.js';
import gradingRouter from './apis/grading/routes/grader.route.js';
import { PORT } from './config/server.config.js';

const app = express();
dotenv.config();
app.get("/", (req, res) => {
  res.send("server running");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter)
app.use("/api/challenges", contentRouter)
app.use("/api/grading", gradingRouter);
// connect to the database
connectDatabase().then(r => {
  app.listen(PORT, (_) =>
      console.log(`Server up and running on port ${PORT}`)
  );
});






