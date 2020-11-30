const http = require('http');
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring");

const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8');
const style_css = fs.readFileSync('./style.css', 'utf8');


var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

// ここまでメインプログラム

//  createServerの処理
function getFromClient(request, response) {
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname){

        case '/':
            response_index(request, response);
            break;

        case '/other':
            response_other(request, response);
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

// 追加するデータ用変数
var data = {
    'Splunk': '$100,000,000',
    'Fluentd': '$200,000',
    'Elastick Search': '$150,000',
    'Kibana': '$300,000',
};


// indexのアクセス処理
function response_index(request, response){
    var msg = "これはIndexページです。";
    var content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
    });
    response.writeHead(200, { 'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

// otherのアクセス処理
function response_other(request, response){
    var msg = "これはOtherページです。";
    var content = ejs.render(index_page, {
        title: "Index",
        content: msg,
    });

    // POSTアクセス時の処理
    if (request.method = 'POST') {
        var body = '';

        // データ受信のイベント処理
        request.on('data', (data) => {
            body += data;
        });

        // データ受信終了のイベント処理
        request.on('end', () => {
            var post_data = qs.parse(body);
            msg += 'あなたは「' + post_data.msg + '」と書きました。';
            var content = ejs.render(other_page, {
                title: "Other",
                content: msg,
            });
            response.writeHead(200, { 'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        });
    // GETアクセス時の処理
    } else {
        var msg = "ページがありません。";
        var content = ejs.render(other_page, {
            title: "Other",
            content: msg,
        });
    }
}
