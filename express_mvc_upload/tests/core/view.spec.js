var View = require('../../core/View');

describe('Base view', function() {
	
	it('has Interface', function(next) {
		
		expect(View.extend).toBeDefined();
		
		var view = new View();
		expect(view.render).toBeDefined();
		
		next();
	});

	it('should be extendable', function(next) {
		
		var view = new View();
		//console.log(view);
		
		var View2 = View.extend({
			render: function(data) {
				//console.log('view2 : ', data);
				expect(data.prop).toBeDefined();
				expect(data.prop).toBe('yes2');
				
				//next();
			}
		});
		
		var View3 = View2.extend({
			render: function(data) {
				//console.log('view3 : ', data);
				expect(data.prop).toBeDefined();
				expect(data.prop).toBe('yes3');
				
				next();
			}
		});
		
		var view2 = new View2();
		expect(view2.render).toBeDefined();
		view2.render({prop: 'yes2'});

		var view3 = new View3();
		expect(view3.render).toBeDefined();
		view3.render({prop: 'yes3'});
		
	});
	
	it('create and render new view', function(next) {
		
		// 가상 response로 테스트
		var response = {
			render: function(template, data) {
				
				expect(data.propertyName).toBeDefined();
				expect(data.propertyName).toBe('value');
				expect(template).toBe('template-file');
				
				next();
			}
		};
		
		var view = new View(response, 'template-file');
		
		// 가상 데이터로 테스트
		var data = {propertyName: 'value'};
		view.render(data);
	});
	
});