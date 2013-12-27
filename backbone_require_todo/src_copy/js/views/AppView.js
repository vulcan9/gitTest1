/*global Backbone _ $ ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',
		
		initialize: function(){
			// skin part
			this.$input = this.$("#new-todo");
			
			// Collection Event
			this.listenTo(app.Todos, "add", this.addOne);
			//app.Todos.on("add", this.onAddOne, this);
			//this.listenTo(app.Todos, 'all', this.render);
			
			app.Todos.fetch();
		},
		
		events: {
			"keypress #new-todo": "createOnEnter"
		},
		
		render: function () {
			console.log("렌더링~");
		},
		
		//-----------------------------
		// input 박스에서 엔터키 눌렀을때
		//-----------------------------
		
		createOnEnter: function(e){
			//console.log("e:",e);
			if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
				return;
			}
			
			// 새로운 데이터 추가
			app.Todos.create({
				title: this.$input.val().trim(),
				//order: app.Todos.nextOrder(),
				completed: false
			});
			this.$input.val('');
		},

		//-----------------------------
		// Collection Event
		//-----------------------------
		
		addOne: function(todo, response){
			console.log("add : ", todo);
		}
		
		
		
		
		
	});
})(jQuery);
