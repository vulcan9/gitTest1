$(function() {
	var offset_c = $('#canvas').offset();

	$(".editable").editnibble('hideAllEditors');
	$('#show-bg').hide();
	if ($('#canvas .txtcont span:empty').length) {
		$('.txtcont span:empty').text(paragraphtext);
	}
	if ($('#canvas .listcont:empty').length) {
		var lst =$('.listcont:empty');
		lst.each(function () {
			
			var lpc = $(this).parent().attr('data-color');
			$(this).html(list).find('li span').css({'background-color':lpc});
		})
	}
	if ($('#canvas').height()>600) {
		$('.container').css('overflow-y','auto');
		supercanvas.css("height",(parseInt($('#canvas').height(),10)+250)+'px');
	}
	if (!$('#canvas #grid-div').length) {
		$('#canvas').prepend($('.grids').show().contents().unwrap());
		$('#show-grid').attr('checked',true);
		var gridtype = $canvaswrap.attr('data-grid');
		switch(gridtype)
		{
			case 'graph':
			$('#grid-div').show();
			$('#gridcol , #grid-dot').hide();
			$('select#grid-type').val("graph");
			break;
			case 'dots':
			$('#grid-dot').show();
			$('#gridcol , #grid-div').hide();
			$('select#grid-type').val("dots");
			break;
			case 'col':
			$('#gridcol').show();
			$('#grid-div , #grid-dot').hide();
			$('select#grid-type').val("col");
			break;
			default:
			$('#grid-div , #grid-dot , #gridcol').hide();
			$('#show-grid').attr('checked',false);
		}

	}
	if ($canvaswrap.hasClass('mobile') && !$canvaswrap.hasClass('tablet')) {$('.device-mobile').insertBefore($('.device-window'));}
	if ($canvaswrap.hasClass('mobile-landscape')) {$('.device-mobile-landscp').insertBefore($('.device-window'));}
	if ($canvaswrap.hasClass('tablet')) {$('.device-tablet').insertBefore($('.device-window'));}
	imgs = $( '.device-wrap span' );

	$('#canvas .wire').has('.headlinetxt').addClass('hastext');
	$('.textnew.ui-draggable').draggable('destroy');
	$canvaswrap.center();

	$('#canvas .locked').draggable('destroy').resizable('destroy');



	
});
$('#canvas .wire').not('#canvas .wire:has(.wirejr)').css({'border-style':'solid'});

if ($('#canvas .page').length) {
	var multipaged  = true;
}


var multipaged;
var supercanvas = $('.supercanvas');
var exporting = $('.exporting');
var gridsize = 0;
var imgs;
var wirePresent = true;
var wirepanel=$('#wirepanel');
var annotPresent = true;
var offset_c = $('#canvas').offset();
var cwidth=$("#canvas-wrap").width();
var MIN_DISTANCE = 6; 
var guides = []; 
var innerOffsetX, innerOffsetY;
var offseta1 = $('#canvas').offset();
var defbw = 1;
var defstrcolor = '#444';
var defbgcolor = 'white';
var clonewidth =  0;
var cloneheight =  0;
var $canvaswrap = $('#canvas-wrap');
var index_highest = 0;
var sttngs = $('.settings span i');
var sett = $('.settings');
var $sitemapicon = $('#sitemap icon i');
var previewMode;
if ($('.container').hasClass('preview')) {previewMode=true}

	$(document).ready(function() {
		setgridsize();
		$('.left , .icon , .colorpicker , .brcolor , #show-border , .stroke_width , #edit , #edittxt , #front , #back , #show-bg , #lock , #unlock , .tooltip').tipsy({delayIn: 600});
		$('.device-wrap span ').tipsy({delayIn: 1000 , gravity: 'nw'});
		$(document).keydown(function(e) {
			var edt1 = $(document.activeElement).hasClass('editingtext');
			var edt2 = $(document.activeElement).hasClass('editor-form-element');
			var edt3 = $(document.activeElement).hasClass('input');
			var edt4 = $('.appriseInner').length;
			var ajaxl = $ajaxlogin.is(':visible');
			var sel = $('#canvas .selected').length;
			if (e.keyCode === 8 && !edt1 && !edt2 && !edt3 && !edt4 && !sel )
			{
				return false;
			}else if (e.keyCode === 8 && sel && !edt1 && !edt3 && !edt2 && !edt4 && !ajaxl){
				e.preventDefault();
				$('#canvas .selected').remove();
			}
		});
		updateCanvasInput();
		if (!previewMode) {$('.aa').draggable().resizable({handles:'all'});}
	});

positionAA();

function updateCanvasInput () {
	var cw=parseInt($canvaswrap.width(),10);
	var ch=parseInt($canvaswrap.height(),10);

	$('.canvassize').html("<b>canvas</b>: "+ cw+"/"+ ch+"px");

	$('#canvas_w_val').val(cw);
	$('#canvas_h_val').val(ch);
}

$('#show-grid').bind('click', function() {
	if ($(this).is(':checked')) {
		if ($('select#grid-type').val()== "graph") {
			$('#grid-div').show();
			$('#gridcol , #grid-dot').hide();
			$canvaswrap.attr('data-grid','graph');
		}else if ($('select#grid-type').val()== "dots") {
			$('#grid-dot').show();
			$('#gridcol , #grid-div').hide();
			$canvaswrap.attr('data-grid','dots');
		}
		else{	$('#gridcol').show();
		$canvaswrap.attr('data-grid','col');
		$('#grid-div , #grid-dot').hide();
	}
}else{
	$('#grid-div , #gridcol , #grid-dot').hide();
	$canvaswrap.attr('data-grid',0);
}
})
if (!$('#gridcol').is(':visible') && !$('#grid-div').is(':visible')) {
	$('#show-grid').removeAttr('checked');
}
$('select#grid-type').change(function () {
	if ($('select#grid-type').val()== "graph") {
		$('#grid-div').show();
		$('#gridcol , #grid-dot').hide();
		$('#show-grid').attr('checked','checked');
		$canvaswrap.attr('data-grid','graph');
	}else if ($('select#grid-type').val()== "dots") {
		$('#grid-dot').show();
		$('#gridcol, #grid-div').hide();
		$('#show-grid').attr('checked','checked');
		$canvaswrap.attr('data-grid','dots');
	}else{	$('#gridcol').show();
	gridsize =0;
	$('#grid-div , #grid-dot').hide();
	$('#show-grid').attr('checked','checked');
	$canvaswrap.attr('data-grid','col');
}
});

function setgridsize() {
	gridsize = $canvaswrap.attr('snappy');
	if (gridsize > 0) {
		$('.grid-size-val').text(gridsize);
		$('#snap-to-grid').attr('checked',true);
		updategrid(gridsize);
		$('#grid-slider').slider( "value", gridsize );
	}else if(gridsize =="col"){
		$('#snap-to-grid').attr('checked',true);
		$('select#grid-type').val("col");
		gridsize=0;
		updategrid("col");
	}
	else{
		updategrid(20);
		$('#grid-slider').slider( "value", 20 );
	}

	
}

$('#empty').click(function(){

	var r=confirm("Do you want to clear the canvas?");
	if (r===true)
	{
		window.location = '/';
	}
	else
	{
		return;
	}

});

var imgs = $( '.device-wrap span' );

$('.device-mobile').click(function  () {
	if (!$(this).is(':first-child')) {
		$(this).insertBefore( imgs.eq(0) );

		$canvaswrap.addClass('mobile').removeClass('browser-wrap , mobile-landscape , tablet').css({'width':'320px','height':'480px'}).center();
		$('.wire').resizable('option', 'maxWidth', 320);
		offset_c = $('#canvas').offset();
		supercanvas.css("height",'100%');
		updateCanvasInput();
		imgs = $( '.device-wrap span' );
	}
});

$('.device-tablet').click(function  () {
	if (!$(this).is(':first-child')) {
		$(this).insertBefore( imgs.eq(0) );
	// imgs.eq(0).insertAfter( imgs.eq(1) );
	// imgs.eq(2).insertAfter( imgs.eq(1) );

	$canvaswrap.addClass('mobile , tablet').removeClass('browser-wrap , mobile-landscape').css({'width':'728px','height':'1024px'}).center();
	$('.container').css("overflow-y","auto");
	supercanvas.css("height",'1350px');
	$('.wire').resizable('option', 'maxWidth', 728);
	offset_c = $('#canvas').offset();
	imgs = $( '.device-wrap span' );
	updateCanvasInput();}
});

$('.device-window').click(function  () {
	if (!$(this).is(':first-child')) {
		$(this).insertBefore( imgs.eq(0) );

		$canvaswrap.removeClass('mobile , tablet , mobile-landscape').addClass('browser-wrap').css({'width':'820px','height':'480px'}).center();
		$('.wire').resizable('option', 'maxWidth', 820);
		offset_c = $('#canvas').offset();
		updateCanvasInput();
		supercanvas.css("height",'100%');
		imgs = $( '.device-wrap span' );}
	});

$('.device-mobile-landscp').click(function  () {
	if (!$(this).is(':first-child')) {
		$(this).insertBefore( imgs.eq(0) );

		$canvaswrap.addClass('mobile-landscape').removeClass('browser-wrap , mobile , tablet').css({'width':'480px','height':'320px'}).center();
		$('.wire').resizable('option', 'maxWidth', 480);
		offset_c = $('#canvas').offset();
		updateCanvasInput();
		supercanvas.css("height",'100%');
		imgs = $( '.device-wrap span' );}
	});

$('#show-annotation').click(function(){
	$('#canvas .aa , #canvas .publiccomment').show();
	$('#hide-annotation').show();
	$(this).hide();
});

$('#hide-annotation').click(function(){
	$('#canvas .aa , #canvas .publiccomment').hide();
	$('#show-annotation').show();
	$(this).hide();
});

$('#edit-wire').click(function(){
	$('#canvas .selected').dblclick();
});

$('#lock').click(function  () {
	lock();
});

function lock () {
	if (multipaged) {
		var $s = $('#canvas .page:visible .selected');
	}else{
		var $s = $('#canvas .selected');
	}
	if ($s.length && !$('#canvas .selected.locked').length) {
		$s.addClass('locked , icon-').draggable("destroy").resizable("destroy");
		$('#lock').addClass('pressed');	
		
	}
	else if ($('#canvas .selected.locked').length) {
		$('#canvas .selected.locked').removeClass('locked ');
		$('#lock').removeClass('pressed');	
		makeDrag($s);
	}
}
var $ajaxlogin = $('#ajaxlogin');
$ajaxlogin.hide();
var supports_pushState = 'pushState' in history;

$('#save').click(function() {
	$('#canvas .page:visible .selected').removeClass('selected');
	$('#canvas .wire , #canvas .aa , #canvas .publiccomment').draggable("destroy").resizable("destroy").removeClass('ui-re');
	$canvaswrap.resizable("destroy");
	var wireHTML = supercanvas.clone().find('.txtcont span').empty().end().find('.listcont').empty().end().find('.aa , .publiccomment').remove().end().find('#grid-div, #gridcol , #guide-h , #guide-v , #grid-dot').remove().end().html();
	var datastr = encodeURIComponent(wireHTML);
	var aaHTML = "";
	$('#canvas .publiccomment , #canvas .aa').each(function () {
		$(this).attr("data-parent",$(this).parent().attr('id'));
		aaHTML += $(this).outerHTML();
	});
	var aastr = encodeURIComponent(aaHTML);
	$.ajax({
		type:'POST',
		url:'../save',
		data:{note : datastr, name:filename , aa:aastr },
		success:function (result){
			switch (result){
				case 'login': 
					// not logged in
					localStorage.setItem(filename, wireHTML);
					localStorage.setItem(filename+'aa', aaHTML);
					$ajaxlogin.find('.wrongpass').hide();
					$ajaxlogin.show().submit(function (event) {
						event.preventDefault();
						$.ajax({
							type:'POST',
							url:'../ps/ajaxlogin.php',
							data: $ajaxlogin.serialize(),
						    success: function( response ) {
							        console.log( response );
							        if (response==0){
							        	$ajaxlogin.find('.wrongpass').show();
							        }
							        else{
							        	$.ajax({
							        		type:'POST',
							        		url:'../save',
							        		data:{note : datastr, name:filename , aa:aastr },
							        		success: function () {
							        			$('.saved').show().delay(600).fadeOut();
		        								MakeCanvasDrag();
		        								makeDrag($('#canvas .wire'));
		        								$('#canvas .publiccomment , #canvas .aa').draggable().resizable({handles:'all'});
		        								localStorage.removeItem(filename);
		        								localStorage.removeItem(filename+'aa');
		        								$ajaxlogin.hide();
												_paq.push(['trackGoal', 3]);

							        		}
							        	});
							        }
							      }
						});
					});
				_paq.push(['trackGoal', 2]);
				
				break;	
				default:
					$('.saved').show().delay(600).fadeOut();
					MakeCanvasDrag();
					makeDrag($('#canvas .wire'));
					$('#canvas .publiccomment , #canvas .aa').draggable().resizable({handles:'all'});
					localStorage.removeItem(filename);
					localStorage.removeItem(filename+'aa');
					console.log('saved');
			}
		},
		error:function() {
			// console.log(jqXHR , textStatus);
			localStorage.setItem(filename, wireHTML);
			localStorage.setItem(filename+'aa', aaHTML);
			MakeCanvasDrag();
			makeDrag($('#canvas .wire'));
			$('#canvas .publiccomment , #canvas .aa').draggable().resizable({handles:'all'});
			_paq.push(['trackGoal', 1]);
		}
	});
});

$('#fork').click(function() {
	$('#canvas .page:visible .selected').removeClass('selected');
	$('#canvas .wire , #canvas .aa , #canvas .publiccomment').draggable("destroy").resizable("destroy").removeClass('ui-re');
	$canvaswrap.resizable("destroy");
	var wireHTML = $(".supercanvas").clone().find('.txtcont span').empty().end().find('.listcont').empty().end().find('.aa , .publiccomment').remove().end().find('#grid-div, #gridcol , #guide-h , #guide-v , #grid-dot').remove().end().html();
	var datastr = encodeURIComponent(wireHTML);
	var aaHTML = "";
	$('#canvas .publiccomment , #canvas .aa').each(function () {
		$(this).attr("data-parent",$(this).parent().attr('id'));
		aaHTML += $(this).outerHTML();
	});
	var aastr = encodeURIComponent(aaHTML);
	var t = $.now();
	$.post('../fork', {'note' : datastr, 'name':filename , 'aa':aastr , 'timestamp': t },function (){
		console.log(t);
		$('.saved').show().delay(600).fadeOut();
		MakeCanvasDrag();
		makeDrag($('.wire'));
		$('#canvas .publiccomment , #canvas .aa').draggable().resizable({handles:'all'});
	});
});
$('#savefree').click(function() {
	var newURL=true;
	
	$('#canvas .selected').removeClass('selected');
	$('#canvas .wire , #canvas .aa ').draggable("destroy").resizable("destroy").removeClass('ui-re');
	$canvaswrap.resizable("destroy");
	var wireHTML = $(".supercanvas").clone().find('.txtcont span').empty().end().find('.listcont').empty().end().find('#grid-div, #gridcol , #guide-h , #guide-v , #grid-dot').remove().end().html();
	var datastr = encodeURIComponent(wireHTML);

	if(filename===0){filename=randomID(6);}else{newURL=false;}

	if ( supports_pushState ) {

		history.pushState( {},'filename', '/'+filename);
	} else {
		location.hash = '#'+filename;
	}
	$.post('save.php', { 'note' : datastr, 'name':filename },function (){
		MakeCanvasDrag();
		if (newURL) { $('.savedURL').html('http://wireframe.cc/'+filename);
		$('.save-wrap').fadeIn().delay(1600).fadeOut();

	}else{$('.saved').fadeIn().delay(600).fadeOut();}
	makeDrag($('#canvas .wire'));
	makeDrag($('#canvas .aa'));

});
});

if (!$('#slogan').length) {
	$('.controls').fadeIn();
};

function showSaveButton(){
	$('#slogan').fadeOut('fast',function(){
		$('.controls').fadeIn();
		$('#links').addClass('linksmin');
		
	});
}
function InstantShowSaveButton(){
	$('#slogan').hide();
	$('#links').addClass('linksmin');
	$('#demo').hide();
	$('.controls').show();
}
$('.orstart').click(InstantShowSaveButton);

$('.closeannot , .closeURLpopup').click(function(){
	var delit=$(this).parent();
	delit.remove();
	if (previewMode) {saveComment();} 
});



function divClicked(event) {
	$('#canvas').boxer('destroy');
	// event.stopPropagation();
	// $('.thelatest').addClass('thelatest');
	$(this).parent().addClass('latest');
	var divHtml = $(this).html().replace(/<br>/gi,"\n");
	var editableText = $("<textarea class='editingtext'/>");
	editableText.val($('<div />').html(divHtml).text()).addClass('textareanow');
	$(this).replaceWith(editableText);
	editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
    $('.latest .ok').show();
    $('textarea').autosize();
    $('.annotbox').addClass('textareainside');
    $('.ok').click(editableTextBlurred);
}
function edittext(event) {
	if (!previewMode) {
		event.stopPropagation();
		activepage.boxer('destroy');
	// $('.thelatest').addClass('thelatest');
	var parent = $(this).closest('.text');
	// parent.addClass('latest');
	// parent.parent().addClass('editedtext');
	$(this).parent().parent().parent().removeClass('selected');
	var divHtml = $(this).html().replace(/<br>/gi,"\n");
	var editableText = $("<textarea class='editingtext' tabindex='-1' ></textarea>");
	editableText.val($('<div />').html(divHtml).text());
	$(this).replaceWith(editableText);
	editableText.focus();
    // setup the blur event for this new textarea
    editableText.bind('blur',textblur);
    // $('.latest .ok').show();
    editableText.autosize();
    // $('.text').addClass('textareainside');
    // $('.ok').click(textblur);
}
}
function focustext () {
	$('.latest .editingtext').focus();
}

function textblur() {
	if (!previewMode) {useboxer();}
	if (multipaged) {
		var $tarea = $('#canvas .page:visible .editingtext');
	}else{
		var $tarea = $('#canvas .editingtext');
	}
	var html = $tarea.val().replace(/\n/gi,"<br>");
	var viewableText = $("<div>");
	if (html ===''){
		html='...';
	}
	viewableText.html(html).addClass('textme');
	$tarea.replaceWith(viewableText);
	var tareaH = viewableText.css('height');
	viewableText.dblclick(edittext).closest('.wire').css({'height':tareaH , 'position':'absolute'});
	viewableText.dblclick(edittext).closest('.wirejr').draggable('destroy');
}

$('.textme').dblclick(edittext);

function editableTextBlurred() {
	if (!previewMode) {useboxer();}
	$('.textareanow').parent().removeClass('latest');
	var html = $('.textareanow').val().replace(/\n/gi,"<br>");;
	var viewableText = $("<div>");
	if (html ===''){
		html='...';
	}
	viewableText.html(html);
	$('.textareanow').replaceWith(viewableText);
    // setup the click event for this new div
    viewableText.click(divClicked);
    $('.ok').hide();
    if (previewMode) {
    	saveComment();
    	viewableText.parent().parent().draggable({cancel:'.annotbox , .closeannot', cursor:'move'}).resizable({handles:'all'});

    }

}

$('.ok').click(editableTextBlurred);




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

function prepareWire () {
	// $('.locked.selected').removeClass('selected');
	var $bb = $('.brandnew');
	var box_h= $bb.height();
	$bb.removeAttr('class').addClass('wirejr brandnew blank latestwire').empty().css({ background:defbgcolor,width:(clonewidth-defbw*2+1), height:(cloneheight-defbw*2+1),'border-width':defbw+'px','border-color':defstrcolor , 'color': defstrcolor});
	$bb.addClass('new').addClass(type).css('margin-top',0);
	if (type=='annotate'){

		$('.brandnew.annotate').removeClass('wire').addClass('aa').append(annotationhtml).draggable({cancel:'.annotbox , .closeannot', cursor:'move'});

	}

	if (type=='slider2'|| type=='line_hor'){
		$bb.addClass('resizeX');
	}
	if (type=='slider'){
		$bb.css('margin-top',(box_h/2)-3).removeClass('slider').addClass('slider2').append("<span>").find('span').css('background',defstrcolor);
	}
	if (type=='line_hor'){
		$bb.css('margin-top',box_h/2);
	}
	if (type=='scrollh'){
		$bb.css('margin-top',(box_h/2)-10);
	}

	if (type=='paragraph'){
		$bb.append(paragraph).find('span').css('background',defstrcolor);
	}
	if (type=='textinput'){
		$bb.removeClass('textinput').addClass('textinput2').append("<span>|</span>");
	}
	if (type=='combobox'){
		$bb.removeClass('combobox').addClass('combobox2').append("<span>&#9660;</span>");
	}
	if (type=='scrollh'){
		$bb.removeClass('scrollh').addClass('scrollh2').append("<span class='arrL'>&#9664;</span>").append("<span >&#9654;</span>");
	}
	if (type=='progressbar'){
		$bb.removeClass('progressbar').addClass('progressbar2').append("<span></span>");
	}

	if (type=='list'){
		$bb.append(list).find('span').css('background',defstrcolor);
	}


	if (type=='headlinetxt'){
		$bb.addClass('lastheadline textnew').append(texthtml);
		

	}


	if ($bb.hasClass('headline')){
		$('.brandnew.headline').html(headtxt).find('.headtext span').css('background',defstrcolor);
	}
	if ($bb.hasClass('image')){

		$bb.svg();
		var imgwidth=$bb.width();
		var imgheight=$bb.height();
		var svg = $bb.svg('get'); 

		svg.line( 0, imgheight, imgwidth, 0,{class: 'line1',stroke: defstrcolor, strokeWidth: defbw}); 
		svg.line( 0, 0, imgwidth, imgheight,{class: 'line2',stroke: defstrcolor, strokeWidth: defbw}); 
		$bb.addClass('hasSVG');
	}
}


function insertWire () {
	if ($('#canvas .brandnew').length){
		if (type!=='annotate'){
			var b=$('.brandnew');
			b.wrap("<div class='wire'></div>");
			var bp = b.closest('.wire');
			var brw = b.width();
			var brh = b.height();
			var bpos = b.position();
			var brt = bpos.top;
			var brl = bpos.left;
			$("#canvas .wirejr").not('.aa').each(function() {
				var index_current = parseInt($(this).css("zIndex"), 10);
				if (index_current > index_highest) {
					index_highest = index_current;
				}
			});
			bp.css({'top':brt,'left':brl,'width':brw+(defbw*2), 'height':brh+(defbw*2)});
			b.css('cssText', 'top: 0 !important;left: 0 !important;height:'+brh+'px;width:'+brw+'px;border-width:'+defbw+'px;'+'border-color:'+defstrcolor+';color:'+defstrcolor+';background:'+defbgcolor+';z-index:'+ (index_highest+1)+';');
			if (b.is('.aa')) {
				b.css('z-index','5000').removeClass('wirejr');
			}

	// background:defbgcolor,width:(clonewidth-defbw*2+1), height:(cloneheight-defbw*2+1),'border-width':defbw+'px','border-color':defstrcolor , 'color': defstrcolor
	// $('textarea').focus();
	makeDrag(bp);
}else{makeDrag($('.brandnew'));$('.brandnew').removeClass('wirejr').css('z-index',5000);}

if (type=='headlinetxt'){
	$('.brandnew').parent().addClass('hastext');
	$(".textme").click(edittext);
	$(".thelatest").click();
	$('.textnew.lastheadline').removeClass('lastheadline');

			// $('.brandnew').addClass('lastheadline text3').text('sample text again').attr('contenteditable',true).focus();
		}

		if (type=='annotate'){
			// $('.brandnew.aa').css('z-index','5000');
			$(".editme").click(divClicked);
			$(".thelatest").click();
			$('.closeannot').click(function(){
				var delit=$(this).parent();
				delit.remove();
			});
		}

		$('.brandnew').removeClass('blank brandnew');
		if (wirePresent){
			var anywire =$('.wire').length;
			if (anywire > 0){
				showSaveButton();
				wirePresent = false;
			}
		}
		wirepanel.fadeOut('fast');
	}
}
var type;

$('.headlinetxt').click(function() {
	$(this).draggable( {disabled: false});
}).dblclick(function() {
	$(this).draggable({ disabled: true });
});

function makeDrag (tt) {
	$('.wire').mousedown(function(event) {
		var cloned='';
		if (event.altKey==1) {

			$(this).draggable('option', 'helper','clone');

			$('#canvas').droppable(
			{
				drop: function(event, ui) {
					saveState();

					$('#canvas .selected').removeClass('selected');
					var cloned=$(ui.helper).clone();
					if (multipaged) {
						cloned.appendTo('.page:visible').addClass('selected').find('.ui-resizable-handle').remove();
					}else{
						cloned.appendTo('#canvas').addClass('selected').find('.ui-resizable-handle').remove();
					}
					makeDrag(cloned);
					cloned.find(".textme").bind('dblclick',edittext);
					$('.wire').draggable('option', 'helper','none');
					$('#canvas').droppable('destroy');
				}
			});

		}

	});

	tt.not('.groupmember , .wirejr').draggable({
		snap: ".col " ,
		start: function( event, ui ) {
			saveState ();
			oldstroke =parseInt($(this).css('borderLeftWidth'),10);
			if (!event.shiftKey && $('#canvas .selected').length<2 ) {
				$('.selected').removeClass('selected');
			}
			var $sld = $("#canvas .selected");
			
			$('.dim').html('<b>W</b>: ' + ($(this).outerWidth()) + 'px, <b>H</b>: ' + ($(this).outerHeight()) +'px');
			wirepanel.hide();
			$sld.children().removeClass('selected');
			posTopArray = [];
			posLeftArray = [];
					if ($(this).hasClass("selected")) {  // Loop through each element and store beginning start and left positions
						$sld.each(function(i) {
							thiscsstop = $(this).css('top');
							if (thiscsstop == 'auto') thiscsstop = 0; // For IE

							thiscssleft = $(this).css('left');
							if (thiscssleft == 'auto') thiscssleft = 0; // For IE

							posTopArray[i] = parseInt(thiscsstop,10);
							posLeftArray[i] = parseInt(thiscssleft,10);
						});
					}

		begintop = $(this).offset().top; // Dragged element top position.
		beginleft = $(this).offset().left; // Dragged element left position

		if (gridsize==0 && $('select#grid-type').val() == "col" && $('#snap-to-grid').attr('checked') == true) {
			if (multipaged) {
				guides = $.map( $( "#canvas .page:visible .wire, #canvas , #gridcol .col" ).not( this ), computeGuidesForElement );
			}else{
				guides = $.map( $( "#canvas .wire, #canvas , #gridcol .col" ).not( this ), computeGuidesForElement );
			}

		}else if (gridsize==0 ){
			if (multipaged) {
				guides = $.map( $( "#canvas .page:visible .wire, #canvas" ).not( this ), computeGuidesForElement );
			}else{
				guides = $.map( $( "#canvas .wire, #canvas" ).not( this ), computeGuidesForElement );
			}
		}

		innerOffsetX = event.pageX-this.offsetLeft;
		innerOffsetY = event.pageY-this.offsetTop;
	},
	drag: function( event, ui ){
		var leftdiff = $(this).offset().left - beginleft; // Current distance dragged element has traveled horizontally
		var topdiff = $(this).offset().top - begintop; // Current distance dragged element has traveled horizontally

		if ($(this).hasClass("selected")) {
			$sld.each(function(i) {
		$(this).css('top', posTopArray[i] + topdiff); // Move element veritically - current css top + distance dragged element has travelled vertically
		$(this).css('left', posLeftArray[i] + leftdiff); // Move element horizontally - current css left + distance dragged element has travelled horizontally
	});
		}
		// iterate all guides, remember the closest h and v guides
		if (gridsize==0) {
			var offseta1 = $('#canvas').offset();
			var guideV, guideH, distV = MIN_DISTANCE+1, distH = MIN_DISTANCE+1, offsetV, offsetH;
			var $t = $(this);
			var pos = {top:event.pageY-innerOffsetY  , left:event.pageX-innerOffsetX };

			var w = $t.outerWidth() - 1;
			var h = $t.outerHeight() - 1;
			var d;
			$.each( guides, function( i, guide ){
				if( guide.type == "h" ){
					if( ( d = Math.abs( pos.top - guide.y ) ) < distH ){
						distH = d;
						guideH = guide;
						offsetH = 0;
					}
					if( ( d = Math.abs( pos.top - guide.y + h ) ) < distH ){
						distH = d;
						guideH = guide;
						offsetH = h;
					}
				}
				if( guide.type == "v" ){
					if( ( d = Math.abs( pos.left - guide.x ) ) < distV ){
						distV = d;
						guideV = guide;
						offsetV = 0;
					}
					if( ( d = Math.abs( pos.left - guide.x + w ) ) < distV ){
						distV = d;
						guideV = guide;
						offsetV = w;
					}
				}
			} );

			if( distH <= MIN_DISTANCE ){
				$( "#guide-h" ).css( "top", guideH.y ).show();
				ui.position.top = guideH.y - offsetH ;
			}
			else{
				$( "#guide-h" ).hide();
				ui.position.top = pos.top+1;
			}

			if( distV <= MIN_DISTANCE ){
				$( "#guide-v" ).css( "left", guideV.x ).show();
				ui.position.left = guideV.x - offsetV;
			}
			else{
				$( "#guide-v" ).hide();
				ui.position.left = pos.left+1;
			}
		}
		if (gridsize>0) {
			var left = ui.position.left;
			var top = ui.position.top;
			var w = $(this).outerWidth() - 1;
			var h=$(this).outerHeight() - 1;
			var right = ui.position.left + w ;
			var bottom = ui.position.top + h ;
			snappedleft = Math.round(left / gridsize) * gridsize;
			snappedright = Math.round(right / gridsize) * gridsize;
			snappedtop = Math.round(top / gridsize) * gridsize;
			snappedbottom = Math.round(bottom / gridsize) * gridsize;
			var gapleft = Math.abs(snappedleft - ui.position.left);
			var gapright = Math.abs(snappedright - ui.position.left - w);
			var gaptop = Math.abs(snappedtop - ui.position.top);
			var gapbottom = Math.abs(snappedbottom - ui.position.top - h);
			if (gapleft < gapright) {
				ui.position.left=snappedleft;
			}else{
				ui.position.left=snappedright - w ;
			}
			if (gaptop < gapbottom) {
				ui.position.top=snappedtop;
			}else{
				ui.position.top=snappedbottom - h ;
			}

		}
	},
	stop: function( event, ui ){
		$( "#guide-v, #guide-h" ).hide();
		$(this).addClass('selected');

	}
});

var handleTarget; 
var oldstroke =2;

tt.not('.groupmember , .wirejr').resizable({
	maxWidth:cwidth+1,
	autoHide: false,
	start: function (event, ui){	
		if (multipaged) {
			var $sld = $("#canvas .page:visible .selected");
		}else{
			var $sld = $("#canvas .selected");
		}

		$( "#guide-v , #guide-h" ).hide();
		handle = $(this).data('resizable').axis;
		saveState ();
		oldstroke =parseInt($sld.css('borderLeftWidth'),10);
		// handleTarget = $(event.originalEvent.target);
		wirepanel.hide();
			$(this).removeClass('selected');

		

		///
		if (gridsize==0 && $('select#grid-type').val() == "col" && $('#snap-to-grid').attr('checked') == true) {
			if (multipaged) {
				guides = $.map( $( " #canvas .page:visible .wire, #canvas , #gridcol .col" ).not( this ), computeGuidesForElement );
			}else{
				guides = $.map( $( "#canvas .wire, #canvas , #gridcol .col" ).not( this ), computeGuidesForElement );
			}
		}else if (gridsize==0 ){
			if (multipaged) {
				guides = $.map( $( "#canvas .page:visible .wire, #canvas" ).not( this ), computeGuidesForElement );
			}else{
				guides = $.map( $( "#canvas .wire, #canvas" ).not( this ), computeGuidesForElement );
			}
		}
		
	},
	resize: function (event, ui)
	{   

		if (gridsize==0 ) {

			var guideV, guideH, distV = MIN_DISTANCE+1, distH = MIN_DISTANCE+1, offsetV, offsetH;
			var pos = {top:ui.position.top  , left:ui.position.left };

			var w = ui.size.width - 1;
			var h = ui.size.height - 1;
			var d;

			$.each( guides, function( i, guide ){
				if( guide.type == "h" ){
					if( ( d =  pos.top - guide.y  ) < distH  &&   ( d =  pos.top - guide.y  ) > distH*(-1) && handle!=="s" && handle!=="se" && handle!=="sw" ){
						distH = d;
						guideH = guide;
						offsetH = 0;
					}
					if( ( d =  pos.top - guide.y + h ) < distH  &&   ( d =  pos.top - guide.y + h  ) > distH*(-1) && handle!=="n" && handle!=="ne" && handle!=="nw"){
						distH = d;
						guideH = guide;
						offsetH = h;

					}
				}
				if( guide.type == "v" ){
					if( ( d =  pos.left - guide.x  ) < distV  &&   ( d =  pos.left - guide.x  ) > distV*(-1) && handle!=="e" && handle!=="ne" && handle!=="se"){
						distV = d;
						guideV = guide;
						offsetV = 0;
					}
					
					if( ( d =  pos.left - guide.x + w ) < distV  &&   ( d =  pos.left - guide.x + w  ) > distV*(-1) && (handle!=="w" && handle!=="nw" && handle!=="sw" )){
						distV = d;
						guideV = guide;
						offsetV = w;
					}
					// if( distH == 0 && (handle=="w" || handle=="nw" || handle=="sw" ) ){
					// 	distH = 9;
					// }
				}
			} );
			// console.log("h "+distH + "v "+distV);
			if( distH <= MIN_DISTANCE && (handle=="n" || handle=="ne" || handle=="nw" ) ){
				$( "#guide-h" ).css( "top", guideH.y ).show();
				ui.position.top = guideH.y - offsetH ;
				ui.size.height += distH
			}
			else if( distH <= MIN_DISTANCE && (handle=="s" || handle=="sw" || handle=="se")){
				$( "#guide-h" ).css( "top", guideH.y ).show();
				ui.size.height -= distH + 2*oldstroke;
			}
			else if( distV <= MIN_DISTANCE && (handle=="w" || handle=="sw" || handle=="nw")){
				$( "#guide-v" ).css( "left", guideV.x ).show();
				ui.position.left = guideV.x - offsetV;
				ui.size.width += distV + 1;
			}
			else if( distV <= MIN_DISTANCE && (handle=="e" || handle=="se" || handle=="ne")){
				$( "#guide-v" ).css( "left", guideV.x ).show();
				ui.size.width -= distV +2*oldstroke ;
			}
			else{
				$( "#guide-v , #guide-h" ).hide();
			}
		}

		// old svg
		if ($(".ui-resizable-resizing").hasClass('svginside')){
			var imgwidth=ui.size.width;
			$('.ui-resizable-resizing svg ').css('width', imgwidth);
			var imgheight=ui.size.height;
			$('.ui-resizable-resizing svg ').css('height', imgheight);
		}
		// new svg
		if (($(".ui-resizable-resizing").has('hasSVG'))) {
			var imgwidth=$(".ui-resizable-resizing").width();
			var imgheight=$(".ui-resizable-resizing").height();
			var imgstrk = $('.ui-resizable-resizing .line2').attr('stroke-width');
			$('.ui-resizable-resizing .line1').attr('x2',imgwidth-(imgstrk*2));
			$('.ui-resizable-resizing .line1').attr('y1',imgheight-(imgstrk*2));
			$('.ui-resizable-resizing .line2').attr('x2',imgwidth-(imgstrk*2));
			$('.ui-resizable-resizing .line2').attr('y2',imgheight-(imgstrk*2));
			$('.ui-resizable-resizing svg').attr('height',imgheight-(imgstrk*2));
			$('.ui-resizable-resizing svg').attr('width',imgwidth-(imgstrk*2));
		};
		
		// snapping to grid
		if (gridsize>0) {
			
			var left = ui.position.left;
			var top = ui.position.top;
			var w = ui.size.width - 1;
			var h=ui.size.height - 1;
			var right = ui.position.left + w;
			var bottom = ui.position.top + h;
			snappedleft = Math.round(left / gridsize) * gridsize;
			snappedright = Math.round(right / gridsize) * gridsize;
			snappedtop = Math.round(top / gridsize) * gridsize;
			snappedbottom = Math.round(bottom / gridsize) * gridsize;
			var gapleft = Math.abs(snappedleft - ui.position.left);
			var gapright = Math.abs(snappedright - ui.position.left - w);
			var gaptop = Math.abs(snappedtop - ui.position.top);
			var gapbottom = Math.abs(snappedbottom - ui.position.top - h);

			if (handle=="se"){
				ui.size.width  = snappedright-left-oldstroke*2 + 1;
				ui.size.height  = snappedbottom-top-oldstroke*2 + 1;
			}
			if ( handle=="e"){
				ui.size.width  = snappedright-left-oldstroke*2 + 1;
			}
			if (handle=="s"){
				ui.size.height  = snappedbottom-top-oldstroke*2 + 1;
			}
			if ( handle=="w"){
				ui.size.width  = right-snappedleft-oldstroke*2 + 1;
				ui.position.left = snappedleft;
			}
			if ( handle=="n"){
				ui.size.height  = bottom-snappedtop-oldstroke*2 + 1;
				ui.position.top = snappedtop;
			}
			if ( handle=="nw"){
				ui.size.height  = bottom-snappedtop-oldstroke*2 + 1;
				ui.position.top = snappedtop;
				ui.size.width  = right-snappedleft-oldstroke*2 + 1;
				ui.position.left = snappedleft;
			}
			if ( handle=="ne"){
				ui.size.height  = bottom-snappedtop-oldstroke*2 + 1;
				ui.position.top = snappedtop;
				ui.size.width  = snappedright-left-oldstroke*2 + 1;
			}
			if (handle=="sw"){
				ui.size.width  = right-snappedleft-oldstroke*2 + 1;
				ui.position.left = snappedleft;
				ui.size.height  = snappedbottom-top-oldstroke*2 + 1;
			}
		}


		$('.dim').html('<b>W</b>: ' + (ui.size.width + oldstroke*2 -1) + 'px, <b>H</b>: ' + (ui.size.height+ oldstroke*2 -1) +'px');

		// snapping END


	},
	stop: function (event, ui)
	{

		$( "#guide-v , #guide-h" ).hide();
			$(this).addClass('selected');


		if ($(".ui-resizable-resizing").hasClass('svginside')){
			var imgwidth=ui.size.width;
			$('.ui-resizable-resizing svg ').css('width', imgwidth);
			var imgheight=ui.size.height;
			$('.ui-resizable-resizing svg ').css('height', imgheight);

		}
	},
	snap: " .col " ,
	handles: "all" ,
	autoHide:true

});
tt.each(function () {
	// body...
	$(this).resizable('option', 'alsoResize', $(this).find('.wirejr'));
})

// CTRL TO DRAW ON TOP OF ANOTHER
tt.mouseover(function (e) {
	if (multipaged) {
		$sld = $("#canvas .page:visible .selected");
	}else{
		$sld = $("#canvas .selected");
	}
	$.each( tt, function(){
		$(this).bind("contextmenu",function(e){
			if ($sld.length==1) {
				$sld.removeClass('selected');}
				$(this).addClass('selected');
   // return false;
}); 
	}); 
	isover = true;
	var ttt=$(this);
	var fired = false;
	$(document).keydown(function(e) {
		if(!fired) {
			fired = true;
			if (e.shiftKey && isover == true) {
				ttt.draggable('disable');
			}
		}
	});
}).mouseout(function (e) {
	isover = false;
	$(this).draggable('enable');
});

if ($('.grouped').length){
	$('.grouped').resizable("destroy");
}

}
var isover = false;

function MakeCanvasDrag () {

	$( "#canvas-wrap").resizable({
		minWidth: 320,
		minHeight: 320,
		start: function (event, ui)
		{
			wirepanel.hide();
			var cheight=$('#canvas').height();
			$('#canvas').css('width',cwidth+2);
			$('#canvas').css('height',cheight+2);
		},
		resize:function( event, ui ) {
			cwidth=ui.size.width;
			$('.canvassize').html("<b>canvas</b>: "+ parseInt(ui.size.width,10)+"/"+ parseInt(ui.size.height,10)+"px");

			if (cwidth===320) {$canvaswrap.addClass('mobile').removeClass('browser-wrap , mobile-landscape');
			imgs.eq(1).insertBefore( imgs.eq(2) );
			imgs.eq(0).insertAfter( imgs.eq(2) );
			$('.canvassize').html("<b>canvas</b>: "+ $('#canvas').width()+"/"+ $('#canvas').height()+"px");
		}
		if (cwidth>320) {$canvaswrap.removeClass('mobile , mobile-landscape').addClass('browser-wrap');
		imgs.eq(0).insertBefore( imgs.eq(1) );
		imgs.eq(2).insertAfter( imgs.eq(1) );
		$('.canvassize').html("<b>canvas</b>: "+ $('#canvas').width()+"/"+ $('#canvas').height()+"px");
	}
	if (ui.size.height===320) {$canvaswrap.addClass('mobile-landscape').removeClass('browser-wrap , mobile');
	imgs.eq(2).insertBefore( imgs.eq(1) );
	imgs.eq(0).insertAfter( imgs.eq(1) );
	$('.canvassize').html("<b>canvas</b>: "+ $('#canvas').width()+"/"+ $('#canvas').height()+"px");
}

$('#canvas').css('width','100%');
$('#canvas').css('height','100%');
},
stop:function( event, ui ) {

	cwidth=ui.size.width;

	if ($canvaswrap.hasClass('mobile-landscape')) {
		cwidth=480;
	}

	$('#canvas .wire').resizable('option', 'maxWidth', cwidth);
	$(this).center();
	updateCanvasInput();
},
alsoResize: ".container",
handles: "se"
}).draggable({handle:'#browser',
cursor: 'move',
containment:'.container',
stop: function(ui){
	if (parseInt($(this).css('top'),10)<80 ) {
		$(this).transition({top:'110px'});
	}
	
	offset_c = $('#canvas').offset();
}});
$canvaswrap.find('.ui-resizable-se').addClass('icon-resize-full');

}

MakeCanvasDrag();

$('#del').click(function(){
	delnow ();
});
function delnow () {saveState();
	$('#canvas .selected').not( "#canvas-wrap").remove();}

	$('#edit').click(function(){

		$('#icons').show().siblings().hide();
		$('.icon[elementtype="headlinetxt"]').hide();
		positionwirepanel();

	});

	function positionwirepanel(){
		offset_c = $('#canvas-wrap').position();
		var $s = $('#canvas div.selected');
		var box_h= $s.height();
		var box_w= $s.width();


		var boxposition = $s.position();
		var boxtop = boxposition.top;
		var boxleft = boxposition.left;

	// var newtop=boxtop+box_h/2+offset_c.top;
	var newtop=boxtop+offset_c.top-45;

	var wirepanelhidth = wirepanel.width();
	var panel_left=boxleft+(box_w/2)-(wirepanelhidth/2)+offset_c.left;

	if(panel_left<=0){
		panel_left=0;
	}

	wirepanel.css({top:newtop, left:panel_left}).show();
}


function editme(t){
	var $s = t;
	$('#edittxt').click(function(){
		if ($s && ($s.hasClass('headlinetxt')||$s.has('.headlinetxt'))){
			$s.find(".editable").dblclick();
		}
		if ($s && ($s.hasClass('textnew')||$s.has('.textnew'))){
			$("#canvas div.selected .textme").dblclick();

		}
		wirepanel.hide();
	});
	// saveState();
	render_edit_menu();
	positionwirepanel();
	
}



var copied;
posTopArray=[];
posLeftArray=[];
$('#copy').click(function(){
	copynow();
});
$('#cut').click(function(){
	cutnow();
});

key('ctrl+c, command+c', function(){
	copynow();
});
key('ctrl+x, command+x', function(){
	cutnow();
});

function copynow () {
	if (multipaged) {
		var $slc = $('#canvas .page:visible .selected');
	}else{
		var $slc = $('#canvas .selected');
	}
	$slc.addClass('copying').resizable('destroy').draggable('destroy');
	var copythis = '';

	$slc.each(function(i) {
		copythis += $(this).outerHTML();
	});

	localStorage.setItem("clipboard", copythis);
	makeDrag($slc);
	$slc.removeClass('selected , copying');
	$('.copied').fadeIn().delay(600).fadeOut();
}
function cutnow () {
	if (multipaged) {
		var $slc = $('#canvas .page:visible .selected');
	}else{
		var $slc = $('#canvas .selected');
	}
	$slc.addClass('copying').resizable('destroy').draggable('destroy');
	var copythis = '';

	$slc.each(function(i) {
		copythis += $(this).outerHTML();
	});

	localStorage.setItem("clipboard", copythis);
	$(".selected").remove();
	$('.copied').fadeIn().delay(600).fadeOut();
}

key('del, delete', function(){
	$('#canvas .selected:not(#canvas-wrap)').remove();
});

$('#paste').click(function(){
	paste();
});
key('ctrl+v, command+v', function(){
	paste();
});
function paste () {
	saveState();
	if (multipaged) {
		$('#canvas .page:visible .selected').removeClass('selected');
		var inserted = localStorage.getItem("clipboard");
		$('#canvas .page:visible').append(inserted);
		var $cp = $('#canvas .page:visible .copying');
	}else{
		$('#canvas .selected').removeClass('selected');
		var inserted = localStorage.getItem("clipboard");
		$('#canvas').append(inserted);
		var $cp = $('#canvas .copying');
	}
	makeDrag($cp.not('.headlinetxt'));
	$cp.find(".textme").bind('dblclick',edittext);
	// localStorage.removeItem("clipboard");
	$cp.removeClass('copying');
}

$('.colorpicker').click(function(){
	var current_bgcolor=$(this).css('background-color');
	changeBackgroundColor (current_bgcolor) 
});

$('.strokeweight').click(function () {
	changeBorderWidth($(this).attr('stroke'));
});

function changeBorderWidth (width) {
	saveState();

	if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr');}
	else{var s = $('.selected');}
	s.css('box-sizing','content-box');
	var oldstroke =parseInt(s.css('borderLeftWidth'),10);
	var current_stroke=width;
	var newwidth = s.width()-parseInt(current_stroke,10)*2+oldstroke*2;
	var newheight = s.height()-parseInt(current_stroke,10)*2+oldstroke*2;
	s.css({'width':newwidth+'px', 'height':newheight+'px','border-width':width});

	s.css({'width':newwidth+'px', 'height':newheight+'px','border-width':current_stroke+'px'});

	if(s.hasClass('svginside')){
		$('.selected svg *').css('stroke-width', current_stroke);
	}
	if(s.hasClass('hasSVG')){
		$('.selected svg line').attr('stroke-width', current_stroke);
		$('.selected svg .line1').attr({'y1': newheight,'x2':newwidth});
		$('.selected svg .line2').attr({'y2': newheight,'x2':newwidth});
		$('.selected svg' ).attr({'height': newheight,'width':newwidth});
	}
	$('.dim').html('<b>W</b>: ' + (s.outerWidth()-1) + 'px, <b>H</b>: ' + (s.outerWidth()-1) +'px');
}

$('.brcolor').click(function(){
	saveState();
	if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr')}
		else{var s = $('.selected');}
	current_brcolor=$(this).css('border-left-color');
	s.css('border-color',current_brcolor);
	if(s.hasClass('svginside')){
		$('.selected svg *').css('stroke', current_brcolor);
	}
	if(s.hasClass('hasSVG')){
		$('.selected svg line').attr('stroke', current_brcolor);
	}

});
function changeBackgroundColor (color) {
	saveState();
	var current_bgcolor=color;
	if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr');}
	else{var s = $('.selected');}
	if (s){
		s.css('background-color',current_bgcolor);
		if(s.hasClass('headline')){
			s.find('span').css('background-color',current_bgcolor);}
			if(s.hasClass('headlinetxt')){
				s.find('span').css('color',current_bgcolor);}
				if(s.hasClass('paragraph')){
					s.find('span').css('background-color',current_bgcolor);}
					if(s.hasClass('list')){
						s.find('span').css({'background-color':current_bgcolor,'color':current_bgcolor});
						s.attr('data-color',current_bgcolor);}
					}
					if(s.hasClass('svginside')){
						$('.selected .image *').css('background-color',current_bgcolor);
					}
				}
				function changeBorderColor (color) {
					saveState();
					if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr')}
						else{var s = $('.selected');}
					current_brcolor=color;
					s.css('border-color',current_brcolor);
					if(s.hasClass('svginside')){
						$('.selected svg *').css('stroke', current_brcolor);
					}
					if(s.hasClass('hasSVG')){
						$('.selected svg line').attr('stroke', current_brcolor);
					}
				}

				$('#front').click(function(){
					bring_to_front();
				});
				function bring_to_front () {
					saveState();
					if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr');var sz = $('.wirejr');}
					else{var s = $('.selected');var sz = $('.wire');}
					sz.each(function() {
						var index_current = parseInt($(this).css("zIndex"), 10);
						if (index_current > index_highest) {
							index_highest = index_current;
						}
					});
					s.css('z-index',index_highest+1);
				}
				$('#back').click(function(){
					send_to_back();
				});
				function send_to_back () {
					saveState();
					if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr')}
						else{var s = $('.selected');}
					$(".wirejr").each(function() {
						var index_now = parseInt($(this).css("zIndex"), 10);
						$(this).css('z-index',index_now+1);
					});
					s.css('zIndex',1);
				}
				$('#backward').click(function(){
					send_backward();
				});
				function send_backward () {
					saveState();
					if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr')}
						else{var s = $('.selected');}
	// var s = $('.selected');
	var czi = parseInt(s.css('zIndex'),10);
	czi <= 0 ? czi = 1 : czi = czi;
	s.css('z-index',(czi-1));
}
$('#forward').click(function(){
	bring_forward();

});
function bring_forward () {
	saveState();
	if ($('.selected').has('.wirejr').length) {var s = $('.selected').find('.wirejr')}
		else{var s = $('.selected');}
	// var s = $('.selected');
	var czi = parseInt(s.css('zIndex'),10);
	s.css('z-index',(czi+1));
}
function computeGuidesForElement( elem ){
	var $t = $(elem);
	if ($t.is('.col')) {
		var pos = $t.position();
		ww = $('#canvas').width();
		pos.left += ww*0.01;
	}else{
		var pos = $t.position();
	}
	if ($t.is('.col')) {
		var w = $t.width() ;
		var h = $t.height() - 1;
	}else{
		var w = $t.outerWidth() -1;
		var h = $t.outerHeight() - 1;}
		return [
		{ type: "h", x: pos.left , y: pos.top },
		{ type: "h", x: pos.left , y: pos.top + h },
		{ type: "v", x: pos.left  , y: pos.top },
		{ type: "v", x: pos.left + w  , y: pos.top }
		];
	}
	function computeColForElement( elem ){
		var $t = $(elem);
		var pos = $t.position();
		ww = $('#canvas').width();
		pos.left += ww*0.01;
		var w = $t.width() ;

		return [
		pos.left +1 , pos.left + w 			
		];
	}

	function aspect_ratio(bb){

		var b1=bb.width();
		var b2=bb.height();
		var proportions=b1/b2;

		if (proportions >= 0.3 && proportions <= 8){
			$('.icon.rect').show();
			$('.icon:not(.rect)').hide();
		}
		if (proportions < 0.3 ){
			$('.icon.vertical').show();
			$('.icon:not(.vertical)').hide();
		}
		if (proportions > 8){
			$('.icon.horizontal').show();
			$('.icon:not(.horizontal)').hide();
		}
		$('#annotate').hide();
		$('#textinput').addClass('lasticon');
	}

	var $showbg = $(' #show-bg');
	var $strokes =$('#strokes');
	var $showborderbg = $('#show-border , #show-bg');
	var $colorpickers = $('#colorpickers');
	var $bordercolors = $('#bordercolors');
	var $edittxt = $('#edittxt');
	var $textalsz = $('#textalign , #textsize');

	function render_edit_menu(){
		$('#icons').hide().siblings().not("#lock , #unlock , #linklist").show();
		$('#linklist').hide();
		var $s = $('#canvas div.selected');
		if ($s.has('.wirejr').length) {var s = $s.find('.wirejr')}
			else{var s = $s;}
		$showbg.hide();
		if (s.hasClass('paragraph')){
			$strokes.hide();
			$showborderbg.hide();
			$colorpickers.show();
			$bordercolors.hide();
			$textalsz.show();
			$edittxt.hide();
		}

		if (s.hasClass('list') ){
			$strokes.hide();
			$showborderbg.hide();
			$colorpickers.show();
			$bordercolors.hide();
			$('#textsize').show();
			$('#textalign').hide();
			$edittxt.hide();
		}

		if (!s.hasClass('headlinetxt') && !s.hasClass('paragraph') && !s.hasClass('list')){
			$edittxt.hide();
			$('#show-border').show();
			$('#brind-back-front').show();
			$colorpickers.show();
			$bordercolors.hide();
			$strokes.show();
			$textalsz.hide();
		}
		if (s.hasClass('headlinetxt') || s.hasClass('headline')){
			$strokes.hide();
			$showborderbg.hide();
			$colorpickers.show();
			$bordercolors.hide();
			$textalsz.show();
			$edittxt.show();
		}

	}
	$('#show-bg').click(function(){
		$('#colorpickers').show();
		$('#bordercolors').hide();
		$('#show-border').show();
		$('#show-bg').hide();
	});
	$('#show-border').click(function(){
		$('#bordercolors').show();
		$('#colorpickers').hide();
		$('#show-border').hide();
		$('#show-bg').show();
	});

	$('#alignleft').click(function(){
		saveState();
		$('#canvas .selected').find('span').css('text-align','left');
	});

	$('#aligncenter').click(function(){
		saveState();
		$('#canvas .selected').find('span').css('text-align','center');
	});

	$('#alignright').click(function(){
		saveState();
		$('#canvas .selected').find('span').css('text-align','right');
	});
	$('#alignjustify').click(function(){
		saveState();
		$('#canvas .selected').find('span').css('text-align','justify');
	});

	$('#font-s').click(function(){
		saveState();
		$('#canvas .selected.paragraph span , #canvas .selected .paragraph span').css({'font-size':'7px', 'line-height':'13px'});
		$('#canvas .selected.list span ul li span , #canvas .selected .list span ul li span').css({'font-size':'7px', 'line-height':'13px'});
		$('#canvas .selected.headlinetxt .editable .content-wrapper').css({'font-size':'12px', 'line-height':'12px'});
		$('#canvas .selected.textnew , #canvas .selected .textnew').css({'font-size':'12px', 'line-height':'12px'});
		$('#canvas .selected.headline , #canvas .selected .headline').find('.headtext span ').css({'font-size':'14px', 'line-height':'14px', "margin-bottom":"2px"});
	});
	$('#font-m').click(function(){
		saveState();
		$('#canvas .selected.paragraph span , #canvas .selected .paragraph span').css({'font-size':'10px', 'line-height':'20px'});
		$('#canvas .selected.list span ul li span , #canvas .selected .list span ul li span').css({'font-size':'10px', 'line-height':'20px'});
		$('#canvas .selected.headlinetxt .editable .content-wrapper').css({'font-size':'18px', 'line-height':'18px'});
		$('#canvas .selected.textnew , #canvas .selected .textnew').css({'font-size':'18px', 'line-height':'18px'});
		$('#canvas .selected.headline , #canvas .selected .headline').find('.headtext span').css({'font-size':'22px','line-height':'22px', "margin-bottom":"6px"});
	});
	$('#font-l').click(function(){
		saveState();
		$('#canvas .selected.paragraph span , #canvas .selected .paragraph span').css({'font-size':'18px', 'line-height':'36px'});
		$('#canvas .selected.list span ul li span , #canvas .selected .list span ul li span').css({'font-size':'18px', 'line-height':'36px'});
		$('#canvas .selected.headlinetxt .editable .content-wrapper').css({'font-size':'28px', 'line-height':'28px'});
		$('#canvas .selected.textnew , #canvas .selected .textnew').css({'font-size':'28px', 'line-height':'28px'});
		$('#canvas .selected.headline , #canvas .selected .headline').find('.headtext span ').css({'font-size':'28px', 'line-height':'28px', "margin-bottom":"8px"});
	});


	jQuery.fn.center = function(parent) {
		if (parent) {
			parent = this.parent();
		} else {
			parent = window;
		}
		this.transition({
			"left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px"),
			"margin-left":"0"

		});
		return this;
	};






	var annotationhtml="<span class=annotbox><div class='editme thelatest'></div><button class=ok><i class=icon-ok></i> ok</button></span><div class=closeannot><i class=icon-remove></i></div>";
	var texthtml="<span class='text'><div class='textme thelatest'></div></span>";
// var texthtml="<div class='cetext' contenteditable=true>Sample text</div>";

var paragraph="<span class=txtcont><span>Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iise mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel.</span></span>";
var paragraphtext = "Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel. Lorem ipsum dolor sit amet, et delectus accommodare his, consul copiosae legendos at vix, ad putent delectus delicata usu. Vidit dissentiet eos cu, eum an brute copiosae hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere facilis accusam eu, dicat falli consulatu at vis.</br>Te facilisis mnesarchum qui, posse omnium mediocritatem est cu. Modus argumentum ne qui, tation efficiendi in eos. Ei mea falli legere efficiantur, et tollit aliquip debitis mei. No deserunt mediocritatem mel.";

var list="<span class='listcont'><ul><li><span>Lorem ipsum dolorsit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor neque.</span></li></ul></span>";
var listhtml = "<ul><li><span>Lorem ipsum dolorsit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor dapibus neque.</span></li><li><span>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</span></li><li><span>Aliquam tincidunt mauris eu risus.</span></li><li><span>Vestibulum auctor neque.</span></li></ul>";
var headtxt="<span class='headtext'><span>Lorem</span> <span>ipsum</span> <span>dolor</span> <span>sitammet</span> <span>quam</span> <span>Lorem</span> <span>ipsumdolor</span> <span>sitammet</span> <span>quam</span></span>";

var img="<svg id='imgwire' version='1.1' baseProfile='tiny'  xmlns='http://www.w3.org/2000/svg'  width='200px' height='100px' viewBox='0 0 200 100' preserveAspectRatio='none'><line vector-effect='non-scaling-stroke' fill='none' stroke='#444444' stroke-width='2' x1='0' y1='100' x2='200' y2='0'/><line vector-effect='non-scaling-stroke' fill='none' stroke='#444444' stroke-width='2' x1='0' y1='0' x2='200' y2='100'/></svg>";

function getRandomNumber(range)
{
	return Math.floor(Math.random() * range);
}

function getRandomChar()
{
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( getRandomNumber(62), 1 );
}

function randomID(size)
{
	var str = "";
	for(var i = 0; i < size; i++)
	{
		str += getRandomChar();
	}
	return str;
}


$('#watch-demo').click(function  () {
	if (!$('.panel').is(':visible')) {
		demo0();
	}
});

function demo0 () {
	$('#canvas').append("<div id='demo'><div class='demoinfo'>Click & drag to draw</div><div id='demobox' ></div><div id='democursor'><i class='icon-cursor'></i></div><div id='demopanel'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><div id='demoeditpanel'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>");
	$("#demobox").css({'width':"0","height":"0"}).removeAttr('class');
	$('.demoinfo').text('Click & drag to draw');
	$('#demo').fadeIn('slow', demo1);
}

function demo1 () {
	$("#democursor").animate({
		top: "40px",
		left: '20px'
	}, 1500, demo1a);
}

function demo1a () {
	$("#democursor").addClass('drag');
	demo2();
}

function demo2 () {
	$("#demobox").delay(500).animate({
		width: "240px",
		height: '160px'
	}, 3500 );
	$("#democursor").delay(500).animate({
		top: "200px",
		left: '260px'
	}, 3500 ,demo3);

}
function demo3 () {
	$("#democursor").removeClass('drag');
	$('#demopanel').delay(500).show(0,demo4);
}
function demo4 () {
	$('.demoinfo').text('Select stencil');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '55px'
	}, 1500 ,demo5);
}

function demo4a () {

	demo5();
}

function demo5 () {
	$('#demobox').addClass('demobox');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '80px'
	}, 500 ,demo5a);
}
function demo5a () {
	$('#demobox').addClass('round');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '105px'
	}, 500 ,demo5b);

}
function demo5b () {
	$('#demobox').addClass('demoround');
	$("#democursor").delay(800).animate({
		top: "125px",
		left: '105px'
	}, 500 ,demo5c);
}
function demo5c () {
	$("#democursor").addClass('drag');
	demo5d();
}

function demo5d () {
	$('#demopanel').delay(300).hide(0, demo5e);
}
function demo5e () {
	$("#democursor").removeClass('drag');
	demo6();
}
function demo6 () {
	$('#demopanel').delay(1500).hide(0, demo6a);
}
function demo6a () {
	$('.demoinfo').text('Doubleclick to edit');
	$("#democursor").addClass('drag');
	$('#demopanel').delay(200).hide(0, demo6b);
}
function demo6b () {
	$("#democursor").removeClass('drag');
	demo6c();
}
function demo6c () {
	$('#demopanel').delay(200).hide(0, demo6d);
}
function demo6d () {
	$("#democursor").addClass('drag');
	$('#demopanel').delay(200).hide(0, demo6e);
}
function demo6e () {
	$("#democursor").removeClass('drag');
	$('#demoeditpanel').delay(400).show(0,demo7);

}
function demo7 () {
	$("#democursor").delay(800).animate({top: "125px",
		left: '178px'
	}, 500 ,demo7a);
}
function demo7a () {
	$('#demopanel').delay(500).hide(0, demo7b);
}
function demo7b () {
	$("#democursor").addClass('drag');
	$('#demobox').addClass('grey');
	demo7c();
}
function demo7c () {
	$('#demoeditpanel').delay(300).hide(0,demo7d);
}
function demo7d () {
	$("#democursor").removeClass('drag');
	demo8();
}
function demo8 () {
	$('#demo').delay(1600).hide('slow');
}


if (!previewMode) {$('#canvas .annotbox div').click(divClicked);}else{ $('#canvas .publiccomment .annotbox div').click(divClicked);}
var anyannot =$('#canvas .aa').length;
if (anyannot > 0){
	$('#hide-annotation').show();
}


var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

$(window).resize(function() {
	delay(function(){
		$canvaswrap.center();
	}, 500);
});

function updategrid (size) {
	for (var i = 0; i < 5; i++) {
		var selectorV = '#grid-pattern .lineV:eq('+[i]+')';
		var selectorH = '#grid-pattern .lineH:eq('+[i]+')';
		$(selectorH).attr({"y1":[i+1]*size,"y2":[i+1]*size ,'x2':size*5});	
		$(selectorV).attr({"x1":[i+1]*size,"x2":[i+1]*size,'y2':size*5});	
		$('.svgdot').attr({'cx':(size-0.5),'cy':(size-0.5)});
	}
	$('#grid-pattern').attr({'width':size*5,'height':size*5});
	$('#dot-pattern').attr({'width':size,'height':size});
}

$( "#grid-slider" ).slider({
	min: 10,
	max: 50,
	value:20,
	slide: function (event,ui) {
		$('.grid-size-val').text(ui.value);
	},
	stop:function (event, ui) {
		updategrid(ui.value);
		// gridsize = ui.value;
		turngridon();
	}
});
$('#snap-to-grid , #grid-type').change(function () {
	
	turngridon();
	if (!$('#snap-to-grid').attr('checked')) {
		$canvaswrap.attr('snappy', 0);
		gridsize=0;
	};
});

function turngridon () {

	if ($('#snap-to-grid').attr('checked')) {
		if ($('select#grid-type').val() == "graph" ) {
			gridsize=$('#grid-slider').slider('value');
			$canvaswrap.attr('snappy', gridsize);}
			else if ($('select#grid-type').val() == "dots" ) {
				gridsize=$('#grid-slider').slider('value');
				$canvaswrap.attr('snappy', gridsize);}
				else if ($('select#grid-type').val() == "col" ) {
					$canvaswrap.attr('snappy', "col");
					gridsize = 0;
				}
			};
		}
		$canvaswrap.data('savedState', []);
		$canvaswrap.data('savedUndo', []);
		var historystate = $canvaswrap.data('savedState');
		var future = $canvaswrap.data('savedUndo');

		function saveState () {
			historystate.unshift($canvaswrap.html());
			if (historystate.length > 2) {
				historystate.pop();
			}
			if ($('#undo').hasClass('inactive')) {
				$('#undo').removeClass('inactive');
			}
	// makeDrag($('.wire'));
	// makeDrag($('.aa'));
}

key('ctrl+z, command+z', function(){
	restoreState(makeDragNow);
});
$('#undo').click(function () {
	restoreState(makeDragNow);


});
key('ctrl+y, command+y', function(){
	redo(makeDragNow);
});
$('#redo').click(function () {
	redo(makeDragNow);
});
function restoreState (callback) {
	if (historystate.length > 0) {
		var prev = historystate[0];
		future.unshift($canvaswrap.html());
		$canvaswrap.html(prev);
		saveUndo();
		$('#canvas .wire, #canvas .aa').resizable('destroy').draggable('destroy');
		$('.ui-resizable-handle').remove();
		if ($('#redo').hasClass('inactive')) {
			$('#redo').removeClass('inactive');
		}
		callback();
	// useboxer();
}else{
	$('#undo').addClass('inactive');
}
}
function makeDragNow() {

	historystate.shift();
	activepage = $('.page:visible');
	useboxer();
	renderContextMenu();
	makeDrag($('#canvas .wire'));
		// useboxer();
	// $('.textme').dblclick(edittext);
}
function saveUndo () {
	// future.unshift($canvaswrap.html());
	if (future.length > 4) {
		future.pop();
	}
}
function redo (callback) {
	if (future.length > 0) {
		var next = future[0];
		$canvaswrap.html(next);
		useboxer();
		$('.ui-resizable-handle').remove();
		future.shift();
		callback();
	}else{
		$('#redo').addClass('inactive');
	}
}
$("#canvas").mousemove(function(e){
	var pageCoords = "( " +  + ", " + e.pageY + " )";
	$(".coord").html("<b>X</b>: "+parseInt((e.pageX-offset_c.left),10)+" <b>Y</b>: "+parseInt((e.pageY-offset_c.top),10));
});
sett.bind("click", function (event) {
	wirepanel.hide();

	if (supercanvas.hasClass('slide-down')) {
		supercanvas.removeClass('slide-down').delay(600).queue(function(next){
			sharebar.hide();
			sett.toggleClass('pressed');
			exportbtn.removeClass('pressed');
			supercanvas.toggleClass('slide-left');
			next();
		});
	}else{

		sharebar.hide();
		exportbtn.removeClass('pressed');
		supercanvas.removeClass('slide-right , slide-down');
		supercanvas.toggleClass('slide-left');
		$(this).toggleClass('pressed ');
		$(this).find("i").toggleClass('icon-arrow-right');
		$sitemapicon.removeClass('icon-arrow-left').addClass('icon-sitemap');
	}
});

$('select#def-stroke-width').change(function (event) {
	defbw = $('select#def-stroke-width').val();
});
$('select#def-stroke-color').change(function (event) {
	defstrcolor = $('select#def-stroke-color').val();
});
$('select#def-bg-color').change(function (event) {
	defbgcolor = $('select#def-bg-color').val();
});
$('#canvas_w_val').change(function  () {
	$canvaswrap.css('width',$(this).val()+'px');
	$('.wire').resizable('option', 'maxWidth', $(this).val());
	updateCanvasInput();
});
$('#canvas_h_val').change(function  () {
	if ($(this).val()>600) {
		$('.container').css('overflow-y','auto');
		supercanvas.css("height",(parseInt($(this).val(),10)+250)+'px');
	}
	$canvaswrap.css('height',$(this).val()+'px');
	updateCanvasInput();
});

$('body').bind('keydown', handleKeys);

function handleKeys(e) {
	if (!$ajaxlogin.is(':visible')) {
		draggable = $('#canvas .selected'),
		distance = 1; 
		if (gridsize > 0) {distance = gridsize;}
		pTopArray = [];
		pLeftArray = [];
		if ((e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) && !e.ctrlKey ) {
			saveState();
			draggable.each(function(i) {
				thiscsstop = $(this).css('top');
				thiscssleft = $(this).css('left');

				pTopArray[i] = parseInt(thiscsstop,10);
				pLeftArray[i] = parseInt(thiscssleft,10);
			});
		}


		switch (e.keyCode) {
		    case 37: draggable.each(function(i) {$(this).css('left', (pLeftArray[i] - distance));}); break; // Left
		    case 38: draggable.each(function(i) {$(this).css('top', (pTopArray[i] - distance));}); break; // Up
		    case 39: draggable.each(function(i) {$(this).css('left', (pLeftArray[i] + distance));}); break;// Right
		    case 40: draggable.each(function(i) {$(this).css('top', (pTopArray[i] + distance));}); break; // Down
		    default: return true; // Exit and bubble
		}


		    e.preventDefault();
    }
}
$('#group').click(function(){
	group_ungroup();
});

function group_ungroup () {
	if (multipaged) {
		var $grp = $('#canvas .page:visible .selected');
	}else{
		var $grp = $('#canvas .selected');
	}
	if (!$grp.hasClass('grouped')) {
		group_elements($grp);
	}else if($grp.hasClass('grouped') && $grp.not('grouped')){
		ungroup_elements($('#canvas .selected.grouped'));
		group_elements($grp);
	}else if($grp.hasClass('grouped') && !$grp.not('grouped')){
		ungroup_elements($('#canvas .selected.grouped'));
	}
}

key('ctrl+g, command+g', function(e){
	e.preventDefault();
	group_elements($('#canvas .selected'));
});
key('ctrl+shift+g, command+shift+g', function(e){
	e.preventDefault();
	ungroup_elements($('#canvas .selected.grouped'));
});
function group_elements (slctd) {
	if (slctd.length > 1) {
		var maxTop = 10000;
		var maxLeft = 10000;
		var maxRight = -1;
		var maxBottom = -1;

		slctd.each(function() {
			var position = $(this).position();
			var width = $(this).width();
			var height = $(this).height();
			maxTop = maxTop < position.top ? maxTop : position.top;
			maxLeft = maxLeft < position.left ? maxLeft : position.left;
			maxRight = maxRight > (position.left+width) ? maxRight : (position.left+width);
			maxBottom = maxBottom > (position.top+height) ? maxBottom : (position.top+height);
		});
		var uid = Math.floor( Math.random()*99999 );
		slctd.draggable("destroy").resizable("destroy").css({"position":"absolute"}).removeClass('selected').addClass('groupmember');
		slctd.wrapAll('<div  style="position:relative; top:-'+maxTop+'px; left:-'+maxLeft+'px;"/>');
		slctd.parent().wrap('<div class="grouped wire" id='+uid+' style="position:absolute;top:'+(maxTop)+'px; left:'+(maxLeft)+'px;width:'+(maxRight-maxLeft+2)+'px;height:'+(maxBottom-maxTop+2)+'px;"/>');
		slctd.parent().parent().addClass('selected');
		var thisgr = $('#'+uid);
		makeDrag(thisgr);
	 	// to do
	 	thisgr.resizable("destroy");
	 	$('#group').addClass('pressed');	

	 }
	}
	function ungroup_elements (slctd) {
		innerwire = slctd.find('.wire');
		if (!slctd.not('grouped')) {
			slctd.draggable("destroy").resizable("destroy");}
			var wrapposition =slctd.position();
			var relpos =innerwire.parent().position();

			slctd.find('.groupmember').unwrap().unwrap();

			innerwire.each(function  () {
				abspos=$(this).position();
				$(this).css({"top":(wrapposition.top+(abspos.top+relpos.top)),"left":(wrapposition.left+(abspos.left+relpos.left))});
			});
			innerwire.removeClass('groupmember');
			makeDrag(innerwire);
			$('#group').removeClass('pressed');	

		}
		$('#align-top').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}
			if ($sl.length==1) {
				$sl.css('top',"1px");
			}else{
				var maxTop=10000;
				$sl.each(function() {
					var position = $(this).position();
					maxTop = maxTop < position.top ? maxTop : position.top;
				});
				$sl.css('top',maxTop+"px");
			}
		});

		$('#align-left').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}
			if ($sl.length==1) {
				$sl.css('left',"1px");
			}else{
				var maxLeft=10000;
				$sl.each(function() {
					var position = $(this).position();
					maxLeft = maxLeft < position.left ? maxLeft : position.left;
				});
				$sl.css('left',maxLeft+"px");}
			});

		$('#align-right').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}

			if ($sl.length==1) {
				var w = $('#canvas').width();
				var sw = $sl.width();
				var bw = parseInt($sl.css("borderWidth"),10);
				$sl.css('left',(w-sw-2*bw+1)+"px");
			}else{
				var maxRight=-1;
				$sl.each(function() {
					var position = $(this).position();
					var width = $(this).width();
					maxRight = maxRight > (position.left+width) ? maxRight : (position.left+width);
				});
				$sl.each(function() {
					var width = $(this).width();
					$(this).css('left',(maxRight-width)+"px");
				});}
			});

		$('#align-bottom').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}


			if ($sl.length==1) {
				var h = $('#canvas').height();
				var sh = $sl.height();
				var bw = parseInt($sl.css("borderWidth"),10);
				$sl.css('top',(h-sh-2*bw+1)+"px");
			}else{
				var maxBottom=-1;
				$sl.each(function() {
					var position = $(this).position();
					var height = $(this).height();
					maxBottom = maxBottom > (position.top+height) ? maxBottom : (position.top+height);
				});
				$sl.each(function() {
					var height = $(this).height();
					$(this).css('top',(maxBottom-height)+"px");
				});}
			});
		$('#align-center').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}


			if ($sl.length==1) {
				var h = $('#canvas').height();
				var sh = $sl.height();
				$sl.css('top',(h/2-sh/2)+"px");
			}else{
				var maxBottom=-1;
				var maxTop = 1000;
				$sl.each(function() {
					var position = $(this).position();
					var height = $(this).height();
					maxBottom = maxBottom > (position.top+height) ? maxBottom : (position.top+height);
					maxTop = maxTop < position.top ? maxTop : position.top;
				});
				$sl.each(function() {
					var height = $(this).height();
					$(this).css('top',((maxBottom+maxTop)/2-height/2)+"px");
				});}
			});
		$('#align-middle').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}

			if ($sl.length==1) {
				var w = $('#canvas').width();
				var sw = $sl.width();
				$sl.css('left',(w/2-sw/2)+"px");
			}else{
				var maxRight=-1;
				var maxLeft = 1000;
				$sl.each(function() {
					var position = $(this).position();
					var width = $(this).width();
					maxRight = maxRight > (position.left+width) ? maxRight : (position.left+width);
					maxLeft = maxLeft < position.left ? maxLeft : position.left;
				});
				$sl.each(function() {
					var width = $(this).width();
					$(this).css('left',((maxRight+maxLeft)/2-width/2)+"px");
				});}
			});

		$('#dist-v').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}

			var i = 0;
			divide = $sl.length-1;
			obj = $sl;
			distrb = sortdivs(obj,"top");
			maxTop = distrb[0].val + distrb[0].div.height()/2;
			last = distrb.length-1;
			maxBottom = distrb[last].val + distrb[last].div.height()/2;
			$.each( distrb, function(){
				thisdiv = this.div;
				var height = thisdiv.height();
				thisdiv.css('top',(maxTop+((maxBottom-maxTop)/divide)*i-height/2)+"px");
				i++;
			});
		});
		$('#dist-h').click(function(){
			if (multipaged) {
				var $sl = $('#canvas .page:visible .selected');
			}else{
				var $sl = $('#canvas .selected');
			}

			
			var i = 0;
			divide = $sl.length-1;
			obj = $sl;
			distrb = sortdivs(obj,"left");
			maxLeft = distrb[0].val + distrb[0].div.width()/2;
			last = distrb.length-1;
			maxRight = distrb[last].val + distrb[last].div.width()/2;
			$.each( distrb, function(){
				thisdiv = this.div;
				var width = thisdiv.width();
				thisdiv.css('left',(maxLeft+((maxRight-maxLeft)/divide)*i-width/2)+"px");
				i++;
			});
		});

		function sortdivs(obj,attr) {
			var distrb = new Array();
			for (var i = 0; i < obj.length; i++) {
				pos = obj.eq(i).position();
				if (attr == "top") {
					distrb.push({div: obj.eq(i), val: pos.top});
				}else{
					distrb.push({div: obj.eq(i), val: pos.left});
				}
			};
			
			var sorted = distrb.sort(function(a, b){

				if(a.val < b.val){
					return -1;
				}
				else if(a.val > b.val){
					return 1;
				} 
				return 0;
			});
			return sorted;
		}
		$('#align').click(function() {
			$('.align-icons').toggleClass("align-icons-visible");
			if (!$('#arrange-icons').hasClass('arrange-icons-visible')) {
				$('.align-icons').siblings().toggleClass("inactive");
			}
			$(this).toggleClass('pressed');
			if ($('#arrange-icons').hasClass('arrange-icons-visible')) {
				$('#arrange-icons').removeClass("arrange-icons-visible");
				$('#arrange').removeClass('pressed');}
			});
		$('#arrange').click(function() {
			$('#arrange-icons').toggleClass("arrange-icons-visible");
			if (!$('.align-icons').hasClass('align-icons-visible')) {
				$('#arrange-icons').siblings().toggleClass("inactive");
			}
			$(this).toggleClass('pressed');
			if ($('.align-icons').hasClass('align-icons-visible')) {
				$('.align-icons').removeClass("align-icons-visible");
				$('#align').removeClass('pressed');}
			});
		$('.inner-btn , #align , #arrange , .pagename-wrap , .appriseInner').click(function(event){
			event.stopPropagation();
		});

		key('b', function(){
			type="box";
			prepareWire ();
			insertWire();
		});
		key('r', function(){
			type="roundbox";
			prepareWire ();
			insertWire();
		});
		key('e', function(){
			type="elipse";
			prepareWire ();
			insertWire();
		});
		key('i', function(){
			type="image";
			prepareWire ();
			insertWire();
		});
		key('p', function(){
			type="paragraph";
			prepareWire ();
			insertWire();
		});
		key('l', function(){
			type="list";
			prepareWire ();
			insertWire();
		});
		key('h', function(){
			type="headline";
			prepareWire ();
			insertWire();
		});
		key('t', function(e){
			e.preventDefault();
			type="headlinetxt";
			prepareWire ();
			insertWire();
		});
		key('a', function(e){
			e.preventDefault();
			type="annotate";
			prepareWire ();
			insertWire();
		});
		key('g', function(e){
			e.preventDefault();
			type="line_hor";
			prepareWire ();
			insertWire();
		});
		key('v', function(e){
			e.preventDefault();
			type="line_vert";
			prepareWire ();
			insertWire();
		});
		key('s', function(e){
			e.preventDefault();
			type="slider";
			prepareWire ();
			insertWire();
		});
		key('u', function(e){
			e.preventDefault();
			type="progressbar";
			prepareWire ();
			insertWire();
		});
		key('c', function(e){
			e.preventDefault();
			type="combobox";
			prepareWire ();
			insertWire();
		});
		key('q', function(e){
			e.preventDefault();
			type="scrollh";
			prepareWire ();
			insertWire();
		});
		key('y', function(e){
			e.preventDefault();
			type="scrollv";
			prepareWire ();
			insertWire();
		});
		key('n', function(e){
			e.preventDefault();
			type="textinput";
			prepareWire ();
			insertWire();
		});
		key('6', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#111", "border-color":"#111"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#111");
			}

		});
		key('5', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#444", "border-color":"#444"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#444");
			}
		});
		key('4', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#777", "border-color":"#777"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#777");
			}

		});
		key('3', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#aaa", "border-color":"#aaa"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#aaa");
			}
		});
		key('2', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#ddd", "border-color":"#ddd"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#ddd");
			}
		});
		key('1', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"#fff", "border-color":"#fff"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("#fff");
			}
		});
		key('7', function(){
			if ($('#canvas .brandnew').length) {
				type="box";
				prepareWire ();
				insertWire();
				$('#canvas .latestwire').css({"background":"tomato", "border-color":"tomato"});
			}
			if ($('#canvas .selected').length) {
				changeBackgroundColor("tomato");
			}
		});
		key('0', function(){
			if ($('#canvas .selected').length) {
				changeBackgroundColor("transarent");
			}
		});
		key('alt+7', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor('tomato');
			}
		});
		key('alt+1', function(e){
			if ($('#canvas .selected').length) {e.preventDefault();
				changeBorderColor("white");}
			});
		key('alt+2', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("#ddd");}
			});
		key('alt+3', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("#aaa");}
			});
		key('alt+4', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("#777");}
			});
		key('alt+5', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("#444");}
			});
		key('alt+6', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("#111");}
			});
		key('alt+0', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderColor("transparent");}
			});
		key('ctrl+1', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderWidth("1");}
			});
		key('ctrl+2', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderWidth("2");}
			});
		key('ctrl+3', function(e){
			if ($('#canvas .selected').length) {
				e.preventDefault();
				changeBorderWidth("4");}
			});
		key('ctrl+a, command+a', function(e){
			e.preventDefault();
			if (multipaged) {
				$('.page:visible .wire').not('.locked , .groupmember').addClass("selected");
			}else{
				$('.wire').not('.locked , .groupmember').addClass("selected");
			}
		});
		key('esc', function(e){
			e.preventDefault();

			$('.selected').removeClass("selected");
		});

		function renderContextMenu () {
			$('#canvas , #canvas .wire').contextPopup({
				title: '',
				items: [
				{label:'Copy',     action:function() { copynow(); }, short:"Ctrl+C" },
				{label:'Cut', action:function() { cutnow(); } , short:"Ctrl+X"},
				{label:'Paste', action:function() { paste(); } , short:"Ctrl+V"},
				{label:'Delete', action:function() { delnow(); } , short:"Del"},
				null, /* null can be used to add a separator to the menu items */
				{label:'Edit',  action:function() { $('.selected').dblclick();} , short:"doubleclick"},
				null,
				{label:'Bring to front', action:function() { bring_to_front(); } , short:"Ctrl+Shift+↑"},
				{label:'Bring forward', action:function() { bring_forward(); } , short:"Ctrl+↑"},
				{label:'Send to back', action:function() { send_to_back(); } , short:"Ctrl+Shift+↓"},
				{label:'Send backward', action:function() { send_backward(); } , short:"Ctrl+↓"},
				null,
				{label:'Lock / Unlock', action:function() { lock(); } , short:"Ctrl+L"},
				{label:'Group / Ungroup', action:function() { group_ungroup(); } , short:"Ctrl+G"},
				{label:'Link', action:function() { makeLink(); } , short:"Ctrl+K"}

				]});
}		
if (!$('.container').hasClass('preview')) {
	renderContextMenu();
}

key('ctrl+up, command+up', function(e){
	e.preventDefault();
	bring_forward();
});
key('ctrl+shift+up, command+shift+up', function(e){
	e.preventDefault();
	bring_to_front();
});
key('ctrl+shift+down, command+shift+down', function(e){
	e.preventDefault();
	send_to_back();
});
key('ctrl+down, command+down', function(e){
	e.preventDefault();
	send_backward();
});
key('ctrl+l, command+l', function(e){
	e.preventDefault();
	lock();
});
key('ctrl+k, command+k', function(e){
	e.preventDefault();
	makeLink();
});
var pagelist = $('.sitemap ul');

if (multipaged) {
	pagelist.empty();
	$('.page').each(function () {
		pagelist.append(
			$('<li>').attr({'data-pageid':$(this).attr('id')}).append($(this).attr('data-pagename')).click(function () {
				make_page_active ($(this).attr("data-pageid"));
			})	); 
		make_page_active ($('.page:visible').attr('id'));
	});
};


function add_new_page () {
	
	apprise('Enter new name', {'verify':true, 'input':true}, function(r) {
		if(r) { 
			var new_id = $.now();
			$('#canvas').append("<div class='page' id='"+new_id+"' data-pagename='"+r+"'>");

			pagelist.append(
				$('<li>').attr({'data-pageid':new_id}).append(r).click(function () {
					make_page_active ($(this).attr("data-pageid"));
				})	);    

			make_page_active(new_id);
			// make_page_active(new_id , r);
			$('.pagename-wrap').click();

		} else{
			return false;
		}
	});
}
$('.addpage').click(add_new_page);

function make_page_active (id) {
	var li = $('[data-pageid='+id+']');
	var name =li.text();

	$('.pagename').text(name);
	activepage.hide();
	activepage = $('#'+id);
	activepage.show().siblings('.page').hide();
	$('.sitemap li').removeClass('activepage');
	li.addClass("activepage");
	if (!previewMode) {
		useboxer();
	}else{
		if ($('#canvas .page:visible').next('.page').length==0) {$('#next').addClass('inactive');}else{$('#next').removeClass('inactive');}
		if ($('#canvas .page:visible').prev('.page').length==0) {$('#prev').addClass('inactive');}else{$('#prev').removeClass('inactive');}
	}
	wirepanel.hide();
	$('#canvas').show();
}

$('.sitemap li').click(function () {
	make_page_active ($(this).attr("data-pageid"));
});

$('.pagename-wrap').click(function () {
	wirepanel.hide();
	if (supercanvas.hasClass('slide-down')) {
		supercanvas.removeClass('slide-down').delay(600).queue(function(next){
			sharebar.hide();
			$sitemapicon.toggleClass('icon-sitemap icon-arrow-left');
			exportbtn.removeClass('pressed');
			supercanvas.toggleClass('slide-right');
			next();
		});
	}else{
	// exportbtn.removeClass('pressed');
	supercanvas.removeClass('slide-left , slide-down');
	sett.removeClass('pressed');
	sttngs.removeClass('icon-arrow-right').addClass('icon-cog');
	sharebar.hide();
	supercanvas.toggleClass("slide-right");
	$sitemapicon.toggleClass('icon-sitemap icon-arrow-left');
}
});

$('#delete-page').click(function  () {
	if ($('.sitemap li').length>1) {
		apprise('Are you sure?', {'verify':true}, function(r) {
			if(r) { 

				var p_id = $('.sitemap .activepage').attr('data-pageid');
				$(".sitemap .activepage , #"+p_id).remove();
				var first_id = $('.sitemap li').eq(0).attr('data-pageid');
				make_page_active(first_id);
			}else{return false;}
		});}else{
			apprise("You can't delete the only page in the project");
		}
	});
$('#duplicate-page').click(function  () {
	apprise('Enter new name', {'verify':true, 'input':true}, function(r) {
		if(r) { 
			var new_id = $.now();
			var p_id = $('.sitemap .activepage').attr('data-pageid');
			$('#canvas').append("<div class='page' id='"+new_id+"' data-pagename='"+r+"'>");
			$('#'+new_id).append($('#'+p_id).html());
			makeDrag($('#'+new_id+' .wire'));
			$('#'+new_id+' .textme').bind('dblclick',edittext);
			pagelist.append(
				$('<li>').attr({'data-pageid':new_id}).append(r).click(function () {
					make_page_active ($(this).attr("data-pageid"));
				})	);    

			make_page_active(new_id , r);

		} else{
			return false;
		}
	});
});
$('#rename-page').click(function  () {
	apprise('Enter new name', {'verify':true, 'input':true}, function(r) {
		if(r) { 
			var actv= $('.sitemap .activepage');
			var p_id = actv.attr('data-pageid');
			$('#'+p_id).attr('data-pagename',r);
			actv.text(r);   
			make_page_active(p_id , r); 
		} else{
			return false;
		}
	});
});
$('#Link').click(function () {
	makeLink();
});
$('#preview').click(function(){
	preview();
});
$('#re-edit').click(function(){
	makeEditable();
	sttngs.removeClass('icon-arrow-right').addClass('icon-cog');
	sett.removeClass('pressed');
	$sitemapicon.removeClass('icon-arrow-left').addClass('icon-sitemap');
});
function makeLink () {
	if ($('.page').length) {
		var linklist = $('#linkselect');
		linklist.empty();
		linklist.append($('<option>').append('None').attr('value',0));
		$('.sitemap ul li').each(function() {
			linklist.append($('<option>').append($(this).text()).attr('value',$(this).attr('data-pageid')));
		});
		var ex_link = $('#canvas .page:visible .selected').attr("data-link");
		if (ex_link) {
			$('#linkselect option[value='+ex_link+']').attr('selected', true);
			
		}
		$('#linklist').show().siblings().hide();
		positionwirepanel();
		wirepanel.show();
		linklist.change(function () {
			var p_id = $("#linkselect option:selected").attr('value');
			
			$('#canvas .page:visible .selected').attr('data-link', p_id).addClass('icon-link');
			
			wirepanel.hide();
		});
	}else{
		alert('You need to be a Premium user to make clickable wireframes.');
	}
}
$('.linkmark').click(function (e) {
	e.stopPropagation();
	$('#Link').click();
});

function preview(){
	if (!previewMode) {
		$('#top').addClass('topup');
		supercanvas.removeClass('slide-left , slide-right , slide-down');
		exportbtn.removeClass('pressed');
	// $('.options').removeClass('active');
	
	$('.bottomright, #wirepanel').hide();
	$('#canvas .page .wire').draggable('destroy').resizable('destroy').removeClass('ui-resizable-autohide');
	$('#canvas').addClass('preview');
	$('#canvas .ui-boxer').boxer('destroy');
	$('#canvas .page').bind('click', highlightclickable);
	$('#canvas .page .wire[data-link]').bind('click', gotopage);
}
}

var gotopage = function(event) {
	event.stopPropagation();
	var p_id = $(this).attr('data-link');
	if (p_id!=0) {
		make_page_active(p_id);
	}
	
}

function highlightclickable () {
	var $ccbl = $('#canvas .page:visible .wire[data-link]');
	$ccbl.stop(true, true).addClass('hilite').delay(600).queue(function(next){
		$ccbl.removeClass('hilite');
	});
	// $ccbl.find('.wirejr').removeClass('animated flash').addClass('animated flash');
}

function makeEditable () {
	$('#top').removeClass('topup');
	$('.bottomright').show();
	$('#canvas').removeClass('preview');
	makeDrag($('.wire').not('.headlinetxt'));
	$('.wire[data-link]').unbind('click', gotopage);
	$('#canvas .page').unbind('click', highlightclickable);
	useboxer();
}



$('.png').click(function () {
	$('#canvas .page .wire , #canvas .page .aa').draggable("destroy").resizable("destroy");
	$canvaswrap.resizable("destroy");
	var wireHTML = $("#canvas").html();
	var datastr = encodeURIComponent(wireHTML);
	var sizeX = (parseInt($("#canvas-wrap").width(),10))+2;
	var sizeY = (parseInt($("#canvas-wrap").height(),10))+2;
	exporting.show();
	$.post('https://wireframe.cc/pro/export_png.php', { 'data' : datastr, 'w':sizeX, 'h':sizeY},function (data){
		$('iframe').attr('src','https://wireframe.cc/pro/download.php?f='+data);
		MakeCanvasDrag();
		makeDrag($('#canvas .page .wire'));
		exporting.hide();
	});
});
$('.pdf').click(function () {
	$('#canvas .page .wire , #canvas .page .aa  ').draggable("destroy").resizable("destroy");
	$canvaswrap.resizable("destroy");
	var wireHTML = $("#canvas").html();
	var datastr = encodeURIComponent(wireHTML);
	var sizeX = (parseInt($("#canvas-wrap").width(),10))+2;
	var sizeY = (parseInt($("#canvas-wrap").height(),10))+2;
	exporting.show();
	$.post('https://wireframe.cc/pro/export_pdf.php', { 'data' : datastr, 'w':sizeX, 'h':sizeY},function (data){
		$('iframe').attr('src','https://wireframe.cc/pro/download1.php?f='+data);
		MakeCanvasDrag();
		makeDrag($('#canvas .page .wire'));
		exporting.hide();
	});
});;
var sharebar = $('.sharebar');
var exportbtn = $('.export');

exportbtn.click(function () {
	exportbtn.toggleClass('pressed');
	$('.container').animate({ scrollTop: '0px'},{
		complete : function () {

			console.log($("body").offset().top);
			if (supercanvas.hasClass('slide-left') || supercanvas.hasClass('slide-right')) {

				supercanvas.removeClass('slide-left , slide-right').delay(600).queue(function(next){
					sharebar.show();
					$(this).toggleClass('slide-down');
					sett.removeClass('pressed');
					$sitemapicon.removeClass('icon-arrow-left').addClass('icon-sitemap');
					sttngs.removeClass('icon-arrow-right').addClass('icon-cog');
					next();
				});
			}else{
				sharebar.show();
				supercanvas.toggleClass('slide-down');
			}
		}
	});
});

if (previewMode) {
	$('#canvas .ui-boxer').boxer('destroy');
}
if ($('#canvas .page:visible').next('.page').length==0) {$('#next').addClass('inactive');}
if ($('#canvas .page:visible').prev('.page').length==0) {$('#prev').addClass('inactive');}

$('#next').click(function () {
	$('#prev').removeClass('inactive');
	var $ap = $('.page:visible');
	var pagesleft = $ap.next('.page').length;
	if(pagesleft){
		$('#canvas .page:visible').hide().next('.page').show();
		$('.pagename').text($('#canvas .page:visible').attr('data-pagename'));
		$('.activepage').removeClass('activepage');
		$('[data-pageid='+$('#canvas .page:visible').attr('id')+']').addClass('activepage');
		if($('#canvas .page:visible').next('.page').length==0){
			$(this).addClass('inactive');
		}
	}
	
});
$('#prev').click(function () {
	$('#next').removeClass('inactive');
	var $ap = $('.page:visible');
	var pagesleft = $ap.prev('.page').length;
	if(pagesleft){
		$ap.hide().prev('.page').show();
		$('.pagename').text($('#canvas .page:visible').attr('data-pagename'));
		$('.activepage').removeClass('activepage');
		$('[data-pageid='+$('#canvas .page:visible').attr('id')+']').addClass('activepage');
		if($('#canvas .page:visible').prev('.page').length==0){
			$(this).addClass('inactive');
		}
	}
});

$('.addComment').click(function () {
	$('#canvas .page:visible').append($("<div class='publiccomment'/>").css({'width':'160px',"height":"120px",'top':'40px','left':'60px','z-index':5000, 'position':'absolute'}).append(annotationhtml));
	$(".editme").click(divClicked);

	$("#canvas .thelatest").click();
	$('#canvas .closeannot').click(function(){
		var delit=$(this).parent();
		delit.remove();
		saveComment();
	});
	
});
var $savecomment = $('.saveComment');

function saveComment() {
	$savecomment.show();
	console.log('ready to save');
	$savecomment.bind('click',function () {		

		$('#canvas .page .publiccomment ,#canvas .page .aa').resizable('destroy').draggable('destroy');
		var wireHTML ="";

		$('#canvas .page .publiccomment , #canvas .page .aa').each(function () {
			$(this).attr("data-parent",$(this).parent().attr('id'));
			wireHTML += $(this).outerHTML();
		});
		var datastr = encodeURIComponent(wireHTML);
		$.post('../savecomment', { 'pblcaa' : datastr, 'preview':previewid },function (){
			$('.saved').show().delay(600).fadeOut();
			$('#canvas .page .publiccomment').draggable({stop:function () {saveComment();}}).resizable({handles:'all',stop:function () {saveComment();}});
				// $('.aa').draggable().resizable({handles:'all'});
				$savecomment.unbind('click');
				$savecomment.hide();
				console.log('saved');
			});
	});
}
function positionAA () {
	
	$('.publiccomment , .aa').each(function () {
		$(this).appendTo($('#'+$(this).attr('data-parent')));
		// $(this).resizable({handles:'all'}).draggable();
	});
	$('.publiccomment').draggable({stop:function () {saveComment();}}).resizable({handles:'all',stop:function () {saveComment();}});

}


supercanvas.click(function () {
	if (supercanvas.hasClass('slide-left')||supercanvas.hasClass('slide-right') ||supercanvas.hasClass('slide-down')) {
		supercanvas.removeClass('slide-left , slide-right , slide-down');
		$sitemapicon.removeClass('icon-arrow-left').addClass('icon-sitemap');
		$('#top .settings.pressed').removeClass('pressed');
		$('#top .export.pressed').removeClass('pressed');
	}
})

jQuery.fn.outerHTML = function(s) {
	return (s)
	? this.before(s).remove()
	: jQuery("<p>").append(this.eq(0).clone()).html();
}

window._link_was_clicked = false;
window.onbeforeunload = function(event) {
	if (window._link_was_clicked) {
    return; // abort beforeunload
}
if ($('#canvas .wire').length && filename!='example' && filename!='examplemobile') {
	return "Are you sure?";
}
};

jQuery(document).bind('click', 'a', function(event) {
	window._link_was_clicked = true;
});
$.fn.hasAttr = function(name) {  
	return this.attr(name) !== undefined;
};
