console.log('router');
'use strict';

Todos.Router.map(function(){
	
	//this.resource('index', {path:'/'});
	
	/* 라우팅 샘플
	url : ~/index.html#about
	template : data-template-name="about"
	this.route('about');
	

	// url : ~/index.html#/todos
	// template : data-template-name="todos"
	// data-template-name="todos"가 없는 경우 index를 찾아 랜더링 된다.
	this.resource('todos', {path:'/todos'}, function(){

		
		 data-template-name="todos" template이 있다면 
		 아래의 route에 대한 template가 있다 하더라도 무시된다.

		 url : ~/index.html#/todos/active
		 template : data-template-name="todos/active"
		
		this.route('active');
		
		 data-template-name="todos/completed"이 정의되지 않았다면 
		 Ember는 data-template-name="todos" template을 랜더링 한다.
		 이것도 없을땐 아무것도 표시하지 않는다.

		 url : ~/index.html#/todos/completed
		 template : data-template-name="todos/completed"
		
		this.route('completed');
	});
	*/

	// path를 '/'로 설정할 경우
	this.resource('todos', {path:'/'}, function(){

		/*
		 url : ~/index.html#/active
		 template : data-template-name="todos/active"
		*/
		this.route('active');
		/*
		 url : ~/index.html#/completed
		 template : data-template-name="todos/completed"
		*/
		this.route('completed');
	});
});

Todos.TodosRoute = Ember.Route.extend({
	model: function () {
		console.log("TodosRoute");
		return Todos.Todo.find();
	}
});

Todos.TodosIndexRoute = Ember.Route.extend({
	setupController: function () {
		console.log("TodosIndexRoute");
		var todos = Todos.Todo.find();
		this.controllerFor('todos').set('filteredTodos', todos);
	}
});

/*
Todos.TodosActiveRoute = Ember.Route.extend({
	setupController: function () {
		var todos = Todos.Todo.filter(function (todo) {
			if (!todo.get('isCompleted')) {
				return true;
			}
		});

		this.controllerFor('todos').set('filteredTodos', todos);
	}
});

Todos.TodosCompletedRoute = Ember.Route.extend({
	setupController: function () {
		var todos = Todos.Todo.filter(function (todo) {
			if (todo.get('isCompleted')) {
				return true;
			}
		});

		this.controllerFor('todos').set('filteredTodos', todos);
	}
});
*/


