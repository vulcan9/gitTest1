var express = require('express');
var http = require('http');

// 웹서버
var app = express();

//-----------------------------------
//Middleware
//-----------------------------------

//웹 서버를 설정합니다.
app.use(express.logger());

//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());

app.use(express.cookieParser('secret key'));
app.use(express.session());
app.use(express.static('public'));
app.use(app.router);

//*/

//-----------------------------------
//라우팅
//-----------------------------------

// 전체 데이터 조회
app.get('/todos', function(req, res){
	db.todos.find(function(error, results){
		if(error){
			// DB 오류 발생
			res.send(500);
		}else{
			res.send(results);
		}
	});
});

// 개별 데이터 조회
app.get('/todos/:id', function(req, res){
	var obj = {_id:db.ObjectId(req.param('id'))};
	db.todos.findOne(obj, function(error, result){
		if(error){
			// DB 오류 발생
			res.send(500);
		}else if(result){
			res.send(result);
		}else{
			// 데이터 없음
			res.send(404);
		}
	});
});

// 데이터 생성
app.post('/todos', function(req, res){
	var title = req.param('title');
	if(title){
		var obj = {
				title:title,
				completed:false
			};
		db.todos.insert(obj, function(error, results){
			if(error){
				res.send(500);
			}else{
				res.send(results);
			}
		});
	}else{
		// 잘못된 요청
		res.send(400);
	}
});

// 데이터 수정
app.put('/todos/:id', function(req, res){
	console.log("completed : ", req.param('completed'));
	if(req.param('completed')){
		var obj = {_id: db.ObjectId(req.param('id'))};
		var set = {
				$set:{
					completed:(function(){
                        if (req.param('completed') == 'true')
                            return true;
                        else if (req.param('completed') == true)
                            return true;
                        else
                            return false;
					})()
				}
		};
		
		// update와 remove 메서드는 수정/삭제된 개수를 리턴하므로(result)
		// send에 result값을 넣어 응답하면 이를 상태코드로 인식하게 되므로
		// 그냥 200 상태코드로 응답한다.
		db.todos.update(obj, set, function(error, result){
			if(error){
				res.send(500);
			}else{
				res.send(200);
			}
		});
		
	}else{
		res.send(400);
	}
});

// 데이터 삭제
app.del('/todos/:id', function(req, res){
	var obj = {_id: db.ObjectId(req.param('id'))};
	db.todos.remove(obj, function(error, result){
		if(error){
			res.send(500);
		}else{
			res.send(200);
		}
	});
});


//DB
var db = require('mongojs').connect('rest', ['todos', 'users']);

// 서버 실행
http.createServer(app).listen(52273, function(){
	console.log('Express server listening on port 52273');
});






// http://blog.naver.com/doowonwebd?Redirect=Log&logNo=100193479445






