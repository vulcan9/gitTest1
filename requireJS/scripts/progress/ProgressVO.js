/*
진도율 저장 객체 :  ProgressVO
[userid]			:DNA 프로젝트 USER ID
[spaceid]			:SERI2012120506727
[progressdata]		:YYYNTTTYYYTYY
[completeyn]		:N
[progressrate]		:61.53846153846154 (8/13)
[restarttime]		:30
[lasttime]			:130

1. restarttime 이란
restarttime 은 사용자가 이미 시청했던 동영상을 다시 재생할때 시작할 위치를 제공해주기 위한 값으로
그 위치는 최초의 미시청 위치가 됩니다. 
위 진도데이터를 기준으로 첫번째로 N을 만나는 30초가 restarttime 이 된다고 보시면 됩니다.
2. lasttime 이란
lasttime 은 사용자가 마지막으로 동영상을 시청했던 위치를 의미합니다.
위 진도데이터를 기준으로 보시면 미시청 구간이 있지만 결과적으로 컨텐츠를 끝까지 다 보기는 했으니 130초라고 할 수 있습니다.
*/



define(function(){
	"use strict";
	
	/////////////////////////////////////////
	//진도율 데이터 저장 객체
	/////////////////////////////////////////

	function ProgressVO(){
		
		this.userid = "";
		this.spaceid = "";

		this.progressdata = "";// 재생여부를 담는 실제 데이터 문자열
		this.completeyn = "N";// 전체 재생 여부
		this.progressrate = 0;// 진도율 % (소수둘째자리)
		this.restarttime = 0;// 첫번째 미재생 위치
		this.lasttime = 0;// 마지막 재생 위치
	};

	ProgressVO.prototype.toString = function(){
	    var str = "ProgressVO : \n" +
	        "\t[userid]			:" + this.userid + "\n" +
	        "\t[spaceid]			:" + this.spaceid + "\n" + 
	        "\t[progressdata]		:" + this.progressdata + "\n" + 
	        "\t[completeyn]		:" + this.completeyn + "\n" + 
	        "\t[progressrate]		:" + this.progressrate + "\n" + 
	        "\t[restarttime]		:" + this.restarttime + "\n" + 
	        "\t[lasttime]			:" + this.lasttime + "\n";
	    console.log(str);
	};
	/*
	var exports = {
			version: "1.0",
			ProgressVO: ProgressVO
	};
	*/
	return ProgressVO;
});

/*
var progressVO = new ProgressVO();
progressVO.toString();
*/
