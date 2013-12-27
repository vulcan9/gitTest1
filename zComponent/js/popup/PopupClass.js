
///////////////////////////////////////////////////
//
// Popup Class
//
///////////////////////////////////////////////////


//define(["jquery"], function($){
	"use strict";
	

	var PopupClass = function($_template, $_popupOwner){
		this._title = "제목 없음";
		this._content = "내용없음";
		this._modal = false;
		this._movable = true;
		this.callback = null;
		
		// template가 없으면  alert을 띄운다.
		if($_template){
			var htmlString = $_template.html();
			if(htmlString){
				this._template = $.parseHTML(htmlString);
			}
		}
		//console.log(this._template);
		
		this.$_popupOwner = $_popupOwner || $("body");
		this.$_instance = null;
	};

	//-----------------------------------
	// 팝업창 열기
	//-----------------------------------
	
	PopupClass.prototype.open = function (config, callback){
		this._title =  config.title || "제목 없음";
		this._content = config.content || "내용없음";
		this.callback = callback;
		
		// 템플릿에 내용 적용
		var instance = this._getTemplate();
		if(!instance){
			alert("popup 템플릿이 지정되지 않았습니다.");
			return null;
		}
		
		// 팝업 띄우기
		this.$_instance = $(instance).filter(".popup");
		this.$_instance.appendTo(this.$_popupOwner);

		// 위치 중앙 정렬
		this._setPosition();
		
		// modal 옵션 처리
		if(config.modal !== undefined) this._modal = config.modal;
		this._setModal();
		
		// 드래그 기능
		if(config.movable !== undefined) this._movable = config.movable;
		this._setDrag();
		
		return this.$_instance;
	};
	
	// 내용 적용된 팝업 템플릿
	PopupClass.prototype._getTemplate = function(){
		var template = this._template;
		if(template){
			var $_instance = $(template);
			$_instance.find(".title").html(this._title);
			$_instance.find(".contentGroup").html(this._content);
			
			// 버튼 설정
			this.setButton($_instance);
		}
		return template;
	};
	
	PopupClass.prototype.getInstance = function(){
		return this.$_instance;
	};
	
	// 버튼 눌림
	PopupClass.prototype.setButton = function ($_instance){
		$_instance.find(".button_yes").on("click", $.proxy(this.close, this, "yes"));
		$_instance.find(".button_no").on("click", $.proxy(this.close, this, "no"));
		$_instance.find(".closeButton").on("click", $.proxy(this.close, this, undefined));
	};

	// 위치 중앙 정렬
	PopupClass.prototype._setPosition = function(){
		var w = $(this.$_instance).find(".content").width();
		var h = this.$_instance.find(".content").height();
		this.$_instance.find(".content").css("margin-left", -w/2);
		this.$_instance.find(".content").css("margin-top", -h/2);
	};

	// Modal 기능
	PopupClass.prototype._setModal = function(){
		// default : modal 
		if(this._modal) return;
		
		// 배경을 없애고 (.popup)과 (.content)의 크기 위치를 일치 시킨다.
		// 이 작업을 해야만 popup 아래의 버튼이 정상적으로 마우스 이벤트를 받을 수 있다.
		this.$_instance.find(".background").remove();
		
		// popup class의 속성을 바꿈
		this.$_instance.css("position", "absolute");
		this.$_instance.css("margin", "auto");
		
		var w = $(this.$_instance).find(".content").width();
		var h = this.$_instance.find(".content").height();
		this.$_instance.width(w);
		this.$_instance.height(h);
	};

	//-----------------------------------
	// 팝업창 닫힘
	//-----------------------------------
	//
	PopupClass.prototype.close = function (data){
		
		this.$_instance.remove();
		
		// callback 호출
		if(this.callback != null){
			this.callback.apply(this, [data]);
		}
	};
	
	///////////////////////////////////
	// 위치 이동 기능 (드래그)
	///////////////////////////////////
	
	// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
	PopupClass.prototype.setTopIndex = function(){
		this.$_instance.appendTo(this.$_popupOwner);
	};
	
	PopupClass.prototype._setDrag = function(){
		if(this._movable == false) return;
		
		// 드래그 대상
		var $_dragTarget = (this._modal)? this.$_instance.find(".content"):this.$_instance;
		
		// 위치 이동 저장
		var _tempX = 0;
		var _tempY = 0;
		
		var mouseUtil = {
			minX:0,
			minY:0,
			maxX:0,
			maxY:0,
			_onMouseDown : function (event){
				_tempX = event.pageX;
				_tempY = event.pageY;
				
				var target = $(document);
				target.on("mousemove", $.proxy(mouseUtil._onMouseMove, this));
				target.on("mouseup", $.proxy(mouseUtil._onMouseUp, this));
				
				var offset = $_dragTarget.offset();
				
				// position:fixed 일때 스크롤 위치에 영향받음
				if(this.$_instance.css("position") =="fixed"){
					offset.left = offset.left - this.$_popupOwner.scrollLeft();
					offset.top = offset.top - this.$_popupOwner.scrollTop();
				}
				$_dragTarget.css("left", offset.left);
				$_dragTarget.css("top", offset.top);
				
				// margin의 영향을 없앰
				$_dragTarget.css("margin", "0px");
				
				// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
				this.setTopIndex();

				// 드래그 범위 지정
				mouseUtil._setLimit();
				
				// prevents text selection
				return false;
			},
			_onMouseMove : function (event){
				
				var offset = $_dragTarget.offset();
				var x = offset.left;
				var y = offset.top;
				
				// 이동 거리
				x += event.pageX - _tempX;
				y += event.pageY - _tempY;
				
				// 한계 설정
				var limit = mouseUtil._checkLimit(x,y);
				x = limit.x;
				y = limit.y;
				
				// 위치 갱신
				$_dragTarget.css("left", x);
				$_dragTarget.css("top", y);
				
				_tempX = event.pageX;
				_tempY = event.pageY;
			},
			_onMouseUp : function (event){
				var target = $(event.currentTarget);
				target.off("mousemove", $.proxy(mouseUtil._onMouseMove, this));
				target.off("mouseup", $.proxy(mouseUtil._onMouseUp, this));
				
				// 이벤트 발송
				//this.dispatchChangeEvent();
			},
			
			// 드래그 허용 범위 설정
			_setLimit : function(){
				var offsetX = $_dragTarget.width()/2;
				var offsetY = $_dragTarget.height()/2;
				
				mouseUtil.minX = -offsetX;
				mouseUtil.minY = 0;
				mouseUtil.maxX = window.innerWidth - offsetX;
				mouseUtil.maxY = window.innerHeight - offsetY;
			},
			// 드래그 허용 범위내의 값으로 변환
			_checkLimit : function(x,y){
				//console.log(x,y,mouseUtil.minX, mouseUtil.minY);
				if(mouseUtil.minX > x) x = mouseUtil.minX;
				if(mouseUtil.maxX < x) x = mouseUtil.maxX;
				
				if(mouseUtil.minY > y) y = mouseUtil.minY;
				if(mouseUtil.maxY < y) y = mouseUtil.maxY;
				
				return {x:x, y:y};
			}
		};

		// 드래그 버튼 기능
		var dragger = this.$_instance.find(".title");
		dragger.on("mousedown", $.proxy(mouseUtil._onMouseDown, this));
		
	};
	


	
	
	
	//return PopupClass;
//});













