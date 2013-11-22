
// 사용예) $>node app.js staging

var config = {
	local: {
		mode: 'local',
		port: 2000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: 27017
		}
	},
	staging: {
		mode: 'staging',
		port: 4000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: 27017
		}
	},
	production: {
		mode: 'production',
		port: 5000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: 27017
		}
	}
};

module.exports = {
	set : function(mode) {
		return config[mode || process.argv[2] || 'local'] || config.local;			
	}
};








