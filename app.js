require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("cookie-session");
const bodyParser = require("body-parser");
// var indexRouter = require('./routes/index');
var passport = require("passport")
const flash = require("connect-flash");
var mongoose = require("mongoose")
const localstrategy = require("passport-local");
// var usersRouter = require('./routes/users');

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const artistRoutes = require("./routes/artist");


const http = require("http").Server(app);
const io = require("socket.io");
// Socket config

const socket = io(http);

socket.on("connection", (socket)=>{
    console.log("user connected");
    socket.on("disconnect", ()=> {
    console.log("user disconnected")
    })
});


var app = express();
mongoose.connect(
  "mongodb://localhost/musicala",
  { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
  err => {
      if(!err) console.log("connected successfully");
  }
);


const auth = require("./middleware/authentication");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const keys = ["Ron", "Swanson"];
const expiryDate = new Date(5 * Date.now() + 60 * 60 * 1000); // 5 hours
// console.log(expiryDate);
app.use(
  session({
    secret: "musicala",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      expires: expiryDate
    },
    keys: keys
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.use('/', indexRouter);
// app.all("/users*", auth.isLoggedIn)
// app.use('/users', usersRouter);
app.use(userRoutes);
app.use(postRoutes);
app.use("/artist", artistRoutes);
app.use("/school",artistRoutes);
app.use("/college",artistRoutes);
app.use("/teacher", artistRoutes);
app.use("/studio", artistRoutes);
app.use("/company", artistRoutes);
app.use("/band", artistRoutes);
require("./config/passport")(passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
