/**
 * 참고 사이트
 * http://dev.tutsplus.com/tutorials/build-a-complete-mvc-web-site-with-expressjs--net-34168
 */

var express = require('express');
var app = express();

//-----------------------------------
// Middleware
//-----------------------------------

//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// session 사용
app.use(express.cookieParser('fdesk-Viewer'));
app.use(express.session());

//development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}

/*
app.use(function (req, res, next){
	console.log('1st middleware');
	next();
});

app.use(function (req, res, next){
	console.log('2nd middleware');
	res.end('Hello world');
});
*/

// Templete 지정
setTemplete('hjs');

//정적 디렉토리 설정
setPath();

//라우터 설정
setRouter();

// 서버 설정
//app.set('port', process.env.PORT || 3000);
var config = require('./config').set();
console.log('Server Config : ', config);

// DB 연결
dbConnect();

// Server 연결
serverConnect();














//-----------------------------------
// 경로 설정
//-----------------------------------

function setTemplete(engine){
	app.set('views', __dirname + '/templates');
	if(engine){
		app.set('view engine', engine);
	}
}

function setPath(){
	var path = require('path');
	app.use(express.static(path.join(__dirname, 'public')));
	//app.use(require('less-middleware')({ src: __dirname + '/public' }));	
}

function setRouter(){
	// 라우터 설정(요청에 따라 응답을 결정).
	//app.use(app.router);
	
	var router = require('./app/router');
	router.set(app);
}

//-----------------------------------
// DataBase - Server 연결
//-----------------------------------

function dbConnect(){
	var DB = require('./app/db');
	DB.connect(config.database, function(err, db){
		if (err) throw err;
		console.log('# DB connected to : ', 'mongodb://' + config.database.host + ':' + config.database.port);
		
		// db 객체를 저장해 둔다
		app.set('DB_OBJECT', db);
	});	
}

function serverConnect(){
	var http = require('http');
	http.createServer(app).listen(config.port, function(){
		console.log('# Express server Start !!! - ' + config.port);
	});
}











































