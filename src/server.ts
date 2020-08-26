import { User } from './models/user';
import 'reflect-metadata';

require('dotenv-flow').config({
  path: './src/config/env-files',
  node_env: process.env.NODE_ENV || 'development'
});

import http from 'http';
import express from 'express';
import config from './config';
import { DatabaseManager } from './models/index';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from "./api";
import cors from "cors";
import { corsOptions } from './middleware/common';

const passportSetup = require("./config/passport-setup");
const cookieSession = require('cookie-session');
const passport = require('passport');


const { PORT = 3001 } = config;

process.on('uncaughtException', e => {
  console.log(e);
  process.exit(1);
});
process.on('unhandledRejection', e => {
  console.log(e);
  process.exit(1);
});

DatabaseManager.init().then(() => {
  console.info('TypeORM connecting successfully...');

  const router = express();

  router.use(cookieSession({
    keys: "key@123",
    maxAge: 24 * 60 * 60 * 1000,
    cookie: {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }
  }))

  router.use(passport.initialize());
  router.use(passport.session());
  router.use(cors(corsOptions)); //{ origin: ['http://localhost:4200'], credentials: true }

  router.use(bodyParser.json());
  router.use(cookieParser(process.env.COOKIE_SECRET));
  router.use("/", routes);

  const server = http.createServer(router);
  server.listen(PORT, () =>
    console.log(`Server is running at port:  ${PORT}`),
  );
}).catch(error => {
  console.error('TypeORM connection error: ');
  console.error(error);
  DatabaseManager.close().then(() => console.info('TypeORM connection close successfully.'));
});