
/*
//-----------------
// Sample 01.
// Binding Data to Templates
// http://ember101.com/videos/001-intro-and-binding-data-to-templates/
//-----------------

var App = Ember.Application.create();
App.name = "AppName";
App.timer = 0;

setInterval(function (){
	App.set("timer", App.get("timer") + 1);
}, 1000);

// templates
		<script type="text/x-handlebars">
			<h1>{{App.name}}</h1>
			<h2>{{App.timer}}</h2>
		</script>
*/

/*
//-----------------
// Sample 02.
// Providing Data to Templates
// http://ember101.com/videos/002-defining-models-for-routes/
//-----------------

var App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
	model: function(){
		return {name:"My App", timer:0};
	},
	
	activate: function(){
		this.interval = setInterval(function(){
			var timer = this.get("controller.model.timer");
			this.set("controller.model.timer", timer + 1);
		}.bind(this), 1000);
	},
	
	deactivate: function(){
		clearInterval(this.interval);
	}

});

// templates
		<script type="text/x-handlebars">
			<h1>{{name}}</h1>
			<h2>{{timer}}</h2>
		</script>
*/

/*
//-----------------
// Sample 03.
// Displaying a List of Data and Template Helpers - [Read 1]
// http://ember101.com/videos/002-defining-models-for-routes/
//-----------------

var App = Ember.Application.create();

App.ApplicationRoute = Ember.Route.extend({
	model : function(){
		return users;
	}
});

var users = [
	{
		id : 1,
		first : 'Ryan',
		last : 'Florence',
		avatar : 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
	},
	{
		id : 2,
		first : 'Tom',
		last : 'Dale',
		avatar : 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
	},
	{
		id : 3,
		first : 'Yehuda',
		last : 'Katz',
		avatar : 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
	}
];

// templates
<script type="text/x-handlebars">
	<ul class="nav well">
	{{#each model}}
	<!--<li>{{first}} {{last}}</li>-->
	<!--렌더러로 템플릿을 사용-->
	{{render "user" this}}
	{{/each}}
	</ul>
</script>

<script type="text/x-handlebars" id="user">
	<li>
		<img {{bindAttr src="avatar"}}>
		<b>{{first}} {{last}}</b>
	</li>
</script>

*/

/*
//-----------------
// Sample 04.
// Master-Detail: Router.map, {{outlet}}, {{#linkTo}} - [Read 2]
// http://ember101.com/videos/004-master-detail-router-outlet-linkto
//-----------------

var App = Ember.Application.create();

App.Router.map(function(){
	// #/users/id 형식의 URL
	// --> user --> UserRoute --> template id="user"
	this.resource('user', {path : '/users/:user_id'});
});

App.UserRoute = Ember.Route.extend({
	model : function(params){
		// params : /users/:user_id 의  user_id가 전해짐
		// --> {user_id: "2"}
		return users[params.user_id];
		//return App.User.find(params.user_id);
	}
});

App.ApplicationRoute = Ember.Route.extend({
	model : function(){
		return users;
	}
});

var users = [
  {
    id: 0,
    first: 'Ryan',
    last: 'Florence',
    avatar: 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
  },
  {
    id: 1,
    first: 'Tom',
    last: 'Dale',
    avatar: 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
  },
  {
    id: 2,
    first: 'Yehuda',
    last: 'Katz',
    avatar: 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
  }
];

//templates

<script type="text/x-handlebars">
	<div class="container">
		<div class="row-fluid">
			<ul class="nav nav-list span3 well">
				{{#each model}}
				<!--
					"user" : #/users/id 형식의 URL
					(App.Router.map에서 지정됨)
				-->
				<li>{{#linkTo "user" this}}{{first}}{{/linkTo}}</li>
				{{/each}}
			</ul>
			
			<!--
				outlet : user (template id)
				naming conventions에 의해 user (route map)은  user (template id)을  사용
			-->
			<div class="span9 well">{{outlet}}</div>
		</div>
	</div>
</script>

<script type="text/x-handlebars" id="user">
	<h2>
		{{first}} {{last}}
		<img {{bindAttr src="avatar"}} class="pull-right" width=50 />
	</h2>
	<dl>
		<dt>First</dt>
		<dd>{{first}}</dd>
		<dt>Last</dt>
		<dd>{{last}}</dd>
	</dl>
</script>

*/



/*
//-----------------
// Sample 05.
// Two-way Data Binding, Route Events - [Edit]
// http://ember101.com/videos/005-two-way-binding-and-route-actions
//-----------------

var App = Ember.Application.create();

App.Router.map(function(){
	this.resource('user', {
		path : '/users/:user_id'
	});
	this.resource('editUser', {
		path : '/users/:user_id/edit'
	});
});

App.ApplicationRoute = Ember.Route.extend({
	model : function(){
		return users;
	}
});

App.UserRoute = Ember.Route.extend({
	model : function(params){
		return users[params.user_id];
	}
});

// editUser --> EditUserRoute
App.EditUserRoute = Ember.Route.extend({
	// /users/:user_id/edit --> params : {user_id: "2"} 
	model : function(params){
		return users[params.user_id];
	},
	
	// view(template)에서 발생한 이벤트 수신
	events : {
		save : function(){
			// Returns the current model for a given route.
			var user = this.modelFor('editUser');
			// Transition into another route.(name, models)
			this.transitionTo('user', user);
		}
	}
});

var users = [
  {
    id: 0,
    first: 'Ryan',
    last: 'Florence',
    avatar: 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
  },
  {
    id: 1,
    first: 'Tom',
    last: 'Dale',
    avatar: 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
  },
  {
    id: 2,
    first: 'Yehuda',
    last: 'Katz',
    avatar: 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
  }
];

// template

		<script type="text/x-handlebars">
			<div class="container">
				<div class="row-fluid">
					<ul class="nav nav-list span3 well">
						{{#each model}}
						<li>{{#linkTo "user" this}}{{first}}{{/linkTo}}</li>
						{{/each}}
					</ul>
					<div class="span9 well">{{outlet}}</div>
				</div>
			</div>
		</script>

		<script type="text/x-handlebars" id="user">
			<h2>
				{{first}} {{last}}
				<img {{bindAttr src="avatar"}} class="pull-right" width=50 />
			</h2>
			<dl>
				<dt>First</dt>
				<dd>{{first}}</dd>
				<dt>Last</dt>
				<dd>{{last}}</dd>
			</dl>
			{{#linkTo "editUser" this class="btn btn-primary"}}Edit{{/linkTo}}
		</script>

		<script type="text/x-handlebars" id="editUser">
			<h2>Edit User</h2>
			
			<!--
				save 이벤트 발생 
				input qkrtmdptj enter를 친 경우에도 submit action이 작동하므로 역시 save이벤트가 발생됨.
				아래 링크 사용하여 이동되는 경우 save 이벤트와 관련 없이 동작함 (업데이트됨)
			-->
			<form class="form-inline" {{action save on="submit"}}>
				<label>First:{{input type="text" value=first}}</label><br>
				<label>Two-way Binding :{{input type="text" value=first}}</label><br>
				
				<!--아래 구문 사용시 변경 내용 저장되지 않음-->
				<label>One-way Binding :<input type="text" {{bindAttr value="first"}}</input></label><br>
				
				<label>Last:{{input type="text" value=last}}</label>
	
				<div class="controls">
					<!--링크 사용 : 이 경우 Route에서 event 리스너를 정의할 필요 없음-->
					{{#linkTo "user" this}}Done{{/linkTo}}
					<!--Form submit 사용 : Route에서 event 리스너를 정의해야함-->
					<button type="submit" class="btn btn-primary">Done</button>
				</div>
			</form>
		</script>

*/



/*
//-----------------
// Sample 06.
// Adding Objects to a List - [Create]
// http://ember101.com/videos/006-adding-objects-to-a-list/
//-----------------

var App = Ember.Application.create();

App.Router.map(function(){
	this.resource('user', {path : '/users/:user_id'});
	this.resource('editUser', {path : '/users/:user_id/edit'});
});

App.ApplicationRoute = Ember.Route.extend({
	model : function(){
		return users;
	},
	
	events : {
		createUser : function(){
			var users = this.modelFor('application');
			
			// 데이터 추가하여
			var user = users.pushObject({
				id : users.length
			});
			
			// editUser로 이동
			this.transitionTo('editUser', user);
		}
	}
});

App.UserRoute = Ember.Route.extend({
	model : function(params){
		return users[params.user_id];
	}
});

App.EditUserRoute = Ember.Route.extend({
	model : function(params){
		return users[params.user_id];
	},
	
	events : {
		save : function(){
			var user = this.modelFor('editUser');
			this.transitionTo('user', user);
		}
	}
});

var users = [
  {
    id: 0,
    first: 'Ryan',
    last: 'Florence',
    avatar: 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
  },
  {
    id: 1,
    first: 'Tom',
    last: 'Dale',
    avatar: 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
  },
  {
    id: 2,
    first: 'Yehuda',
    last: 'Katz',
    avatar: 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
  }
];

//template

<script type="text/x-handlebars">
	<div class="container">
		<div class="row-fluid">
			<ul class="nav nav-list span3 well">
				
				{{#each model}}
				<li>{{#linkTo "user" this}}{{first}}{{/linkTo}}</li>
				{{/each}}
				
				<!--새로 만들기 이벤트 발생 : createUser 이벤트-->
				<li><a href="#" {{action createUser}}>+ New User</a></li>
				
			</ul>
			<div class="span9 well">{{outlet}}</div>
		</div>
	</div>
</script>

<script type="text/x-handlebars" id="user">
	<h2>
		{{first}} {{last}}
		<img {{bindAttr src="avatar"}} class="pull-right" width=50 />
	</h2>
	<dl>
		<dt>First</dt>
		<dd>{{first}}</dd>
		<dt>Last</dt>
		<dd>{{last}}</dd>
	</dl>
	{{#linkTo "editUser" this class="btn btn-primary"}}Edit{{/linkTo}}
</script>

<script type="text/x-handlebars" id="editUser">
	<h2>Edit User</h2>
	<form class="form-inline" {{action save on="submit"}}>
		<label>First:{{input type="text" value=first}}</label><br>
		<label>Last:{{input type="text" value=last}}</label>

		<div class="controls">
			<button type="submit" class="btn btn-primary">Done</button>
		</div>
	</form>
</script>

*/



/*
//-----------------
// Sample 07.
// Nested and Index Routes (서브 route 지정)
// http://ember101.com/videos/007-nested-routes
//-----------------

var App = Ember.Application.create();

App.Router.map(function(){
	
	// path : /about
	// outlet : about template을 랜더링
	this.resource('about', function(){
		// path : /about/product
		// outlet : about, about/product template을 순차적으로 랜더링
		this.route('product');
		// path : /about/location
		// outlet : about, about/location template을 순차적으로 랜더링
		this.route('location');
	});
	
	// outlet : about 랜더링하지 않고 about/location template만 랜더링
	this.resource('aboutLocation', {path: '/about/location'});
	// outlet : about 랜더링하지 않고 about/product template만 랜더링
	this.resource('aboutProduct', {path: '/about/product'});
	
	// path : /login
	// outlet : login template을 랜더링
	this.resource('login');
});

// template

		<script type="text/x-handlebars">
			<h1>Application</h1>
			<ul>
				<li>{{#linkTo "about"}}About{{/linkTo}}</li>
				<li>{{#linkTo "login"}}Login{{/linkTo}}</li>
				
				<!--outlet : about/location-->
				<li>{{#linkTo "aboutLocation"}}aboutLocation{{/linkTo}}</li>
				<!--outlet : about/product-->
				<li>{{#linkTo "aboutProduct"}}aboutProduct{{/linkTo}}</li>
				
				<!--outlet : about, about/location-->
				<li>{{#linkTo "about.location"}}about.location{{/linkTo}}</li>
				<!--outlet : about, about/product-->
				<li>{{#linkTo "about.product"}}about.product{{/linkTo}}</li>
			</ul>
			{{outlet}}
		</script>

		<script type="text/x-handlebars" id="about">
			<h2>About</h2>
			<ul>
				<li>{{#linkTo "about.location"}}Location{{/linkTo}}</li>
				<li>{{#linkTo "about.product"}}Product{{/linkTo}}</li>
			</ul>
			{{outlet}}
		</script>

		<!--route: application-->
		<script type="text/x-handlebars" id="index">
			<h2>Index</h2>
		</script>

		<!--route: login-->
		<script type="text/x-handlebars" id="login">
			<h2>Login</h2>
		</script>

		<!--route: about-->
		<script type="text/x-handlebars" id="about/index">
			<h3>Index</h3>
		</script>

		<!--route: about.location or aboutLocation-->
		<script type="text/x-handlebars" id="about/location">
			<h3>Location</h3>
		</script>
		
		<!--route: about.product or aboutProduct-->
		<script type="text/x-handlebars" id="about/product">
			<h3>Product</h3>
		</script>

*/



/*
//-----------------
// Sample 08.
// Ember Data: Reading
// http://ember101.com/videos/008-ember-data-reading/
//-----------------
*/

var App = Ember.Application.create({
	// Basic logging, e.g. "Transitioned into 'post'"
	LOG_TRANSITIONS: true, 
	
	// Extremely detailed logging, highlighting every internal
	// step made while transitioning into a route, including
	// `beforeModel`, `model`, and `afterModel` hooks, and
	// information about redirects and aborted transitions
	LOG_TRANSITIONS_INTERNAL: true
});

App.Router.map(function(){
	this.resource('contact', {path : '/contact/:contact_id'});
});

/*
//-----------------
// Local Data
//-----------------

App.ApplicationRoute = Ember.Route.extend({
	model: function(){
		return [{id:1, first:"Fakey", last:"McGee"}];
	}
});
App.ContactRoute = Ember.Route.extend({
	model: function(param){
		return {id:1, first:"Fakey", last:"McGee"};
	}
});
*/

/*
//-----------------
// Data Store
//-----------------
*/

App.Store = DS.Store.extend({
	revision : 12,
	// default : DS.FixtureAdapter
	adapter : DS.RESTAdapter.create({
		url : 'http://addressbook-api.herokuapp.com'
	})
});

App.Contact = DS.Model.extend({
	first : DS.attr('string'),
	last : DS.attr('string'),
	avatar : DS.attr('string'),
	github : DS.attr('string'),
	twitter : DS.attr('string'),
	notes : DS.attr('string')
});

App.ApplicationRoute = Ember.Route.extend({
	model : function(){
		return App.Contact.find();
	}
});

/*
// 아래 App.ContactRoute를 설정하지 않아도 Ember에서 자동으로 model을 설정해 준다.
//Ember는 contact route에 대하여 App.Contact를  찾는다.
//App.Contact.toString() --> "App.Contact"

App.ContactRoute = Ember.Route.extend({
	model: function(param){
		return App.Contact.find(param.contact_id);
	}
});
*/




