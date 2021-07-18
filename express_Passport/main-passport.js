const express = require('express')
const app = express()
const fs = require('fs');
var bodyParser = require('body-parser')
var compression = require('compression')
app.use(express.static('public'))
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash')

app.use(bodyParser.urlencoded({ extended: false }))
// compress responses
app.use(compression())

app.use(flash());
app.use(session({
  //secure: true // https로만 이용 가능
  //HttpOnly: true // JavaScript로 데이터 훔치는 거 방지
  store: new FileStore(),
  secret: 'keyboard dog',
  resave: false,    // session이 항상 저장될지 여부를 정하는 값
  saveUninitialized: true   // Session이 필요할 때만 구동시킨다.
}))

var authData = {
  email:'jjag1015',
  password:'1111',
  nickname:'Joon'
};

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  console.log('user.email: ', user.email);
  done(null, user.email);
  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, id);
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

passport.use('local-join', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    console.log('LocalStrategy', username, password);
    if(username === authData.email){
      if(password === authData.password){
        console.log(3);
        return done(null, authData);
      }else{
        console.log(2);
        return done(null, false, { message: 'Incorrect password.' });
      }
    } else{
      console.log(1);
      return done(null, false, { message: 'Incorrect ID.' });
    }
    /*
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
    */
  }
));

app.post('/auth/login_process',
  passport.authenticate('local-join', {
    successRedirect: '/',               // 'local': 유저 아이디와 패스워드로 데이터 처리하겠다.
    failureRedirect: '/auth/login',
    failureFlash: true })
);

app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(3003, () => console.log('Example app listening on port 3003!'))
