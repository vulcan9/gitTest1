// console.log 는 브라우져의 console창에서 확인한다.
// CMD의 프롬프트에 출력되지 않는다.

var bingo = {
	is_my_turn: Boolean,
	socket: null,
	
	init: function(){
		console.log('init');
	},
	
	select_num: function(obj){
		console.log('select_num', obj);
	},
	
	where_is_it: function(num){
		console.log('where_is_it', num);
	},
	
	check_num: function(obj){
		console.log('check_num', obj);
	},
	
	update_userlist: function(data){
		console.log('update_userlist', data);
	},
	
	leave: function(){
		console.log('leave');
	},
	
	print_msg: function(msg){
		console.log('print_msg', msg);
	}
};

$(document).ready(
	function()
	{
		console.log('Document Ready');
		//$('#start_button')[0].value='Game Ready';
		bingo.init();
	}
);


// 게임 종료 기능
http://archer0001.blog.me/110165803355