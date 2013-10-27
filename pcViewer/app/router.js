var Admin = require('./admin/Admin');
var Application = require('./viewer/Application');

module.exports = {
	set:function(express){
		
		// 모든 요청에 대해 DB_OBJECT객체를 참조할 수 있도록 값을 추가해준다
		var attachDB = function(req, res, next) {
			if(express){
				var db = express.get('DB_OBJECT');
				req.db = db;
				//console.log("# DB_OBJECT Setting. \n");
			}
			
			next();
		};
		
		//-----------------
		// Admin Page
		//-----------------
		
		/*
		 * 주의 :
		 * templates 폴더 안의 admin 폴더가 있고 경우 이 폴더안의 asset을 (css, image, js...)사용하는 경우
		 * 이 asset을 사용할때 /admin.....으로 요청하게되어 아래 routing의 영향을 받게된다.
		 * 단순 파일 요청임에도 admin.run(req, res, next); 구문이 실행되게 되어
		 * 원치 않는 동작을 하게 된다.
		 * 
		 * 아래와 같은 설정일 경우 아래 routing 설정의 영향으로 css 호출이 실패할 수 있다.
		 * <link rel='stylesheet' href='/admin/stylesheets/style.css' />
		 */
		
		var admin = new Admin();
		express.all('/admin*', attachDB, function(req, res, next){
			//console.log('* session : ', req.session);
			admin.run(req, res, next);
		});

		//-----------------
		// Application Page
		//-----------------

		var application = new Application();
		express.all('/viewer', attachDB, function(req, res, next){
			application.run(req, res, next);
		});

		//-----------------
		// Home Page
		//-----------------
		
		express.all('/', attachDB, function(req, res, next) {
			res.writeHead(200, {'Conternt-type':'text/html'});
			res.end("HOME Page");
		});
		
		//-----------------
		// 404 Page
		//-----------------
		/*
		// 다른 경로 호출에 영향을 미침 (이미지, css등의 요청)
		express.all('*', function(req, res, next){
			res.writeHead(200, {'Conternt-type':'text/html'});
			res.end("404 Page - Not Found");
		});
		*/
	}
};