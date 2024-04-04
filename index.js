import express from 'express';
import { connectDatabase } from './config/db.config.js';
import contentRouter from "./apis/challenges/routes/challenge.route.js";
import dotenv from 'dotenv'
import authRouter from './apis/auth/routes/auth.router.js';
import gradingRouter from './apis/grading/routes/grader.route.js';
import { PORT } from './config/server.config.js';
import cors from 'cors'
import morgan from 'morgan';
import expressGraphql from 'express-graphql'
import {root, schema} from "./apis/graphql/index.js";
import {authorize} from "./apis/middlewares/auth/authorize.middleware.js";
import {roles} from "./apis/middlewares/auth/roles.js";

const app = express();
dotenv.config();
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

app.use('/graphql', authorize([roles.Coder, roles.Manager]), expressGraphql.graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))
// connect to the database
connectDatabase().then(r => {
  app.listen(PORT, (_) =>
      console.log(`Server up and running on port ${PORT}`)
  );
});






