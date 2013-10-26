var Class = require("./Class");


module.exports = (function(){
	
	var ModelClass = Class.extend({
		
		constructor: function(db){
			this.db = db;
		},
		
		db:null,
		_collection:null,
		name:"",
		
		collection: function() {
			if(this._collection) return this._collection;
			return this._collection = this.db.collection(this.name);
		},
		
		create: function(db){
			this.db = db;
		},
		read: function(query, callback){
			//this.collection().find(query || {}).toArray(callback);
		},
		
		insert: function(data, callback) {
			//data.ID = crypto.randomBytes(20).toString('hex'); 
			//this.collection().insert(data, {}, callback || function(){ });
		},
		update: function(data, callback) {
			//this.collection().update({ID: data.ID}, data, {}, callback || function(){ });	
		},
		remove: function(id, callback) {
			//this.collection().findAndModify({ID: ID}, [], {}, {remove: true}, callback);
		}
	});
	
	return ModelClass;
})();











