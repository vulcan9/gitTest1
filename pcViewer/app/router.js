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

		var admin = new Admin();
		express.all('/admin*', attachDB, function(req, res, next){
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
		// 404 Page
		//-----------------

		express.all('*', function(req, res, next){
			res.writeHead(200, {'Conternt-type':'text/html'});
			res.end("404 Page - Not Found");
		});
	}
};