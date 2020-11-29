const http = require('http');
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');


var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// ここまでメインプログラム

//  createServerの処理
function getFromClient(request, response) {
    var url_parts = url.parse(request.url);
    switch (url_parts.pathname){

        case '/':
            var content = ejs.render(index_page, {
                title: "Index",
                content: "これはテンプレートエンジンを使ったサンプルページです。",
            });
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
            break;
        
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(style_css);
            response.end();
            break;

        case '/images/anonymous.png':
            response.writeHead(200, {'Content-Type': 'image/png'});
            var photo01 = fs.readFileSync("images/anonymous.png","binary");
            response.end(photo01,"binary");
            break;

        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}