var Model = require("../../core/Model");
var crypto = require("crypto");

var ModelClass = Model.extend({
	
	name : 'fastdelivery-content',
	
	insert : function(data, callback)
	{
		data.ID = crypto.randomBytes(20).toString('hex');
		this.collection().insert(data, {}, callback || function(){
		});
	},
	
	update : function(data, callback)
	{
		this.collection().update({
			ID : data.ID
		}, data, {}, callback || function(){
		});
	},
	
	remove : function(ID, callback)
	{
		this.collection().findAndModify({ID : ID}, [], {}, {remove : true}, callback);
	},
	
	getlist: function(callback, query) {
		this.collection().find(query || {}).toArray(callback);
	}
});

module.exports = ModelClass;


/*
var model = new Model();

var ContentModel = model.extend({

	getlist : function(callback, query)
	{
		this.collection().find(query || {}).toArray(callback);
	},

});
module.exports = ContentModel;
*/




