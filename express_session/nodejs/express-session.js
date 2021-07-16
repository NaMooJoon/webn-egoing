var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session);
//var fileStoreOptions = {};

var app = express()

// request의 property로 session이라는 객체를 추가해줌.
app.use(session({
  store: new FileStore(),
  secret: 'keyboard dog',
  resave: false,    // session이 수정되어도 일단 저장해둔다(?)
  saveUninitialized: true   // Session이 필요할 때만 구동시킨다.
}))
app.get('/', function (req, res, next) {
    if(req.session.num === undefined)
        req.session.num = 1;
    else    
        req.session.num ++;
    res.send(`View: ${req.session.num}`);
})

app.listen(3003, () => console.log('Example app listening on port 3003!'))