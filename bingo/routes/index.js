var fs = require('fs');

/*
 * ejs에서 세션과 같은 Express의 내용 접근하기
 * http://valley.egloos.com/viewer/?url=http://entireboy.egloos.com/4794353
 */

exports.index = function(req, res){
	
	console.log("session : ", req.session);
	console.log("req query : ", req.query);
	//console.log("req query : ", req.body);
	
	// 비동기 응답 테스트
	setTimeout(function(){
		
		var data = {
			title: req.query.id + ' 접속',
			tagSample : '<font color="red">' + req.query.id + '</font>'
		}
		
		var result = { 
			query:req.query, 
			data: data, 
			json:JSON.stringify(data)
		}
		
		res.render('index', result);
		
	}, 2000);
	
};

// main.jade를 랜더링하도록 지정함
exports.main = function(req, res){
	res.render(
		'mainView', 
		{
			title: 'Bingo!',
			username: req.query.username // query문에서 추출된 값 전달 (예 : main?username=test2)
		}
	);
};

exports.htmlRender = function(req, res){
	
	console.log("session : ", req.session);
	console.log("req query : ", req.query);
	
	// 1. text
	//res.send("respond with a resource");
	
	// 2. 파일 확인
	fs.exists('./views/htmlRender.html', function(exists){
		//res.send("respond with a resource : " + exists );
		console.log(exists ? "it's there" : "no passwd!");
	});
	
	// 비동기 응답 테스트
	setTimeout(function(){
		// 3. htem 파일 읽기
		fs.readFile('./views/htmlRender.html', function(error, data)
		{
			console.log("res query : ", res.req.query);
			res.writeHead(200, {'Conternt-type':'text/html'});
			res.end(data);
		});
	}, 2000);
	
};

