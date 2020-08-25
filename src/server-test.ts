import 'reflect-metadata';

require('dotenv-flow').config({
    path: './src/config/env-files',
    node_env: process.env.NODE_ENV || 'development'
});

import routes from './api';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const cookieSession = require('cookie-session');

process.on('uncaughtException', e => {
    console.log(e);
    process.exit(1);
});
process.on('unhandledRejection', e => {
    console.log(e);
    process.exit(1);
});

const router = require('express')();

router.use(cookieSession({
    keys: "key@123",
    maxAge: 24 * 60 * 60 * 1000
}))
router.use(bodyParser.json());
router.use(cookieParser(process.env.COOKIE_SECRET || '@Hung123'));
router.use("/", routes);
console.log(process.env.JWT_SECRET);


export default router;