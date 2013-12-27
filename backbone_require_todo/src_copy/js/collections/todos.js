/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------
	
	var TodoList = Backbone.Collection.extend({
		
		// collection의 model에 대한 참조
		model: app.Todo,
		
		// Save all of the todo items under the `"todos"` namespace.
		//localStorage: new Backbone.LocalStorage('todos-backbone'),

		// API
		
		// 
		nextOrder: function (){
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		}
		
		
		
		
		
		
		
		
		
		
	});
	
	// Create our global collection of **Todos**.
	app.Todos = new TodoList();
	
})();
