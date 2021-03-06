var http = require('http');

var server = http.createServer(handler)
, io = require('socket.io').listen(server)
, fs = require('fs');

server.listen(80);

//-------------------------------
// 서버 연결
//-------------------------------

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
			
			/*
			//console.log('server : ', socket);
			socket.broadcast.emit(
					'user connect',
					{broadcast:'message'}
				);
			*/
		}
	);

/*

클라이언트측 콘솔 출력
Object {hello: "world"} 

서버측 로그 출력

vulcan@HOME-PC /d/nodeJS/project/socketSample
$ nodemon socketServer.js
28 Jul 02:39:49 - [nodemon] v0.7.8
28 Jul 02:39:49 - [nodemon] to restart at any time, enter `rs`
28 Jul 02:39:49 - [nodemon] watching: D:\nodeJS\project\socketSample
28 Jul 02:39:49 - [nodemon] starting `node socketServer.js` 
   info  - socket.io started
server ok
   debug - served static content /socket.io.js
   debug - client authorized
   info  - handshake authorized GoLAzWK6vMj5iPvmNwiv
server ok
   debug - setting request GET /socket.io/1/websocket/GoLAzWK6vMj5iPvmNwiv
   debug - set heartbeat interval for client GoLAzWK6vMj5iPvmNwiv
   debug - client authorized for
   debug - websocket writing 1::
   debug - websocket writing 5:::{"name":"news","args":[{"hello":"world"}]}
{ my: 'data' }

*/

