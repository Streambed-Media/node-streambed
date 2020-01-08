const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const logOutRouter = require('./routes/logout');

var app = express();

const {
  NODE_ENV, MONGO_URL, SESS_LIFE, SESS_NAME, SESS_SECRET
} = process.env

console.log( NODE_ENV, MONGO_URL, SESS_LIFE , SESS_NAME, SESS_SECRET)

const partialsPath = path.join(__dirname, './partials');
hbs.registerPartials(partialsPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: SESS_NAME,
  //Dont save back to store
  resave: false,
  //Don't save any new sessions without any data in it
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
      maxAge: +SESS_LIFE,
      sameSite: true,
      secure: false
    }
  })
);

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/logout', logOutRouter);

//! ROUTE LOGOUT TESTING HERE
app.post('/', (req, res) => {
  req.session.destroy((err) => {
    console.log(req.session);
    res.clearCookie(req.session);
    req.session = null;
    res.redirect('/');
  });
});
//!

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
