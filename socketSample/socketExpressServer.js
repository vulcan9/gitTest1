var express = require('express')
, http = require('http')
, fs = require('fs');

var app = express();

//var server = http.createServer(handler)
var server = http.createServer(app)
, io = require('socket.io').listen(server);

server.listen(80);

//-------------------------------
//서버 연결
//-------------------------------

app.get('/', function (req, res){
	res.sendfile(__dirname + '/client.html');
});

/*
function handler(req, res)
{
	console.log('server ok');
	
	// 파일 읽기
	fs.readFile(
		__dirname + '/client.html',
		function (err, data)
		{
			if(err){
				res.writeHead(500);
				return res.end('Error loading client.html');
			}
			
			// 브라우져 출력
			res.writeHead(200, {'Content-Type':'text/html'});
			res.end(data);
			//res.end("<h1>Hello node.js---<h1>");
		}
	);
}
*/

//-------------------------------
//소켓 연결
//-------------------------------

// socket 이 아니라 sockets 임에 주의
io.sockets.on(
		'connection',
		function(socket)
		{
			// 'news' 메세지 발송
			socket.emit(
					'news',
					{hello:'world'}
				);
			
			// 메세지 수신
			socket.on(
					'my other event',
					function (data)
					{
						console.log('server : ', data);
					}
				);
		}
	);


//-------------------------------
//POST 방식으로 받은 요청 처리하기
//-------------------------------

app.post(
	'/upload',
	function (req, response){
		console.log("Request handler 'upload' was called.");
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello Upload");
		response.end();
	}
);

