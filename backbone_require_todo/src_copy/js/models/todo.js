/*global Backbone */
var app = app || {};

(function(){
	"use strict";
	
	// Model
	app.Todo = Backbone.Model.extend({
		
		//url: "http://myapi.com/",
		
		defaults:{
			title: '',
			completed: false
		},
		
		// Toggle the `completed` state of this todo item.
		toggle: function(){
			console.log("toggle : 구현 아직 안됨");
		}
		
	});
});


















