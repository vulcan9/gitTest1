// console.log는 CMD의 프롬프트에 출력되지 않는다. 브라우져의 console 창에서 확인한다.

var bingo = {
	is_my_turn: Boolean,
	socket: null,

	////////////////////////////
	// 초기화
	////////////////////////////
	
	// 처음 로드가 왼료된 후 호출 : bingo.init();
	init: function()
	{
		console.log('init');
		var self = this;
		
		// initialize
		this.is_my_turn = false;
		
		//--------------------------
		// 소켓 연결
		//--------------------------
		
		this.socket = io.connect('http://localhost:3000');
		
		// 연결
		this.socket.on(
				"connect", // "connection" 아님
				function(data)
				{
					console.log("소켓연결 : " + $("#username").val());
					
					self.socket.emit("join", {username:$("#username").val()});
				}
			);

		this.socket.on(
				"update_users", 
				function(data)
				{
					self.update_userlist(data);
				}
			);
		
		this.socket.on(
				"game_started", 
				function(data)
				{
					self.print_msg(data.username + "가 게임을 시작했습니다.");
					$("#start_button").hide();
					
					// 처음 순서 정하기
				}
			);
		
		// 숫자를 선택할 때 발생되는 이벤트 처리
		this.socket.on(
				"check_number", 
				function(data)
				{
					self.where_is_it(data.num);
					self.print_msg(data.username + " checked '" + data.num + "'");
				}
			);

		//--------------------------
		// UI 기능 구현
		//--------------------------
		
		// 1~25 개의 번호 저장
		var numbers = [];
		for(var i=1; i<=25; i++){
			numbers.push(i);
		}
		
		numbers.sort(function(a, b){
			var temp = parseInt(Math.random() * 10);
			var isOddOrEven = temp % 2;
			var isPosOrNeg = temp > 5 ? 1 : -1;
			return (isOddOrEven * isPosOrNeg);
		});
		
		$("table.bingo-board td").each(function(i){
			//console.log(this); // td Element
			$(this).html(numbers[i]); //<td>i</td>
			$(this).click(function(){
				self.select_num(this); //<td>i</td>
			});
		});
		
		$("#start_button").click(function(){
			self.socket.emit("game_start", {username:$("#username").val()});
			self.print_msg("게임을 시작합니다.");
			$("#start_button").hide();
			
			//console.log(this);
			//console.log($("start_button"));
		});
	},
	
	////////////////////////////
	// 셀을 클릭했을때 선택 표시 결정
	////////////////////////////
	
	select_num: function(obj /*td*/)
	{
		console.log('select_num', obj);
		
		if(this.is_my_turn && !$(obj).attr("checked"))
		{
			// 다른 플레이어에게 번호를 보낸다.
			this.socket.emit(
					"select", 
					{
						username:$("#username").val(),
						num:$(obj).text()
					}
				);
			this.check_num(obj);
			this.is_my_turn = false;
		}
		else
		{
			this.print_msg("차례가 아닙니다.");
		}
	},
	
	// 선택 상태로 표시
	check_num: function(obj /*td*/)
	{
		console.log('check_num', obj);
		
		$(obj).css("text-decoration", "line-through");
		$(obj).css("color", "#ccc");
		$(obj).attr("checked", true);
	},
	
	////////////////////////////
	// 서버에서 "check_number" 이벤트를 통해 해당 셀 번호의 상태 업데이트를 체크하게 된다.
	////////////////////////////
	
	// num은 서버로 부터 받은 선택된 번호
	where_is_it: function(num)
	{
		console.log('where_is_it', num);
		var self = this;
//		var obj = null;
		
		$("table.bingo-board td").each(function (i){
			if($(this).text() == num){
				self.check_num(this);
			}
		});
	},

	////////////////////////////
	// 자신의 상태 업데이트
	////////////////////////////
	
	update_userlist: function(data)
	{
		console.log('update_userlist', data);
		
		var self = this;
		$("#list").empty();
		
		//console.log(data);
		
		$.each(data, function(key, value){
			var turn = "(-)&nbsp;";
			if(value.turn == true)
			{
				turn = "(*)&nbsp;";
				
				if(value.name == $("#username").val())
				{
					console.log("차례 : " + value.name);
					self.is_my_turn = true;
				}
			}
			$("#list").append(turn + value.name + "<br/>");
		});
	},
	
	leave: function()
	{
		console.log('leave');
	},
	
	print_msg: function(msg)
	{
		console.log('print_msg', msg);
		$("#logs").append(msg + "<br/>");
	}
};

///////////////////////////////////////////////////////
//
// 스크립트 시작
//
///////////////////////////////////////////////////////

$(document).ready(
	function()
	{
		console.log('Document Ready');
		//$('#start_button')[0].value='Game Ready';
		bingo.init();
	}
);


// 게임 종료 기능
// http://archer0001.blog.me/110165803355