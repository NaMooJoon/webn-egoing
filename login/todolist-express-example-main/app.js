const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const { sequelize } = require('./models');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];

sequelize
	.authenticate()
	.then(() => console.log('Connection Created!'))
	.catch((err) => { console.log(err); });
sequelize.sync({force: false});
const sessionStore = new mysqlStore({
	host: config.host,
	port: 3306,
	user: config.username,
	password: config.password,
	database: config.database
});

const app = express();
const router = require('./routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'my custom secret',
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		secure: false,
		httpOnly: false,
	},
}));

app.use('/', router);
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
