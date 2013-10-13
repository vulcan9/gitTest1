
/**
 * Module dependencies.
 */

var express = require('express')

	// ./routes/index.js 와 같음
	, routes = require('./routes')
	// ./routes/user.js 와 같음
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
		
		// 기본적으로 템플릿 엔진은 템플릿을 통해 렌더링된 내용을 body 변수에 담아 layout.[템플릿엔진명]으로 전달하게 된다.
		app.set('view engine', 'jade'); // 뷰 엔진 설정(ejs, Jade)
		// layout을 전역적으로 쓰지 않음
		//app.set('view options', { layout:false });
		
		/* Express 설정
		basepath : res.redirect()에서 사용되는 애플리케이션의 기본 경로가 되며 마운트되는 애플리케이션을 투명하게 처리합니다.
		views : CWD/views를 규정하는 뷰 파일의 라우트 경로를 정의합니다.
		view engine : 뷰에 사용될 기본 뷰 엔진의 이름을 정의합니다.
		view options : 뷰 전체 옵션을 지정하는 개체입니다.
		view cache : 뷰 캐싱을 활성화합니다(production 모드에서만 유효)
		case sensitive routes : 케이스에 민감한 라우팅을 사용합니다.
		strict routing : When enabled trailing slashes are no longer ignored
		jsonp callback : Enable res.send() / res.json() transparent jsonp support
		*/
		
		app.use(express.favicon());
		app.use(express.logger('dev'));
		
		// bodyParser 미들웨어를 사용하여 JSON을(또는 다른 데이터) 파싱하고 바디에 반환하는 방법입니다. 
		// 결과값은 req.body에 저장합니다:
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		
		app.use(app.router); // 라우터 설정(요청에 따라 응답을 결정). 이것을 사용하지 않으면 첫 번째 app.get()과 app.post() 등의 호출 경로를 마운트합니다.
		app.use(express.static(path.join(__dirname, 'public'))); // 정적 디렉토리 설정
	}
);

/*
app.configure(
	'development',
	function()
	{
		app.use(express.static(__dirname + '/public'));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		app.use(express.errorHandler());
	}
);

app.configure(
	'production', 
	function()
	{
		var oneYear = 31557600000;
		app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
		app.use(express.errorHandler());
	}
);

// 유사한 방법으로 사용자가 임의로 설정한 문자열을 사용하여 여러가지 환경을 만들수 있습니다:
app.configure(
	'stage', 'prod', 
	function(){
		// config
	}
);
*/

// 쉘에서 구동시킬때 입력
//$ NODE_ENV = production node app.js

/*
//development only
if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
}
*/

//--------------------------
//라우팅
//--------------------------

/*
Express의 라우팅 API는 HTTP 의미를 가지고있는 동사에 기초하였습니다. 
예를 들어 /users/12라는 경로는 사용자 계정정보를 표시할 때 다음과 같이 처리합니다. 
app.get()의 첫 번째 인수에있는 ":id" 플레이스홀더는 req.params 값으로 연결됩니다:

app.get(
	'/user/:id', // http://dev:3000/users/12
	function(req, res)
	{
		res.send('user ' + req.params.id);
	}
);

이 라우팅은 내부에서 정규식(RegExp)으로 컴파일됩니다. 
예를 들어 /user/:id는 다음과 같은 정규식으로 컴파일됩니다 : \/users\/([^\/]+)\/?

더 복잡한 용도로 정규식 리터럴을 직접 전달할 수도 있습니다. 
정규식 리터럴의 캡처 그룹은 req.params에서 직접 결과를 받을수 있습니다. 
첫 번째 캡처 그룹은 req.params[0]가 되고, 계속 두 번째는 req.params[1]과 같은 상태가됩니다:

app.get(
	/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, 
	function(req, res){
    	res.send(req.params);
	}
);
*/

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/main', routes.main); // '/main' 으로 접속하면 routes 모듈의 main()메서드가 실행되도록함
app.get('/html', routes.htmlRender);

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
















