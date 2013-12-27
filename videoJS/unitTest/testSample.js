
	/*
	 * QUnit Test
	 * API : http://api.qunitjs.com/
	 * COOKBOOK : http://qunitjs.com/cookbook/
	 */
	QUnit.config.autostart = false;
	//QUnit.config.altertitle = false;
	 
	/*
	require(
		[ "tests/testModule1", "tests/testModule2" ],
		function() {
			QUnit.start();
		}
	);
	*/
	QUnit.start();
	
	
	
	module( "group a" );
	test( "hello test", function() {
		// success
		ok( true, "true succeeds" );
		ok( "non-empty", "non-empty string succeeds" );
		 
		// fail
		ok( !false, "false fails" );
		ok( !0, "0 fails" );
		ok( !NaN, "NaN fails" );
		ok( !"", "empty string fails" );
		ok( !null, "null fails" );
		ok( !undefined, "undefined fails" );
	});
	
	test( "equal test", function() {
		equal( 0, 0, "Zero; equal succeeds" );
		equal( "", 0, "Empty, Zero; equal succeeds" );
		equal( "", "", "Empty, Empty; equal succeeds" );
		equal( 0, 0, "Zero, Zero; equal succeeds" );
		 
		notEqual( "three", 3, "Three, 3; equal fails" );
		notEqual( null, false, "null, false; equal fails" );
	});
	
	test( "deepEqual test", function() {
		var obj = { foo: "bar" };
		
		// success
		deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
		notDeepEqual( obj, { foo: "bla" }, "Different object, same key, different value, not equal" );
		
		// fail
		notEqual( obj, { foo: "bar" }, "equal fail" );
	});
	
	module( "group b" );
	// 두번째 인자가 expect값임 (assertions 개수)
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
	
	module( "group c" );
	test( "2 asserts", function() {
		var $fixture = $( "#qunit-fixture" );
		$fixture.append( "<div>hello!</div>" );
		equal( $( "div", $fixture ).length, 1, "div added successfully!" );
		
		$fixture.append( "<span>hello!</span>" );
		equal( $( "span", $fixture ).length, 1, "span added successfully!" );
	});
	
	module( "module test", {
		setup: function() {
			ok( true, "one extra assert per test" );
		},
		teardown: function() {
			ok( true, "and one extra assert after each test" );
		}
	});
	
	test( "test with setup and teardown", 2, function() {
		//expect( 2 );
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
	
	
	
	