const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
const passport = require("passport");
require("./models/db");
require("./config/passport");

const app = express();

const gamesRouter = require('./routes/games');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.disable('x-powered-by');
app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/users', usersRouter);
 
app.use((req, res) => {
  res.status(404).json({ error: 'Page Not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res
      .status(401)
      .json({ 'message': err.message });
  }
  console.error(err.stack)
  res.status(500).json({ err: 'Something broke!' });
})

module.exports = app;
