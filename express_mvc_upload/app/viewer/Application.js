var Controller = require("../../core/Controller");
var View = require("../../core/View")

module.exports = (function(){
	
	var Class = Controller.extend({
		run : function(req, res, next){
			
			//------------------
			// (로딩) 초기화 화면
			//------------------
			
			var view = new View(res, './admin/admin-login');
			view.render({
				title : 'Please login'
			});
		}
	});
	
	
	return Class;
})();
