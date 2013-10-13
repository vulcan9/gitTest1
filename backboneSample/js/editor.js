
$(function() {
	
	//////////////////////////////////
	// Model
	////////////////////////////////////
	
	/*
	 * defaults는 특별한 프로퍼티다. 이 프로퍼티에 Model의 기본 프로퍼티와 기본 값을 정의한다. 
	 * 그래서 모든 Shape 인스턴스에는 x, y, width, height, color 프로퍼티가 있고 기본 값도 할당된다. 
	 * 
	 * 중요한 건 Backbone.js가 프로퍼티를 감싸준다는(encapsulation) 것이다. 
	 * 직접 프로퍼티를 접근하기(getting/setting)보다 Backbone Model에서 상속한 get/set 메소드를 사용한다. 
	 * Encapsulation 덕에 Model 프로퍼티가 수정되는 것을 관리할 수 있다. 
	 * 
	 * set 메소드가 호출되면 event가 발생한다. 
	 * 그래서 이벤트 리스너를 등록하면 Model이 변경되는 것을 관리할 수 있다.
	 */

	//----------------------------------
	// Shape Model
	//----------------------------------
	
	var Shape = Backbone.Model.extend({
		// 데이터 원형
		defaults : {
			x : 50,
			y : 50,
			width : 150,
			height : 150,
			color : 'black'
		},
		
		// 데잍 수정
		setTopLeft : function(x, y) {
			this.set({
				x : x,
				y : y
			});
		},
		setDim : function(w, h) {
			this.set({
				width : w,
				height : h
			});
		},
		isCircle : function() {
			return !!this.get('circle');
		}
	});

	//----------------------------------
	// Document Model
	//----------------------------------
	
	/* 
	 * Backbone Model에는 Collection이라는 Model이 있다.
	 * Collection은 Model을 정렬된 집합으로 관리할 수 있게 도와주는 Container다. 
	 * 이 Collection은 add, remote 이벤트가 있고 이 이벤트를 Listen할 수 있다.
	 * Model 컬렉션을 사용한다.
	 */
	
	// Shape 객체를 담는 Collection인 ‘Document’ Model
	var Document = Backbone.Collection.extend({
		model : Shape
	});

	//////////////////////////////////
	// View
	////////////////////////////////////
	
	/* 
	 * Backbone.js에서 View는 Model(이나 Collection)과 함께 사용한다. 
	 * View의 역할은 다음과 같다:
	 * 
	 * Model을 DOM 엘리먼트로 렌더링한다. 
	 * Model의 change 이벤트를 지켜보고 있다가 바뀌면 페이지도 바꾼다.
	 * DOM 엘리먼트의 이벤트를 처리하고 다시 Model을 업데이트한다.
	 * 
	 * MVC 이론과 비교했을 때, Backbone의 View는 View와 Controller의 역할을 둘 다 떠맡는다. 
	 * Backbone의 View는 사용자 입력(DOM 이벤트)을 처리하고 Model도 업데이트한다. 
	 * 게다가 Model 이벤트를 Listen하다가 바뀌면 다시 화면을 업데이트한다. 
	 * 하지만, 실제로 구현할 때 다른 메소드에 구현할 거라서 이 점은 별로 중요하지 않다.
	 */
	
	//----------------------------------
	// Document Model를 위한 DocumentView
	//----------------------------------
	
	/*
	 * Shape View를 관리
	*/
	
	var DocumentView = Backbone.View.extend({
		// View에 묶인 DOM의 id
		// Backbone은 이 값으로 DOM을 찾아 el 프로퍼티를 설정한다.
		// 이미 html 페이지에 있는 엘리먼트를 사용하기 때문에 render 메소드에서 새로 만들지 않는다.
		id : 'page',
		views : {},
		initialize : function() {
			// 추가 될때
			this.collection.bind('add', function(model) {
				// Shape Model과 View를 만들고 렌더링한다.
				// Shape View는 모두 views 프로퍼티에서 관리한다
				this.views[model.cid] = new ShapeView({
					model : model,
					id : 'view_' + model.cid
				});
				this.views[model.cid].render();
			}, this);
			// 제거 될때
			this.collection.bind('remove', function(model) {
				// document에서 해당 Shape을 페이지에서도 삭제하고 views 프로퍼티에서도 삭제한다.
				this.views[model.cid].remove();
				delete this.views[model.cid];
			}, this);
		},
		render : function() {
			return this;
		}
	});

	//----------------------------------
	// Shape Model을 사용하는 Shape View
	//----------------------------------
	
	/* 
	 * Shape을 표현하는 Html 엘리먼트와 그 Html 엘리먼트를 감싸는(Decorate) ‘control’ 엘리먼트를 관리한다. 
	 * ‘control’ 엘리먼트는 사용자가 Shape을 드레그하고, 
	 * Shape의 크기를 바꾸고, Shape을 삭제하고, Shape의 색을 바꿀 수 있게 해준다.
	 */
	
	var ShapeView = Backbone.View.extend({
		
		// initialize는 View가 생성될 때 실행되는 함수다.
		// Model의 이벤트 리스너를 등록하려면 여기서 해야 한다.
		initialize : function() {
			// Shape Div 그 자체가 아니라 부모인 page 엘리먼트의 mousemove와 mouseup 이벤트를 Listen하고 있어야 
			// 더 나은 UX를 얻을 수 있다. (부드러운 움직임)
			$('#page').mousemove(this, this.mousemove)
			$('#page').mouseup(this, this.mouseup);
			
			// View에서 Model change 이벤트를 등록한다.
			this.model.bind('change', this.updateView, this);
		},
		
		/* 
		 * render는 View를 초기화하고 나서 실행된다.
		 * 여기서 View에 필요한 Html 엘리먼트를 초기화하고 DOM에 추가한다. 
		 * View의 Html 엘리먼트를 el 프로퍼티에 할당시켜 놓는다. 
		 */
		render : function() {
			// el 프로퍼티는 Backbone View에서 상속받은 거다.
			// 먼저 ‘#page'에 el을 추가
			$('#page').append(this.el);
			
			// shape과 control 엘리먼트를 추가
			$(this.el).html(
					'<div class="shape"/>'
							+ '<div class="control delete hide"/>'
							+ '<div class="control change-color hide"/>'
							+ '<div class="control resize hide"/>').css({
				position : 'absolute',
				padding : '10px'
			});
			
			if (this.model.isCircle()) {
				this.$('.shape').addClass('circle');
			}
			
			// Model을 View에 적용한다.
			this.updateView();
			return this;
		},
		
		// Model을 View에 적용한다.
		updateView : function() {
			$(this.el).css({
				left : this.model.get('x'),
				top : this.model.get('y'),
				width : this.model.get('width') - 10,
				height : this.model.get('height') - 10
			});
			this.$('.shape').css({
				background : this.model.get('color')
			});
		},
		
		/*
		 * View에서 events 해시는 매우 중요하다. 이 부분이 이벤트와 리스너를 연결하는 부분이다. 
		 * { 'event selector': 'handler' } 형식으로 정의한다. 
		 * 예를 들어 { 'mousedown .shape': 'draggingStart' }는 ’.shape' 에 mousedown 이벤트가 Fire되면 draggingStart 메소드를 실행시킨다. 
		 * 이 events 해시는 사용자 입력을 어떻게 처리할지를 정의하는 것인데 이 부분이 Controller 역할에 해당한다.
		 */
		events : {
			'mouseenter .shape' 		: 'hoveringStart',
			'mouseleave' 				: 'hoveringEnd',
			'mousedown .shape' 			: 'draggingStart',
			
			'mousedown .resize' 		: 'resizingStart',
			'mousedown .change-color' 	: 'changeColor',
			'mousedown .delete' 		: 'deleting',
		},
		
		hoveringStart : function(e) {
			this.$('.control').removeClass('hide');
		},
		hoveringEnd : function(e) {
			this.$('.control').addClass('hide');
		},
		draggingStart : function(e) {
			this.dragging = true;
			this.initialX = e.pageX - this.model.get('x');
			this.initialY = e.pageY - this.model.get('y');
			
			// prevents text selection
			return false;
		},
		resizingStart : function(e) {
			this.resizing = true;
			return false;
		},
		changeColor : function(e) {
			this.model.set({
				color : prompt('Enter color value', this.model.get('color'))
			});
		},
		deleting : function(e) {
			this.model.collection.remove(this.model);
		},
		mouseup : function(e) {
			if (!e || !e.data)
				return;
			var self = e.data;
			self.dragging = self.resizing = false;
		},
		mousemove : function(e) {
			if (!e || !e.data)
				return;
			var self = e.data;
			if (self.dragging) {
				self.model.setTopLeft(e.pageX - self.initialX, e.pageY
						- self.initialY);
			} else if (self.resizing) {
				self.model.setDim(e.pageX - self.model.get('x'), e.pageY
						- self.model.get('y'));
			}
		}
	});
	
	//////////////////////////////////
	// 실행 코드
	////////////////////////////////////
	
	var document = new Document();
	var documentView = new DocumentView({
		collection : document
	});
	documentView.render();

	$('#new-rectangle').click(function() {
		document.add(new Shape());
	});

	$('#new-circle').click(function() {
		document.add(new Shape({
			circle : true
		}));
	});
	
	
	/*
	document.add([ {
		"x" : 216,
		"y" : 538,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 444,
		"y" : 129,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 136,
		"y" : 128,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 405,
		"y" : 498,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 365,
		"y" : 538,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 176,
		"y" : 168,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 405,
		"y" : 168,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 176,
		"y" : 498,
		"width" : 50,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 96,
		"y" : 307,
		"width" : 50,
		"height" : 100,
		"color" : "blue"
	}, {
		"x" : 485,
		"y" : 308,
		"width" : 50,
		"height" : 100,
		"color" : "blue"
	}, {
		"x" : 406,
		"y" : 308,
		"width" : 50,
		"height" : 150,
		"color" : "blue"
	}, {
		"x" : 56,
		"y" : 358,
		"width" : 50,
		"height" : 150,
		"color" : "blue"
	}, {
		"x" : 525,
		"y" : 358,
		"width" : 50,
		"height" : 150,
		"color" : "blue"
	}, {
		"x" : 176,
		"y" : 308,
		"width" : 50,
		"height" : 150,
		"color" : "blue"
	}, {
		"x" : 138,
		"y" : 208,
		"width" : 350,
		"height" : 50,
		"color" : "blue"
	}, {
		"x" : 216,
		"y" : 208,
		"width" : 200,
		"height" : 250,
		"color" : "blue"
	}, {
		"x" : 136,
		"y" : 208,
		"width" : 50,
		"height" : 300,
		"color" : "blue"
	}, {
		"x" : 445,
		"y" : 208,
		"width" : 50,
		"height" : 300,
		"color" : "blue"
	}, {
		"x" : 558,
		"y" : 159,
		"width" : 463,
		"height" : 448,
		"color" : "#FDD017",
		"circle" : true
	}, {
		"x" : 630,
		"y" : 279,
		"width" : 85,
		"height" : 85,
		"color" : "black",
		"circle" : true
	}, {
		"x" : 835,
		"y" : 284,
		"width" : 85,
		"height" : 85,
		"color" : "black",
		"circle" : true
	}, {
		"x" : 637,
		"y" : 469,
		"width" : 310,
		"height" : 36,
		"color" : "black"
	}, {
		"x" : 631,
		"y" : 444,
		"width" : 41,
		"height" : 61,
		"color" : "black"
	}, {
		"x" : 906,
		"y" : 443,
		"width" : 41,
		"height" : 61,
		"color" : "black"
	} ]);
	*/
	
	
	
});



















