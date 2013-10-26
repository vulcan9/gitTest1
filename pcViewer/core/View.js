var Class = require("./Class");

module.exports = (function(){
	
	var ViewClass = Class.extend({
		constructor: function(response, template){
			this.response = response;
			this.template = template;
		},
		render: function(data){
			//console.log(this.response, this.template);
			
			if(this.response && this.template) {
				this.response.render(this.template, data);
			}
		}
	});
	
	return ViewClass;
})();














