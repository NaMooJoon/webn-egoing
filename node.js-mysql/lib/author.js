var db = require('./db.js');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) { throw error; }
        db.query(`SELECT * FROM author`, function(error2, author){
            if(error2) { throw error; }
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            <form action="/author/create_process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            <h2>${title}</h2>
            ${template.authorTable(author)}
            <style>
                table{
                    border-collapse:collapse;
                }
                td{
                    border:1px solid  black;
                }
            </style>
            `,
            ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        /*
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
        })
        */
        db.query(`
            INSERT INTO author (name, profile) 
            VALUES(?, ?)`,
            [post.name, post.profile], 
            function(error, result){
            if(error) { throw error; }
                response.writeHead(302, {Location: `/author`});
                response.end();
        });
    });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) { throw error; }
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) { throw error2; }
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author){
                var title = 'author-update';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `
                <form action="/author/update_process" method="post">
                <p><input type="hidden" name="id" value=${author[0].id}></p>
                    <p><input type="text" name="name" placeholder="name" value=${author[0].name}></p>
                    <p>
                        <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                <h2>${title}</h2>
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse:collapse;
                    }
                    td{
                        border:1px solid  black;
                    }
                </style>
                `,
                ``
                );
                response.writeHead(200);
                response.end(html);
            });
        }); 
    });
}


exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        /*
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
        })
        */
        db.query(`
            UPDATE author SET name=?, profile=? 
            WHERE id=?`,
            [post.name, post.profile, post.id], 
            function(error, result){
            if(error) { throw error; }
                response.writeHead(302, {Location: `/author`});
                response.end();
        });
    });
}


exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
        DELETE FROM author WHERE id=?`,[post.id] ,
        function(error, result){
        if(error) { throw error; }
        response.writeHead(302, {Location: `/author`});
        response.end();
        });
    });
}