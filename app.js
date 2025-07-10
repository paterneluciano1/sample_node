const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const env = require('./config');

const homeRouter = require('./routes/home');
const checkoutRouter = require('./routes/checkout');
const paymentRouter = require('./routes/payment');
const webhookRouter = require('./routes/webhook');
const callbackRouter = require('./routes/callback');

const app = express();

/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.locals.title = env.projectName;
  next();
});

/**
 * Define Routes
 */
app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/checkout', checkoutRouter);
app.use('/payment', paymentRouter);
app.use('/webhook', webhookRouter);
app.use('/callback', callbackRouter);

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
