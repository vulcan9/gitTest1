var Class = require("./Class");

module.exports = (function(){
	
	var ControllerClass = Class.extend({
		run: function(req, res, next) {
			// override
		}
	});
	
	return ControllerClass;
})();


