const fs = require('fs');
const template = require('../lib/template.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var authData = {
    email:'jjag1015',
    password:'1111',
    nickname:'Joon'
}

router.get('/login', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p>
            <input type="password" name="pwd" placeholder="password">
        </p>
        <p>
            <input type="submit" value='login'>
        </p>
        </form>
    `, '');
    response.send(html);
});

router.post('/login_process', function(request, response){
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password){
        //success
        console.log(request.session);
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        console.log(request.session);
        request.session.save(function(err) {
            if(err) {
              res.end('session save error: ' + err)
              return
            }
            response.redirect('/')
        });
        //response.send('Hello');
    }else{
        response.send('Who?');
    } 
});

router.get('/logout', function(request, response){
    request.session.destroy(function(err){
        response.redirect('/');
    });
});
  
module.exports = router;