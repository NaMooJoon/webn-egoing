var http = require('http');
var cookie = require('cookie'); 
http.createServer(function(request, response){
    var cookies = {};
    if(request.headers.cookie !== undefined)
        cookies = cookie.parse(request.headers.cookie);
    console.log(cookies);
    // Session cookies 만들기
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`, 
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie'
        ]
    });

    response.end('Cookie!!');
}).listen(3002);