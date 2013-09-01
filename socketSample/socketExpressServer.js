var express = require('express')
, http = require('http')
, fs = require('fs')
//, connect = require('connect')
, socketio = require('socket.io');

var app = express();
app.use(express.bodyParser());




//var server = http.createServer(handler)
var server = http.createServer(app)
var io = socketio.listen(server);

server.listen(80);

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
//서버 연결
//-------------------------------

app.get(
	'/', 
	function (req, res){
		res.sendfile(__dirname + '/client.html');
	}
);

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
//POST 방식으로 받은 요청 처리하기
// POST 방식 예제 (POST 요청 처리하기)
// http://www.nodebeginner.org/index-kr.html#how-to-not-do-it
//-------------------------------

app.post(
	'/upload',
	function (req, response){
		console.log("Request handler 'upload' was called.");
		response.writeHead(200, {"Content-Type": "text/plain"});
		
		
		// req.body.text or req.param('text') 로 전달된 변수 접근 가능 하다.
		// app.use(express.bodyParser()); 구문이 실행된 후 접근할 수 있다.
		var str = req.param('text');
		/*
		var data = req.body;
		for(var prop in data){
			str += "\n" + prop + " : " + data[prop];
		}
		*/
		
		//response.write("Hello Upload : " + req.data);
		response.write("Hello Upload : " + str);
		response.end();
	}
);


