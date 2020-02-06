require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const sendFloRouter = require('./routes/sendflo');
var app = express();

const { NODE_ENV, MONGO_URL, SESS_NAME, SESS_SECRET } = process.env;
const secure = NODE_ENV === 'production' ? true : false;

//This is used to avoid error with deprecated with findoneandupdate in the reset route
mongoose.set('useFindAndModify', false);

/**Put you DB path here, you can use this default path to host it local at this address */
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .catch((error) =>
    console.log('Mongoose Connection is not working, the Error: ', error)
  );

//Session to be persisted in Mongo
//* For reference: https://github.com/alex996/presentations/blob/master/express-session.md
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 30 * 60, //Time To Live is set to 30min if remember me isnt checked
      touchAfter: 24 * 3600 //Stops session from refreshing with API calls to server
    }),
    name: SESS_NAME,
    resave: false, //Dont save back to store
    saveUninitialized: false, //Don't save any new sessions without any data in it
    secret: SESS_SECRET,
    cookie: {
      sameSite: false,
      secure: false //production or development
    }
  })
);

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

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/sendFlo', sendFloRouter);

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
