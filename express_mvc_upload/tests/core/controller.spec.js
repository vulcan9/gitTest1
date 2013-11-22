var Controller = require('../../core/Controller');

describe('Base controller', function() {
	
	// 인터페이스 테스트
	it('has Interface', function(next) {
		
		var control = new Controller();
		expect(control.run).toBeDefined();
		
		next();
	});
	
	// 확장성 테스트
	it('should have a method extend which returns a child instance', function(next) {
		
		var Cont1 = Controller.extend({ id: 'my child controller' });
		
		var child = new Cont1();
		expect(child.run).toBeDefined();
		expect(child.id).toBeDefined();
		expect(child.id).toBe('my child controller');
		
		next();
	});
	
	// 확장된 객체 테스트
	it('should be able to create different childs', function(next) {
		
		var Cont1 = Controller.extend({ id: 'child A', customProperty: 'value' });
		var Cont2 = Controller.extend({ id: 'child B' });
		
		var childA = new Cont1();
		var childB = new Cont2();
		
		expect(childA.id).not.toBe(childB.id);
		expect(childA.customProperty).toBeDefined();
		expect(childB.customProperty).not.toBeDefined();
		
		next();
	});

	// 확장된 객체 테스트 2
	it('should be able to create different childs', function(next) {
		
		var Cont1 = Controller.extend({ 
			constructor : function(id , custom){
				this.id = id;
				this.customProperty = custom;
			}
		});
		
		var Cont2 = Controller.extend({ 
			constructor : function(id){
				this.id = id;
			}
		});
		
		var childA = new Cont1('child A', 'value');
		var childB = new Cont2('child B');
		
		expect(childA.id).not.toBe(childB.id);
		expect(childA.customProperty).toBeDefined();
		expect(childB.customProperty).not.toBeDefined();
		
		next();
	});
});