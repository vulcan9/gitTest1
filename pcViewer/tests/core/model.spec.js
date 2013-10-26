var Model = require('../../core/Model'),

dbMockup = {};
	
describe('Models', function() {
	
	// 인터페이스 테스트
	it('has Interface', function(next) {
		
		var model = new Model(dbMockup);
		expect(model.db).toBeDefined();
		
		expect(model.create).toBeDefined();
		expect(model.insert).toBeDefined();
		expect(model.update).toBeDefined();
		expect(model.remove).toBeDefined();
		
		next();
	});
	
	// 객체 상속 테스트
	it('should be extendable', function(next) {
		
		// 인스턴스 생성
		//var model_1 = new Model(dbMockup);
		
		// 새로운 속성 추가 : customMethod
		var OtherModel = Model.extend({
			customMethod: function() {}
		});
		
		// 상속된 객체
		var model_2 = new OtherModel(dbMockup);
		expect(model_2.db).toBeDefined();
		expect(model_2.customMethod).toBeDefined();
		
		next();
	});
});
















