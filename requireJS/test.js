
require.config({
	// 서버상의 root 부터의 경로
	//baseUrl: "js/scripts/progress",
	// 로컬 경로에서는 안됨. 결국 서버를 구축해놓고 테스트해야함
	// 로컬에서도 잘 동작됨을 확인함
	baseUrl: "scripts/progress",
	
	// 클래스 패스에대한 별칭을 만들 수 있다.
	paths:{
		"linkageName" : "ProgressVO"
	}
});

// linkageName 또는 Path로 의존성을 명시하면 (["linkageName", ...])
// 두번째 함수 인자로 차례로 전달 된다. (ProgressVO, ...)
require(
		["linkageName"], 
		function(ProgressVO) {
			"use strict";
			
			//---------------------
			// Your Code...
			//---------------------

			console.log("class : ", ProgressVO);
			var progressVO = new ProgressVO();
			console.log("progressVO : ", progressVO);
			progressVO.toString();
			console.log("------------");
			
			
			try{
				throw new Error("에러가 발생함");
			}catch(err){
				console.log("에러 캐치!! - 에러를 무마시킬 수 있습니다.");
			}
			
			throw new Error("두번째 에러가 발생함. 왜 아래 콜백에 잡히지 않을까?");
		},
		function(error) {
			// ERROR
			console.log("try-catch로 잡히지 않은 메러" +
					"");
			console.log("[ERROR]", error);
		}
);