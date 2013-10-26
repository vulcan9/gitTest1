var Class = require('../../core/Class');

describe('Basic Class', function()
{
	it('Extend', function(next)
	{
		expect(Class.extend).toBeDefined();
		var instance = new Class();
		
		// 상속 테스트
		var Class1 = Class.extend({
			prop1: 'propertyValue1'
		});
		expect(Class1.superClass).toBe(Class);
		expect(Class1.extend).toBeDefined();
		
		var instance1 = new Class1();
		
		expect(instance.prop1).toBe(undefined);
		expect(instance1.prop1).toBe('propertyValue1');

		// 상속2 테스트
		var Class2 = Class1.extend({
			prop2: 'propertyValue2'
		});
		expect(Class2.superClass).toBe(Class1);
		expect(Class2.extend).toBeDefined();
		
		var instance2 = new Class2();
		expect(instance2.prop2).toBe('propertyValue2');
		
		// 상위 Class에는 영향을 미쳐서는 안됨
		expect(instance.prop1).toBe(undefined);
		expect(instance1.prop2).not.toBeDefined();
		expect(instance1.prop2).toBe(undefined);
		
		// Class2를 상속 받았으므로 prop1이 존재한다.
		expect(instance2.prop1).toBeDefined();
		expect(instance2.prop1).toBe('propertyValue1');
		
		next();
	});
	
	// 생성자 파라메터 변경 테스트
	it('Constructor', function(next)
	{
		var Class1 = Class.extend({
			constructor:function(id, name, param3){
				this.id = id;
				this.name = name;
				this.prop = param3;
			},
			id:'',
			name:''
		});
		
		var instance = new Class1('Value1', 'Value2', 'newVarialbe');
		expect(instance.id).toBe('Value1');
		expect(instance.name).toBe('Value2');
		expect(instance.prop).toBe('newVarialbe');
		
		next();
	});
});






















