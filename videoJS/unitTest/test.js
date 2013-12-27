
	/*
	 * QUnit Test
	 * API : http://api.qunitjs.com/
	 * COOKBOOK : http://qunitjs.com/cookbook/
	 */
	QUnit.config.autostart = false;
	if(isTest) QUnit.start();
	
	/*
	require(
		[ "tests/testModule1", "tests/testModule2" ],
		function() {
			QUnit.start();
		}
	);
	*/
	
	/*
	module( "group a" );
	test( "Synchronous Callbacks test", 2, function() {
		//expect( 2 );
		
		function calc( x, operation ) {
			return operation( x );
		}
		
		var result = calc( 2, function( x ) {
			ok( true, "calc() calls operation function" );
			return x * x;
		});
		
		equal( result, 4, "2 square equals 4" );
	});
	asyncTest( "Asynchronous test: one second later!", 1, function() {
		//expect( 1 );
		
		// setTimeout 호출하면서 test 멈춤
		setTimeout(function() {
			ok( true, "Passed and ready to resume!" );
			
			// stop();, start(); test를 멈춤, 다시 시작
			start();
		}, 1000);
	});

	module( "group d" );
	QUnit.assert.mod2 = function( value, expected, message ) {
		var actual = value % 2;
		QUnit.push(actual === expected, actual, expected, message);
	};
	
	test("mod2", 2, function( assert ) {
		assert.mod2(2, 0, "2 % 2 == 0");
		assert.mod2(3, 1, "3 % 2 == 1");
	});
	*/
	module( "Video" );
	
	
	
	
	
	
	
	
	// QUnit.push( result, actual, expected, message )
	QUnit.assert.options = function( name, value, message ) {
		player.set(name, value);
		var get = player.get(name);
		QUnit.push(get === value, get, value, message);
	};

	QUnit.assert.options_url = function( name, value, message ) {
		player.set(name, value);
		var get = player.get(name);
		var result = (get.indexOf(value) >= 0);
		QUnit.push(result, get, true, message);
	};
	
	QUnit.assert.properties = function( name, value, message ) {
		player[name](value);
		
		if(player.isReady()){
			var get = player[name]();
			QUnit.push(get === value, get, value, message);
		}else{
			QUnit.push(true, value, value, message + ' (player 준비 될때까지 보류...)');
		}
	};
	
	test('options', function(assert) {
		assert.options('controls', true, 'controls = true');
		assert.options('autoplay', false, 'autoplay = false');
		assert.options('preload', 'metadata', 'preload = metadata');
		//assert.options('src', 'videoJS/sample.mp4', 'src pass');
		assert.options('loop', false, 'loop = false');
		//assert.options('poster', 'poster.png', 'poster pass');
		assert.options('width', 200, 'width = 200');
		assert.options('height', 200, 'height = 200');
		
		//assert.options_url('poster', 'poster.png', 'poster = poster.png');
		assert.options_url('src', 'videoJS/sample.mp4', 'src = videoJS/sample.mp4');
	});
	
	
	
	$(function(){
		
		// 속성 설정 테스트
		test('src 설정', function(assert) {
			assert.options_url('src', 'videoJS/sample.mp4', 'src = videoJS/sample.mp4');
		});
		
		asyncTest('이벤트 청취', function(assert) {
			player.one('ready', onLoadData);
			assert.properties('currentTime', 10, 'currentTime = 10');
			
			function onLoadData(){
				ok(true, 'ready 이벤트 리스너 성공!!');
				
				assert.options_url('src', 'http://video-js.zencoder.com/oceans-clip.mp4', 'src pass');
				assert.properties('volume', 0.5, 'volume = 0.5');
				assert.properties('currentTime', 20, 'currentTime = 20');
				
				start();
			}
		});

		// 속성 설정 테스트
		test('크기 설정', function(assert) {
			assert.properties('width', 640, 'width = 640');
			assert.properties('height', 300, 'height = 300');
		});
		
		/////////////////////////
		// END
		/////////////////////////
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	