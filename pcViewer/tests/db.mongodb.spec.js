var DB = require('../app/db');

var database = {
	type: "mongodb",
	host: '127.0.0.1',
	port: 27017
};

describe("MongoDB", function()
{
	it("is there a server running", function(next)
	{
		expect(database.type).toBe("mongodb");
		
		DB.connect(database, function(err, db){
			expect(err).toBe(null);
			expect(db).toBeDefined();
			next();
		});
	});
});
