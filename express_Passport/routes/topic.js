const fs = require('fs');
const template = require('../lib/template.js');
var express = require('express');
var router = express.Router();
var path = require('path');
var sanitizeHtml = require('sanitize-html');
  
router.get('/create', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
    `, '');
    response.send(html);
});

router.post('/create', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
    });
    /*
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.redirect(`/page/${title}`);
        })
    });
    */
});


router.get('/update/:updateId', function(request, response, next){
    var filteredId = path.parse(request.params.updateId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err) {
        next(err);
        }else{
        var title = request.params.updateId;
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `
            <form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update?id=${title}">update</a>`
        );
        response.send(html);
        }
    });
});

router.post('/update', function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
        });
    });
});

router.post('/delete', function(request, response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
        response.redirect(`/`);
    });
});

router.get('/:topicId', function(request, response, next){
    var filteredId = path.parse(request.params.topicId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
        next(err);
        }else{
        var title = filteredId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
        }
    });
});


module.exports = router;