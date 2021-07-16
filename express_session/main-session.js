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

app.use(bodyParser.urlencoded({ extended: false }))
// compress responses
app.use(compression())
app.use(session({
  //secure: true // https로만 이용 가능
  //HttpOnly: true // JavaScript로 데이터 훔치는 거 방지
  store: new FileStore(),
  secret: 'keyboard dog',
  resave: false,    // session이 항상 저장될지 여부를 정하는 값
  saveUninitialized: true   // Session이 필요할 때만 구동시킨다.
}))

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
