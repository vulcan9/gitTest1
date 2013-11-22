var _ = require("underscore");

module.exports = (function(){
	
	// 생성자
	var Class = function(){};
	
	// 생성자 처리
	Class.prototype.constructor = function(){
		//console.log("constructor : ", arguments);
	};
	
	// 상속 기능 구현
	Class.extend = function(properties){
		var Child = inherit.call(this, properties);
		return Child;
	};
	
	//--------------------------
	// 새로운 클래스로 상속
	//--------------------------
	
	function inherit(properties){
		
		var superClass = this;
		var Child = function(){
			
			// Super Call
			superClass.prototype.constructor.apply(this, arguments);
			
			// Constructor Call
			this.constructor.apply(this, arguments);
		};
		
		
		Child.prototype = _.extend({}, this.prototype, properties);
		Child.superClass = superClass;
		Child.extend = superClass.extend;
		
		/*
		Child.extend = function(obj){
			console.log("Child - ", this === Child);
			return inherit.call(this, obj);
		};
		*/
		
		return Child;
	}
	
	return Class;
})();















