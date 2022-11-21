const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');

const app = express();

const mongoDB = "mongodb+srv://admin:iww500maiww500m@cluster0.aagfox3.mongodb.net/shop?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // compile scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
