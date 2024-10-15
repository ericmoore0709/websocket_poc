var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow only your Vite frontend
  methods: ['GET', 'POST'],         // Allow only specific HTTP methods
  credentials: true,                // Allow cookies or authentication headers
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(cors()); // This allows requests from any origin

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error
  res.status(err.status || 500);
  res.json({ 'error': err });
});

module.exports = app;
