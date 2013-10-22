
// Boxer plugin
$.widget("ui.boxer", $.extend({}, $.ui.mouse, {

	_init: function() {
		this.element.addClass("ui-boxer");
		this.dragged = false;

		this._mouseInit();

		this.helper = $(document.createElement('div'))
		.css({ background:'rgba(0,0,0,0.7)'})
		.addClass("ui-boxer-helper");
		$('.dim').html('<b>W</b>: 0px, <b>H</b>: 0px');

	},

	destroy: function() {
		this.element
		.removeClass("ui-boxer ui-boxer-disabled")
		.removeData("boxer")
		.unbind(".boxer");
		this._mouseDestroy();

		return this;
	},

	_mouseStart: function(event) {

		wirepanel.hide();
		
		saveState();

		if (gridsize==0 && $('select#grid-type').val() == "col" && $('#snap-to-grid').attr('checked') == true) {
			guides = $.map( $( ".col" ), computeColForElement );
		}
		if (!event.ctrlKey && !event.shiftKey) {
			$('#canvas .selected').removeClass('selected');
		}
		$('#canvas .latestwire').removeClass('latestwire');
		// $( "#guide-v , #guide-h" ).hide();
		
		// $('#lock').find("span").addClass("icon-lock").removeClass('icon-unlock');
		$('#lock , #group').removeClass('pressed');	

		$('.blank').remove();

		var self = this;

		this.opos = [event.pageX, event.pageY];

		if (this.options.disabled)
			return;

		var options = this.options;

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);
		this.helper.css({
			"z-index": 1000,
			"position": "absolute",
			"left": event.clientX,
			"top": event.clientY,
			"width": 0,
			"height": 0
		});
	},

	_mouseDrag: function(event) {

		var self = this;
		this.dragged = true;

		if (this.options.disabled)
			return;

		var options = this.options;
		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2 && y1 > y2){this.helper.addClass('selecting');}
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp2 = y2; y2 = y1; y1 = tmp2; }

		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1})
		if (!this.helper.hasClass('selecting')) {
			var greyshade = 0.1+(x2-x1)/cwidth;
			if (greyshade>=0.7){greyshade=0.7;}
			this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1}).css({ background:'rgba(0,0,0,'+greyshade+') url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIUlEQVQYV2NkYGCQBGJ08BxdgHGIKMTiF0wPgjwz2BUCADTeBYguWvyCAAAAAElFTkSuQmCC)'});
		}
		$('.dim').html('<b>W</b>: ' + parseInt((x2-x1-1),10) + 'px, <b>H</b>: ' + parseInt((y2-y1-1),10)+'px');

		this._trigger("drag", event);

		return false;
	},

	_mouseStop: function(event) {
		// $('.brandnew').removeClass('brandnew');
		$('.dimnow').remove();
		var self = this;

		this.dragged = false;

		var options = this.options;
		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;

		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp2 = y2; y2 = y1; y1 = tmp2; }
		var offset_c = $('#canvas').offset();
		$(".wirejr").each(function() {
			var index_current = parseInt($(this).css("zIndex"), 10);
			if (index_current > index_highest) {
				index_highest = index_current;
			}
		});
		var cloneX1=x1-offset_c.left;
		var cloneY1=y1-offset_c.top;
		clonewidth =  x2-x1-2;
		cloneheight =  y2-y1-2;
		if (gridsize>0) {
			cloneX1=Math.round(cloneX1 / gridsize) * gridsize;
			cloneY1=Math.round(cloneY1 / gridsize) * gridsize;
			clonewidth=Math.round(clonewidth / gridsize) * gridsize;
			cloneheight=Math.round(cloneheight / gridsize) * gridsize;
			var clone = this.helper.clone().css({left: cloneX1, top: cloneY1,"z-index": index_highest+1,width:clonewidth, height:cloneheight})
			.removeClass('ui-boxer-helper').appendTo(this.element).addClass('brandnew blank');
			if (cloneX1>20) {
				$('.dim').html('<b>W</b>: ' + (clonewidth) + 'px, <b>H</b>: ' + (cloneheight) + 'px');
			}else{
				$('.dim').html('<b>W</b>: 0px, <b>H</b>: 0px');
			}
		}
		else if (gridsize==0 && $('select#grid-type').val() == "col" && $('#snap-to-grid').attr('checked') == true) {
			if (clonewidth>20 || cloneheight>20) {
			// var w = ui.size.width - 1;
			// var h = ui.size.height - 1;
			function closest (num, arr) {
				var curr = arr[0];
				var diff = Math.abs (num - curr);
				for (var val = 0; val < arr.length; val++) {
					var newdiff = Math.abs (num - arr[val]);
					if (newdiff < diff) {
						diff = newdiff;
						curr = arr[val];
					}
				}
				return curr;
			}

			
			guides1 = []; guides2 = [];
			for (var i = 0; i < guides.length; i = i+2) {
				guides1.push(guides[i]);
			};
			for (var i = 1; i < guides.length; i = i+2) {
				guides2.push(guides[i]);
			};
			cloneX1=closest (cloneX1, guides1);
			clonewidth=  closest((x2-offset_c.left), guides2) - cloneX1;
			var clone = this.helper.clone().css({left: cloneX1, top: cloneY1,"z-index": index_highest+1,width:clonewidth, height:cloneheight})
			.removeClass('ui-boxer-helper').appendTo(this.element).addClass('brandnew blank');
			if (clonewidth>20 || cloneheight>20) {
				$('.dim').html('<b>W</b>: ' + (clonewidth) + 'px, <b>H</b>: ' + (cloneheight) + 'px');
			}else{
				$('.dim').html('<b>W</b>: 0px, <b>H</b>: 0px');
			}
		}else{this.helper.remove();}

	}
	else{
		var corr=0;
		if (!$canvaswrap.hasClass('browser-wrap')) {corr = 1;}
		var clone = this.helper.clone().css({left:cloneX1-corr, top: cloneY1-corr,"z-index": index_highest+1})
		.removeClass('ui-boxer-helper').appendTo(this.element).addClass('brandnew blank');
		if (x2-x1>20) {
			$('.dim').html('<b>W</b>: ' + (x2-x1-1) + 'px, <b>H</b>: ' + (y2-y1-1)+'px');
		}else{
			$('.dim').html('<b>W</b>: 0px, <b>H</b>: 0px');
		}
	}

	this._trigger("stop", event, { box: clone });
	this.helper.removeClass('selecting').css("background","transparent").remove();

	return false;
}

}));
$.extend($.ui.boxer, {
	defaults: $.extend({}, $.ui.mouse.defaults, {
		appendTo: 'body',
		distance: 0
	})
});

if ($('#1').length) {

	var activepage = $('#1');
}else{
	var activepage = $('#canvas');
}


useboxer();

function useboxer() {


	activepage.boxer({
		cursor: 'pointer',
		stop: function(event, ui) {
			if ($('.brandnew').hasClass("selecting")) {
				var colliders_selector = ".brandnew";
				if (multipaged) {
					var obstacles_selector = "#canvas .page:visible .wire";
				}else{
					var obstacles_selector = ".wire";
				}
				var hits = $(colliders_selector).collision(obstacles_selector);
				hits.not(".groupmember").addClass('selected').draggable('enable');
				if ($('#canvas .selected.locked').length) {
					// $('#lock').find("span").addClass("icon-unlock").removeClass('icon-lock');
					$('#lock').addClass('pressed');	
				}
				if ($('#canvas .selected.grouped').length) {
					$('#group').addClass('pressed');	
				}

				$('#canvas .brandnew').remove();
			}
			else{
				var box_h= ui.box.height();
				var box_w= ui.box.width();
				if(ui.box.width()>20 || ui.box.height()>20){
					$('#icons').show().siblings().hide();
					aspect_ratio($('#canvas .blank'));
					$('#annotate').show();
					$('#textinput').removeClass('lasticon');
					var boxposition = ui.box.position();
					var boxtop = boxposition.top;
					var boxleft = boxposition.left;
					var offset_c = $('#canvas-wrap').position();
					var newtop=boxtop+offset_c.top-40;

					var wirepanelhidth = wirepanel.width();
					var panel_left=boxleft+(box_w/2)-(wirepanelhidth/2)+offset_c.left;
					if(panel_left<=0){
						panel_left=0;
					}

					wirepanel.css({top:newtop , left:panel_left});

					wirepanel.show();

			//////////////

			if ($('.brandnew').length){



				$('#wirepanel .icon').hover(function(){
					type=$(this).attr('elementtype');
					
					prepareWire();

					$('#wirepanel .icon').click(function(){
						insertWire();
					});

				});

			}
			////////////

		}
		else{
			ui.box.remove();

		}

	}
}


});
}
