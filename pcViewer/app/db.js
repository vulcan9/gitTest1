var MongoClient = require('mongodb').MongoClient;

module.exports = {
	connect : function(database, callback){
		
		var host = database.host;
		var port = database.port;
		var type = database.type;
		
		if(type == "mongodb")
		{
			MongoClient.connect(
				'mongodb://' + host + ':' + port + '/fdeskViewer', 
				function(err, db)
				{
					if(callback && typeof callback == "function"){
						callback(err, db);
					}
				}
			);
		}
		else
		{
			console.log('# 아직 지원되지 않는 DB 형식입니다.');
		}
	}
};
/* callback함수 
function callback(err, db)
{
	if (err){
		console.log('Sorry, there is no mongo db server running.');
		
	}else{
		var attachDB = function(req, res, next){
			req.db = db;
			next();
		};
	}
}
*/