(function($)
{
	
	//demo data
	var contacts = [ {
		name : "Contact 1",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "family"
	}, {
		name : "Contact 2",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "family"
	}, {
		name : "Contact 3",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "friend"
	}, {
		name : "Contact 4",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "colleague"
	}, {
		name : "Contact 5",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "family"
	}, {
		name : "Contact 6",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "colleague"
	}, {
		name : "Contact 7",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "friend"
	}, {
		name : "Contact 8",
		address : "1, a street, a town, a city, AB12 3CD",
		tel : "0123456789",
		email : "anemail@me.com",
		type : "family"
	} ]

	////////////////////////////////
	// Models
	////////////////////////////////
	
	//----------------
	// model
	//----------------
	
	var Contact = Backbone.Model.extend({
		defaults : {
			photo : "./img/placeholder.png"
		}
	});
	
	//----------------
	// collection
	//----------------
	
	var Directory = Backbone.Collection.extend({
		model : Contact
	});
	
	////////////////////////////////
	// View
	////////////////////////////////
	
	//define individual contact view
	var ContactView = Backbone.View.extend({
		
		// element 정의 (this.el)
		tagName : "article",
		className : "contact-container",
		template : $("#contactTemplate").html(),
		
		initialize : function(){},
		
		render : function()
		{
			// underscore를 사용하여 template을 compile한다.
			var compiled = _.template(this.template);
			var tmpl = compiled(this.model.toJSON());
			
			// backbone "el"을 통해 compile된 HTML을 로드한다.
			$(this.el).html(tmpl);
			return this;
		}
	});

	//----------------
	// A Master View
	//----------------
	
	//define master view
	var DirectoryView = Backbone.View.extend({
		
		// element 정의 (this.el)
		el : $("#contacts"),
		
		// View에 묶인 DOM의 id : Backbone은 이 값으로 DOM을 찾아 el 프로퍼티를 설정한다.
		//id : 'page',
		
		initialize : function()
		{
			this.collection = new Directory(contacts);
			this.render();
			
			this.$el.find("#filter").append(this.createSelect());
			this.on("change:filterType", this.filterByType, this);
			this.collection.on("reset", this.render, this);
		},
		
		render : function()
		{
			/*
			var that = this;
			_.each(this.collection.models, function(item)
			{
				that.renderContact(item);
			}, this);
			*/
			this.$el.find("article").remove();
			
			_.each(this.collection.models, function(item)
			{
				this.renderContact(item);
			}, this);
		},
		
		// 개별 데이터 렌더링
		renderContact : function(item)
		{
			var contactView = new ContactView({
				model : item
			});
			this.$el.append(contactView.render().el);
		},
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//---------------------------
		// Reacting to User Input
		//---------------------------
		// http://net.tutsplus.com/tutorials/javascript-ajax/build-a-contacts-manager-using-backbone-js-part-2/
		
		createSelect : function()
		{
			var select = $("<select/>", {
				html : "<option value='all'>All</option>"
			});
			
			_.each(this.getTypes(), function(item)
			{
				var option = $("<option/>", {
					value : item,
					text : item
				}).appendTo(select);
			});
			
			return select;
		},
		
		getTypes : function()
		{
			return _.uniq(this.collection.pluck("type"));
		},
		
		//add ui events
		events : {
			"change #filter select" : "setFilter"
		},
		
		//Set filter property and fire change event
		setFilter : function(e)
		{
			this.filterType = e.currentTarget.value;
			this.trigger("change:filterType");
		},
		
		//filter the view
		filterByType : function()
		{
			if (this.filterType === "all")
			{
				this.collection.reset(contacts);
				contactsRouter.navigate("filter/all");
			}
			else
			{
				this.collection.reset(contacts, {
					silent : true
				});
				
				var filterType = this.filterType, filtered = _.filter(
						this.collection.models, function(item)
						{
							return item.get("type") === filterType;
						});
				
				this.collection.reset(filtered);
				
				contactsRouter.navigate("filter/" + filterType);
			}
		}
	});
	
	//create instance of master view
	var directory = new DirectoryView();
	
	//add routing
	var ContactsRouter = Backbone.Router.extend({
		routes : {
			"filter/:type" : "urlFilter"
		},
		
		urlFilter : function(type)
		{
			directory.filterType = type;
			directory.trigger("change:filterType");
		}
	});
	
	//create router instance
	var contactsRouter = new ContactsRouter();
	
	//start history service
	Backbone.history.start();
	
}(jQuery));





























