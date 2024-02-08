import express from 'express';
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from 'cors';
import passport from "passport";
import passportConfig from "./util/auth.js";
import session from "express-session";
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
import indexRouter from "./routes/index.js";
import userRouter from "./routes/users.js";


// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(cors());
app.use("/axios", express.static(path.join(
    import.meta.dirname, "node_modules", "axios", "dist"
)));
// session
app.use(cookieParser());
app.use(session({
    secret: "RWmzrePkh3mkA3oFHmR+JCpl/8lDolml39sCVH/44aiKsNC0",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(passport.authenticate("session"));
app.use(passportConfig(passport));
app.use('/', indexRouter);
app.use('/users', userRouter);


export default app;
