var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); 
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');



var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = url.parse(_url, true).pathname;
    
    
    if(pathname === '/'){
      if(queryData.get('id') === null){
        
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = "Hello, Node.js"; 
          var list = template.List(filelist);
          var html = template.HTML(title,list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`); 
          response.writeHead(200); 
          response.end(html);
        });
      }else {
        fs.readdir('./data', function(error, filelist){ 
          fs.readFile(`data/${queryData.get('id')}`, 'utf8', function(err, description){
            var title = queryData.get('id');
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            var list = template.List(filelist);
            var html = template.HTML(title,list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a> 
               <a href="/update?id=${sanitizedTitle}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
               </form>
               `); 
            response.writeHead(200); 
            response.end(html);    
          });
        });
      }
    } else if(pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
          console.log(filelist);
          var title = 'WEB - create';
          var list = template.List(filelist);
          var html = template.HTML(title,list,`
            <form action="/create_process" method="post">
              <p><input type='text' name="title" placeholder="title"></p>
              <p>
                  <textarea name="description" placeholder="description">
                  </textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
          `, ''); 
          response.writeHead(200); 
          response.end(html);
        });
    } else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`}); 
            response.end();
          });
        });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){ 
          fs.readFile(`data/${queryData.get('id')}`, 'utf8', function(err, description){
            var title = queryData.get('id');
            console.log(title);
            var list = template.List(filelist);
            var html = template.HTML(title,list,
              `
              <form action="/update_process" method="post">
              <input type='hidden' name='id' value='${title}'>
              <p><input type='text' name="title" placeholder="title" value="${title}"></p>
              <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`); 
            response.writeHead(200); 
            response.end(html);    
          });
      });
    } else if(pathname === '/update_process'){
      var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;

          fs.rename(`data/${id}`, `data/${title}`, function(err) {
            if (err) return console.log(err);
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`}); 
              response.end();
            });
          });
          
        });
    } else if(pathname === '/delete_process'){
      var body = '';
        request.on('data', function(data){
          body = body + data;
        });
        request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          
          fs.unlink(`data/${id}`, function(error){
            if(error) console.log(error);
            response.writeHead(302, {Location: `/`}); 
            response.end();
          })
        });
    }else {
      response.writeHead(404); 
      response.end('Not found');;
    }

});
app.listen(3000);