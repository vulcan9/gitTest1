
/**
 * Module dependencies.
 */

var express = require('express')

	, routes = require('./routes') // ./routes/index 와 같음
	, user = require('./routes/user')
	//, main = require('./routes/main')
	
	, http = require('http')
	, path = require('path')
	, socketio = require('socket.io');

//--------------------------
// Express 설정
//--------------------------

var app = express();

// all environments
app.configure(
	function()
	{
		app.set('port', process.env.PORT || 3000); // 포트 설정
		app.set('views', __dirname + '/views'); // 뷰 디렉토리 설정
		app.set('view engine', 'jade'); // 뷰 엔진 설정(ejs, Jade)

		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router); // 라우터 설정(요청에 따라 응답을 결정)
		app.use(express.static(path.join(__dirname, 'public'))); // 정적 디렉토리 설정
	}
);

/*
// development only
if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
}
*/

app.configure(
	'development',
	function()
	{
		app.use(express.errorHandler());
	}
);

//--------------------------
//라우팅
//--------------------------

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/main', routes.main); // '/main' 으로 접속하면 routes 모듈의 main()메서드가 실행되도록함

//--------------------------
// 서버 생성
//--------------------------

var server = http.createServer(app);

//--------------------------
// 소켓 연결
//--------------------------

var io = socketio.listen(server);

///////////////////////////////////////////////////////
// 
// 동작 구현
//
///////////////////////////////////////////////////////

// 사용자 저장
var users = {};
// 사용자의 수
var user_count = 0;
// 순서 (차례)
var turn_count = 0;

io.sockets.on(
		'connection',
		function(client)
		{
			// 사용자 접속
			client.on(
					'join',
					function (data)
					{
						var username = data.username;
						client.username = username;
						
						console.log("join : " + user_count + " - " + username);
						
						users[user_count] = {};
						users[user_count].name = username;
						users[user_count].turn = false;
						
						// 사용자 목록(데이터) 업데이트
						io.sockets.emit('update_users', users);
						
						user_count++;
					}
			);
			
			// 게임 시작
			client.on(
					'game_start',
					function (data)
					{
						// 게임 시작을 알림
						client.broadcast.emit('game_started', data);
						
						// 처음 순서 지정
						console.log("처음 순서 지정 - " + turn_count);
						console.log(users[turn_count]);
						
						users[turn_count].turn = true;
						
						// 사용자 목록(데이터) 업데이트
						io.sockets.emit('update_users', users);
					}
			);
			
			// 숫자를 선택할 때 발생되는 이벤트 처리
			client.on(
					'select',
					function (data)
					{
						client.broadcast.emit('check_number', data);
						
						// 현재 사용자의 턴 종료
						users[turn_count].turn = false;
						
						turn_count++;
						if(turn_count >= user_count){
							turn_count = 0;
						}
						
						// 새로운 사용자의 턴 시작
						users[turn_count].turn = true;

						// 사용자 목록(데이터) 업데이트
						io.sockets.emit('update_users', users);
					}
			);
			
			// 사용자 접속 종료
			client.on(
					'disconnect',
					function (data)
					{
						delete users[client.username];
						
						io.sockets.emit('update_users', users);
						user_count--;
					}
			);
		}
);

server.listen(
		app.get('port'), 
		function()
		{
			console.log('* Express server listening on port ' + app.get('port'));
		}
	);

	// POST 방식 예제
	// http://www.nodebeginner.org/index-kr.html#how-to-not-do-it

	// 게임종료 및 채팅 추가
	// http://archer0001.blog.me/110166892672

console.log('* Server running at http://localhost:'+app.get('port'));

// 브라우져 테스트
// http://localhost:3000/main?username=test1
// http://localhost:3000/main?username=test2
















