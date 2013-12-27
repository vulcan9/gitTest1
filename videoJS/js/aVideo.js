

	var _singleton = '인스턴스를 생성하지 않습니다.\n AVideo.create 함수를 이용하세요.';
	function AVideo(flag){
		if(flag !== _singleton){
			throw new Error(_singleton);
		}
	}

	/////////////////////////////////////////
	// 인스턴스
	/////////////////////////////////////////
	
	// video Player 데이터 로드가 완료되었을때
	// video 재생 속성에 접근 가능한 시점
	AVideo.prototype._playerReady = false;
	AVideo.prototype.isReady = function(){
		return this._playerReady;
	};
	
	AVideo.prototype._onReadyCallback;
	
	// video Element
	AVideo.prototype.player;
	AVideo.prototype.$player;
	
	// 사용자 설정값
	AVideo.prototype.config;

	// 인스턴스 생성
	AVideo.create = function(target, options, onReady){
		
		var instance = new AVideo(_singleton);
		
		console.log('document.readyState : ', document.readyState);
		
		if(document.readyState !== 'complete'){
			console.log('주의) AVideo 인스턴스는 콜백함수에서 반환됩니다.');
			$(function (){
				createInstance.apply(instance, [target, options, onReady]);
			});
			
		}else{
			createInstance.apply(instance, [target, options, onReady]);
		}
		
		return instance;
	};

	function createInstance(target, options, callback){
		
		console.log('AVideo 인스턴스 생성');
		
		var $element;
		if (typeof target === 'string'){
			$element = $(target);
		}else{
			$element = target;
		}
		
		if(!$element.is('video')){
			throw new TypeError('The element or ID supplied is not valid.');
		}

		if($element.length < 1){
			throw new Error('video element를 찾을 수 없습니다.');
		}else if($element.length > 1){
			throw new TypeError('video element가 두개 이상 발견되었습니다.');
		}
		
		this.player = $element[0];
		this.$player = $(this.player);
		this.id = this.player.id;
		this.config = options;
		
		// container wrap - 먼저 wraping 시켜야 autoplay 속성이 적용된다.
		wraping.apply(this);
		
		// configuration
		this.initialize();

		var isSupport = displaySupportHTML5.apply(this);
		if(!isSupport) return null;
		
		// player 준비 완료
		//onReady.apply(this, [onReadyCallback]);
		this._onReadyCallback = callback;
		return this;
	}
	
	function wraping(){
		// wrap
		this.container = createContainer.apply(this.player);
		this.$player.wrap(this.container);
		this.$container = $(this.container);
	}
	
	function unwraping(){
		this.$player.unwrap();
		this.$container = null;
		this.container = null;
	}
	
	// 최소 크기
	var minWidth = 200;
	var minHeight = 150;
	
	// scope : this.$player
	function createContainer(){
		var id = this.id + '_container';
		var container = $('<div>').attr('id', id).addClass('player_container');
		
		/*
		var w = $(this).width();
		var h = $(this).height();
		var mW = Math.max(minWidth, w);
		var mH = Math.max(minHeight, h);
		container.css({
			'min-width': mW,
			'min-height': mH
		});
		*/
		
		container.css({
			'min-width': minWidth,
			'min-height': minHeight
		});
		
		return container;
	}

	/////////////////////////////////////////
	// Video 준비 완료 체크
	/////////////////////////////////////////

	// player 데이터가 로드되어 재생 컨트롤이 가능할때
	function onReady(callback){

		//console.log('element : ', this.id, this.player);
		if(this._onReadyCallback){
			this._onReadyCallback.apply(this);
			this._onReadyCallback = null;
		}
		
		executeQueue.apply(this);
		
		this.trigger('ready');
		
	    // Chrome and Safari both have issues with autoplay.
	    // In Safari (5.1.1), when we move the video element into the container div, autoplay doesn't work.
	    // In Chrome (15), if you have autoplay + a poster + no controls, the video gets hidden (but audio plays)
	    // This fixes both issues. Need to wait for API, so it updates displays correctly
		// 자동 재생 기능 체크
		if(this.autoplay()){
			this.play();
		}
	};

	//---------------------------------------
	// 실행 delay
	//---------------------------------------
	
	AVideo.prototype._queue;
	function addQueue(funcName, arg){
		if(!this._queue){
			this._queue = [];
		}
		
		//console.log('####addQueue : ', funcName, arg);
		this._queue.push({
			funcName:funcName, arg:arg
		});
	}
	
	function executeQueue(){
		if(!this._queue) return;
		var obj = this._queue.shift();
		if(!obj){
			this._queue = null;
			return;
		}
		
		var funcName = obj.funcName;
		var arg = obj.arg;
		console.log('------> ', funcName, ' : ', arg);
		this[funcName].apply(this, arg);
		
		executeQueue.apply(this);
	}
	
	////////////////////////////////////////////////////////////////////
	//
	// HTML5 Video API
	//
	////////////////////////////////////////////////////////////////////

	AVideo.prototype.initialize = function(){
		this.initializeEvent();
		this.initializeConfig();
		
		
		this.initializeFunction();
	};
	
	// http://unikys.tistory.com/278
	
	/////////////////////////////////////////
	// Video 설정값
	/////////////////////////////////////////

	/*
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#the-video-element
	
	var config = {
		src			: (URL) 비디오 소스의 URL
		height		: (숫자) 비디오의 높이 픽셀 값
		width		: (숫자) 비디오의 넓이 픽셀 값
		controls	: ("controls", "", - ) 비디오의 재생, 볼륨 등 제어기들을 표시
				"controls"나 공백이나 태그 안에 값 없이 controls만 적어줘도 적용된다.
		muted		: ("muted", "", - ) 음소거
		poster		: (URL) 로드되지 않고 있을 때 처음에 표시될 이미지의 URL
		loop		: ("loop", "", - ) 반복 재생
		autoplay	: ("autoplay", "", - ) 자동 재생
		mediagroup	: (문자열) 같은 아이디로 묶어준 비디오와 오디오 스트림들 끼리 동기화 시켜주는 그룹으로 취급한다.
		
		preload	: ("none", "metadta", "auto")
				"none": 사용자가 비디오를 필요로하지 않을 것이라고 명시, 미리 다운로드 하지 않음
				"metadata"	: 사용자가 비디오를 필요로 하지 않을 것이지만, 기본 정보(크기, 첫 프레임, 비디오 길이, 등)는 가져온다.
				"auto"		: 사용자가 비디오를 필요로 하고 미리 다운로드를 한다. (기본값)
				
		crossOrigin : ?
	};
	*/

	// 사용자 설정값을 player에 적용
	AVideo.prototype.initializeConfig = function (){
		console.log('AVideo 설정');
		for(var prop in this.config){
			this.set(prop, this.config[prop]);
		}
	};
	
	AVideo.prototype.clearConfig = function (){
		console.log('AVideo 설정 리셋');
		for(var prop in this.config){
			this.set(prop, null);
		}
	};
	
	//---------------------------------------
	// Option Get, Set 메서드로 접근 가능하도록 지원
	//---------------------------------------
	
	/* 
	// 사용예
	player.get('src')
	player.set('src', 'sample.mp4')
	*/
	
	// Get
	AVideo.prototype.get = function (name){
		if(!(name in this.player)){
			throw new Error('요청한 속성이 존재하지 않습니다.');
		}
		return this.player[name];
	};
	
	// Set
	AVideo.prototype.set = function (name, value){
		if(!(name in this.player)){
			throw new Error('요청한 속성이 존재하지 않습니다.');
		}
		
		if(value === null || value === undefined){
			this.$player.removeAttr(name);
			return;
		}
		
		if(name == 'src'){
			checkSRC.call(this, value);
			return;
		}
		else if(name == 'currentTime'){
			if(this.isReady() == false){
				addQueue.call(this, name, [value]);
				return;
			}
		}
		else if(name == 'width'){
			value = Math.max(value, minWidth);
		}
		else if(name == 'height'){
			value = Math.max(value, minHeight);
		}
		
		console.log('\t * player set : ', name, '(', value, ')');
		
		try{
			if(this.player[name] == value) return;
			this.player[name] = value;
		}catch(err){
			console.trace('[ERROR] ', err);
			addQueue.call(this, name, [value]);
		}
	};
	
	// SRC 가 바뀌면 playerReady 상태를 초기화 시켜준다.
	function checkSRC(value){
		//if(this.player['src'] == value) return;
		var src = this.player['src'];
		var i = src.lastIndexOf(value);
		if(i >= 0){
			var url = src.substr(i);
			if(url == value) return;
		}
		
		//console.trace('[src] ', value);
		console.log('[src] ', value);
		
		this._playerReady = false;
		this.player['src'] = value;
		
		//addQueue.call(this, 'currentTime', [0]);
	}
	
	//---------------------------------------
	// Option 인스턴스 메서드로 접근 가능하도록 지원
	//---------------------------------------
	
	AVideo.prototype._propertyProxy = function (name, value){
		// Get
		if(value === undefined){
			return this.get(name);
		}
		
		// Set
		this.set(name, value);
	};

	AVideo.prototype._propertyNotSupport = function (name){
		throw new Error('The "' + name + '" method is not available API');
	};

	// Get / Set 메서드 정의
	AVideo.prototype.src 			= function(value){ return this._propertyProxy('src', value);};
	AVideo.prototype.height 		= function(value){ return this._propertyProxy('height', value);};
	AVideo.prototype.width 			= function(value){ return this._propertyProxy('width', value);};
	AVideo.prototype.controls 		= function(value){ return this._propertyProxy('controls', value);};
	AVideo.prototype.muted 			= function(value){ return this._propertyProxy('muted', value);};
	AVideo.prototype.loop 			= function(value){ return this._propertyProxy('loop', value);};
	AVideo.prototype.autoplay 		= function(value){ return this._propertyProxy('autoplay', value);};
	AVideo.prototype.preload 		= function(value){ return this._propertyProxy('preload', value);};
	AVideo.prototype.poster 		= function(value){ return this._propertyProxy('poster', value);};
	AVideo.prototype.mediagroup 	= function(value){ return this._propertyProxy('mediagroup', value);};
	
	/////////////////////////////////////////
	// Video 속성값 (제어 관련)
	/////////////////////////////////////////
	
	/*
	// get/set
	defaultPlaybackRate 	: 기본 재생 속도
	playbackRate 			: 현재 재생 속도
	volume 					: 비디오의 볼륨
	currentTime 			: 현재 재생중인 시간
	
	// get Only
	duration, buffered, videoWidth, videoHeight, paused
	*/
	
	// Not Support 메서드 정의
	AVideo.prototype.defaultPlaybackRate 	= function(){ return this._propertyNotSupport('defaultPlaybackRate');};
	AVideo.prototype.playbackRate 			= function(){ return this._propertyNotSupport('playbackRate');};
	
	// Get / Set 메서드 정의
	AVideo.prototype.currentTime 		= function(value){ return this._propertyProxy('currentTime', value);};
	AVideo.prototype.volume 			= function(value){ return this._propertyProxy('volume', value);};
	
	// Read Only 메서드 정의
	AVideo.prototype.videoWidth 		= function(){ return this._propertyProxy('videoWidth');};
	AVideo.prototype.videoHeight 		= function(){ return this._propertyProxy('videoHeight');};
	AVideo.prototype.duration 			= function(){ return this._propertyProxy('duration');};
	AVideo.prototype.buffered 			= function(){ return this._propertyProxy('buffered');};
	AVideo.prototype.paused 			= function(){ return this._propertyProxy('paused');};
	
	/*
	readonly attribute TimeRanges played;
	readonly attribute TimeRanges seekable;
	readonly attribute boolean seeking;
	
	readonly attribute boolean ended;
	attribute boolean defaultMuted;
	*/
	
	//---------------------------------------
	// 기타
	//---------------------------------------
	
	AVideo.prototype.remainTime = function(){
		return this.duration() - this.currentTime();
	};
	
	/*
	readonly attribute unsigned short readyState;
		const unsigned short HAVE_NOTHING = 0;
		const unsigned short HAVE_METADATA = 1;
		const unsigned short HAVE_CURRENT_DATA = 2;
		const unsigned short HAVE_FUTURE_DATA = 3;
		const unsigned short HAVE_ENOUGH_DATA = 4;
	*/
	var readyStateMap = {
		0: 'HAVE_NOTHING',
		1: 'HAVE_METADATA',
		2: 'HAVE_CURRENT_DATA',
		3: 'HAVE_FUTURE_DATA',
		4: 'HAVE_ENOUGH_DATA'
	};
	
	AVideo.prototype.readyState = function(){
		var state = this.get('readyState');
		if(state !== undefined){
			return readyStateMap[state];
		}
		return 'not ready';
	};
	
	/*
	readonly attribute unsigned short networkState;
	const unsigned short NETWORK_EMPTY = 0;
	const unsigned short NETWORK_IDLE = 1;
	const unsigned short NETWORK_LOADING = 2;
	const unsigned short NETWORK_NO_SOURCE = 3;
	*/
	var networkStateMap = {
			0: 'NETWORK_EMPTY',
			1: 'NETWORK_IDLE',
			2: 'NETWORK_LOADING',
			3: 'NETWORK_NO_SOURCE'
		};
		
	AVideo.prototype.networkState = function(){
		var state = this.get('networkState');
		if(state !== undefined){
			return networkStateMap[state];
		}
		return 'not ready';
	};
	
	/////////////////////////////////////////
	//
	// Video 이벤트
	//
	/////////////////////////////////////////
	
	/*
	loadstart 		: 브라우져가 미디어를 찾기 시작할 때 발생 
	progress 		: 브라우져가 미디어 데이터를 가져오는 중에 발생 
	suspend 		: 브라우져가 현재 데이터를 전부다 다운하지 않았는데 미디어 데이터를 가져오는 것이 멈췄을 때 발생 
	abort 			: 브라우져가 에러가 아닌 상황에서 미디어 데이터를 가져오는 것을 멈췄을 때 발생 
	error 			: 미디어 데이터를 가져오다가 에러가 발생했을 때 발생 
	emptied 		: 미디어의 networkState가 NETWORK_EMPTY상태로 들어가게 되었을 때 발생 (치명적인 오류로 멈추거나, 이미 리소스 선택 알고리즘이 실행중이었는데 load() 함수가 호출되었을 때)
	play 			: 재생되었을 때, play() 함수가 리턴하고나서, autoplay로 인해 재생이 시작되었을 때 호출 
	pause 			: 미디어가 일시정지 되었을 때 발생 (pause()함수가 리턴 되고나서 발생)
	loadedmetadata 	: 브라우져가 미디어의 길이와 넓이, 높이의 메타정보를 가져왔을 때 발생 
	loadeddata 		: 브라우져가 현재 재생위치에서 미디어 정보를 뿌릴 수 있는 상태로 준비되면 발생
	waiting 		: 다음 프레임이 로드되지 않아서 재생이 멈추었을 때 발생, 브라우져는 곧 프레임이 가능해질 것이라고 예상하고 있음 
	playing 		: 재생이 시작되었을 때 발생 
	canplay 		: 브라우져가 미디어 데이터의 재생이 가능해질 때 발생, 하지만 지금 재생을 시작하면 이후 버퍼링 속도가 느려서 다시 멈추지 않고 재생이 불가할것이라고 측정 함
	canplaythrough 	: 브라우저가 현재 재생을 시작하면, 버퍼링 속도와 재생 속도를 고려했을 때 끝까지 멈추지 않고 재생 가능할 것이라고 측정 함
	seeking 		: seek 동작이 길게 유지되어서 브라우져에서 이벤트 발생이 될정도가 되었을 때 발생 
	seeked 			: seeking이 끝나면 발생
	timeupdate 		: 현재 재생위치가 바뀌었을 때 발생 
	ended 			: 미디어의 끝에 도달해서 재생이 멈추었을 때 발생 
	ratechange 		: defaultPlaybackRate나 playbackRate의 속성이 변경되었을 때 발생 
	durationchange 	: duration 속성이 바뀌었을 때 발생 
	volumechange 	: volume 속성이 변하거나 muted 속성이 변했을 때 발생 
	*/
	
	var eventNames = ('loadstart, progress,' +
			'suspend, abort,' +
			'error, emptied,' +
			'play, pause,' +
			'loadedmetadata, loadeddata,' +
			'waiting, playing,' +
			'canplay, canplaythrough,' +
			'seeking, seeked, timeupdate, ended,' +
			'ratechange,' +
			'durationchange, volumechange');
	
	AVideo.prototype.initializeEvent = function (){
		console.log('AVideo 이벤트 등록');

		// container를 이벤트 프록시 역할을 하도록 만듬
		this._createEventProxy();
		
		// 이벤트 등록
		this._addEvent();
	};

	AVideo.prototype.clearEvent = function (){
		
		// 이벤트 제거
		this._removeEvent();
		
		// proxy 제거
		this._clearEventProxy();
	};
	
	// Container를 Event Proxy 설정
	AVideo.prototype._createEventProxy = function (){
		
		var events = eventNames.split(',');
		for(var prop in events)
		{
			// player 이벤트를 모두 container 이벤트로 전달되도록 함
			var eventName = events[prop].trim();
			var proxy = $.proxy(eventListener, this);
			this.$player.on(eventName, proxy);
			
			//console.log('\t * player event create : ', eventName);
		}
	};
	
	AVideo.prototype._clearEventProxy = function (){
		
		var events = eventNames.split(',');
		for(var prop in events)
		{
			// player 이벤트를 모두 container 이벤트로 전달되도록 함
			var eventName = events[prop].trim();
			var proxy = $.proxy(eventListener, this);
			this.$player.off(eventName, proxy);
			
			//console.log('\t * player event clear : ', eventName);
		}
	};
	
	// scope : AVideo == this
	function eventListener(event){
		// container로 이벤트 전달
		this.trigger(event);
	}

	//---------------------------------------
	// 이벤트 등록/제거
	//---------------------------------------
	
	// 이벤트 등록
	AVideo.prototype._addEvent = function (){
		var events = eventNames.split(',');
		for(var prop in events)
		{
			// player 이벤트를 모두 container 이벤트로 전달되도록 함
			var eventName = events[prop].trim();
			var handlerName = getHandlerName(eventName);

			if(handlerName in this){
				var proxy = $.proxy(this[handlerName], this);
				this.on(eventName, proxy);
				
				//console.log('\t * player event add : ', eventName, handlerName);
			}
		}
	};

	// 이벤트 제거
	AVideo.prototype._removeEvent = function (){
		var events = eventNames.split(',');
		for(var prop in events)
		{
			// player 이벤트를 모두 container 이벤트로 전달되도록 함
			var eventName = events[prop].trim();
			var handlerName = getHandlerName(eventName);
			
			if(handlerName in this){
				var proxy = $.proxy(this[handlerName], this);
				this.off(eventName, proxy);
				
				//console.log('\t * player event remove : ', eventName, handlerName);
			}
		}
	};
	
	function getHandlerName(eventName){
		// capitalize
		eventName = eventName.charAt(0).toUpperCase() + eventName.slice(1);
		var handlerName = 'on' + eventName;
		
		//var handlerName = 'on' + eventName.substring(0,1).toUpperCase() + eventName.substring(1);
		return handlerName;
	}
	
	//---------------------------------------
	// 이벤트 Proxy
	//---------------------------------------

	// 등록
	AVideo.prototype.on = function (type, handler){
		this.$container.on(type, $.proxy(handler, this));
	};
	
	AVideo.prototype.off = function (type, handler){
		this.$container.off(type, $.proxy(handler, this));
	};

	AVideo.prototype.one = function (type, handler){
		this.$container.one(type, $.proxy(handler, this));
	};

	AVideo.prototype.trigger = function (type, data){
		//console.log('player trigger : ', type);
		this.$container.trigger(type, [data]);
	};

	//---------------------------------------
	// 이벤트 핸들러 - UI 설정
	//---------------------------------------
	
	// event.target : AVideo 객체
	
	// 브라우져가 미디어를 찾기 시작할 때 발생
	AVideo.prototype.onLoadstart = function(e){
		console.log('onLoadstart');
	};
	// 브라우져가 미디어 데이터를 가져오는 중에 발생 
	AVideo.prototype.onProgress = function(e){
		console.log('onProgress : ', this.player.readyState);
	};
	// 브라우져가 현재 데이터를 전부다 다운하지 않았는데 미디어 데이터를 가져오는 것이 멈췄을 때 발생
	AVideo.prototype.onSuspend = function(e){
		//console.log('onSuspend');
	};
	// 브라우져가 에러가 아닌 상황에서 미디어 데이터를 가져오는 것을 멈췄을 때 발생
	AVideo.prototype.onAbort = function(e){
		//console.log('onSuspend');
	};
	// 미디어 데이터를 가져오다가 에러가 발생했을 때 발생
	AVideo.prototype.onError = function(e){
		console.log('onError : ', e);
		displayError.apply(this);
	};
	// 미디어의 networkState가 NETWORK_EMPTY상태로 들어가게 되었을 때 발생 (치명적인 오류로 멈추거나, 이미 리소스 선택 알고리즘이 실행중이었는데 load() 함수가 호출되었을 때)
	AVideo.prototype.onEmptied = function(e){
		//console.log('onEmptied');
	};
	// 재생되었을 때, play() 함수가 리턴하고나서, autoplay로 인해 재생이 시작되었을 때 호출 
	AVideo.prototype.onPlay = function(e){
		console.log('onPlay');
	};
	// 미디어가 일시정지 되었을 때 발생 (pause()함수가 리턴 되고나서 발생)
	AVideo.prototype.onPause = function(e){
		console.log('onPause');
	};
	// 브라우져가 미디어의 길이와 넓이, 높이의 메타정보를 가져왔을 때 발생
	AVideo.prototype.onLoadedmetadata = function(e){
		console.log('onLoadedmetadata');
	};
	// 브라우져가 현재 재생위치에서 미디어 정보를 뿌릴 수 있는 상태로 준비되면 발생
	AVideo.prototype.onLoadeddata = function(e){
		console.log('onLoadeddata');
		this._playerReady = true;
		onReady.apply(this);
	};
	// 다음 프레임이 로드되지 않아서 재생이 멈추었을 때 발생, 브라우져는 곧 프레임이 가능해질 것이라고 예상하고 있음
	AVideo.prototype.onWaiting = function(e){
		console.log('onWaiting');
	};
	// 재생이 시작되었을 때 발생
	AVideo.prototype.onPlaying = function(e){
		console.log('onPlaying');
	};
	// 브라우져가 미디어 데이터의 재생이 가능해질 때 발생, 하지만 지금 재생을 시작하면 이후 버퍼링 속도가 느려서 다시 멈추지 않고 재생이 불가할것이라고 측정 함
	AVideo.prototype.onCanplay = function(e){
		console.log('onCanplay');
	};
	// 브라우저가 현재 재생을 시작하면, 버퍼링 속도와 재생 속도를 고려했을 때 끝까지 멈추지 않고 재생 가능할 것이라고 측정 함
	AVideo.prototype.onCanplaythrough = function(e){
		console.log('onCanplaythrough');
	};
	// seek 동작이 길게 유지되어서 브라우져에서 이벤트 발생이 될정도가 되었을 때 발생
	AVideo.prototype.onSeeking = function(e){
		console.log('onSeeking : ', this.currentTime());
	};
	// seeking이 끝나면 발생
	AVideo.prototype.onSeeked = function(e){
		console.log('onSeeked : ', this.currentTime());
	};
	// 현재 재생위치가 바뀌었을 때 발생
	AVideo.prototype.onTimeupdate = function(e){
		var timeString = formatTime(this.currentTime(), this.duration());
		console.log('onTimeupdate : ', timeString);
	};
	// 미디어의 끝에 도달해서 재생이 멈추었을 때 발생
	AVideo.prototype.onEnded = function(e){
		console.log('onEnded');
	};
	// defaultPlaybackRate나 playbackRate의 속성이 변경되었을 때 발생
	AVideo.prototype.onRatechange = function(e){
		//console.log('onRatechange');
	};
	// duration 속성이 바뀌었을 때 발생
	AVideo.prototype.onDurationchange = function(e){
		console.log('onDurationchange : ', this.duration());
	};
	// volume 속성이 변하거나 muted 속성이 변했을 때 발생
	AVideo.prototype.onVolumechange = function(e){
		console.log('onVolumechange : ', this.volume(), this.muted());
	};
	
	/////////////////////////////////////////
	// Video 함수
	/////////////////////////////////////////
	
	/*
	load() 					: 로드를 시작한다.
	canPlayType(type) 		: type이 재생 가능한지 여부
	play() 					: 비디오를 재생한다.
	pause()					: 비디오를 일시 정지한다.
	*/
	
	AVideo.prototype.initializeFunction = function (){
		//
	};
	
	AVideo.prototype.load = function(){
		if(!this.player) return;
		this.player.load();
	};
	
	AVideo.prototype.canPlayType = function(type){
		if(!this.player) return;
		return this.player.canPlayType(type);
	};

	AVideo.prototype.play = function(){
		if(!this.player) return;
		var isPaused = this.player.paused;
		if(isPaused){
			this.player.play();
		}
	};

	AVideo.prototype.pause = function(){
		if(!this.player) return;
		var isPlaying = !this.player.paused;
		if(isPlaying){
			this.player.pause();
		}
	};
	
	AVideo.prototype.stop = function(){
		if(!this.player) return;
		this.pause();
		this.currentTime(0);
	};
	
	AVideo.prototype.togglePlay = function(){
		if(!this.player) return;
		var isPaused = this.player.paused;
		if(isPaused){
			this.player.play();
		}else{
			this.player.pause();
		}
	};
	
	// Video 기능 제거, DOM Container 제거
	AVideo.prototype.dispose = function(){
		if(!this.container) return;
		this.stop();
		
		this.clearConfig();
		this.clearEvent();
		unwraping.apply(this);
		
		this.player = null;
		this.$player = null;
		this.id = null;
		this.config = null;
		
		this._playerReady = false;
		//this._onReadyCallback = null;
	};
	
	/*

    player.ready(function(){
      if (this.tag && this.options_['autoplay'] && this.paused()) {
        delete this.tag['poster']; // Chrome Fix. Fixed in Chrome v16.
        this.play();
      }
    });
    */
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/////////////////////////////////////////
	//
	// HTML5 Video 지원여부 체크
	//
	/////////////////////////////////////////
	
	/*
	canPlayType의 인자인 type가 가지는 값들은 아래와 같은 값들을 가지는 것이 보통이다.
	video/ogg
	video/mp4
	video/mp4
	audio/mpeg
	audio/ogg
	audio/mp4
	
	또는 코덱까지 포함하는 값을 가지기도 한다.
	video/ogg; codecs='theora, vorbis'
	video/mp4; codecs='avc1.4D401E, mp4a.40.2'
	video/webm; codecs='vp8.0, vorbis'
	audio/ogg; codecs='vorbis'
	audio/mp4; codecs='mp4a.40.5'
	
	그럼 video의 canPlayType(type) 함수에서는 아래의 값들을 리턴하게 된다.
	'probably' 	- 거의 지원
	'maybe'		- 지원할수도 있음
	'' 			- 지원 안함
	*/
	
	// 'none', 'all', 'notOgg', 'notMP4'
	var _canPlayType;
	
	// type : 'ogg', 'mp4'
	function checkVideoSupport(type)
	{
		function test(type){
			switch (_canPlayType)
			{
				case 'none':
					return false;
				case 'all':
					return true;
				case 'notOgg':
					return (type != 'ogg');
				case 'notMP4':
					return (type != 'mp4');
				default:
					return false;
			}
		}
		
		if(_canPlayType !== undefined){
			return test(type);
		}
		
		var videoElement = document.createElement('video');
		var canPlay = !!videoElement.canPlayType;
		if(!canPlay){
			_canPlayType = 'none';
			return test(type);
		}
		
		var video = document.createElement('video');
		var oggTest = video.canPlayType('video/ogg; codecs="theora, vorbis"');
		if(!oggTest)
		{
			var h264Test = video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
			if(!h264Test){
				_canPlayType = 'none';
			}else{
				if(h264Test == 'probably'){
					_canPlayType = 'all';
				}else{
					_canPlayType = 'notMP4';
				}
			}
		}
		else
		{
			if(oggTest == 'probably'){
				_canPlayType =  'all';
			} else {
				_canPlayType =  'notOgg';
			}
		}
		
		return test(type);
	}
	
	// seconds : currentTime
	// guide : duration 
	function formatTime(seconds, guide) {
		  // Default to using seconds as guide
		  guide = guide || seconds;
		  var s = Math.floor(seconds % 60),
		      m = Math.floor(seconds / 60 % 60),
		      h = Math.floor(seconds / 3600),
		      gm = Math.floor(guide / 60 % 60),
		      gh = Math.floor(guide / 3600);

		  // handle invalid times
		  if (isNaN(seconds) || seconds === Infinity) {
		    // '-' is false for all relational operators (e.g. <, >=) so this setting
		    // will add the minimum number of fields specified by the guide
		    h = m = s = '-';
		  }

		  // Check if we need to show hours
		  h = (h > 0 || gh > 0) ? h + ':' : '';

		  // If hours are showing, we may need to add a leading zero.
		  // Always show at least one digit of minutes.
		  m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':';

		  // Check if leading zero is need for seconds
		  s = (s < 10) ? '0' + s : s;

		  return h + m + s;
		};

		/////////////////////////////////////////
		//
		// 화면 표시
		//
		/////////////////////////////////////////
		
		// Player 지원 안됨 표시
		function displaySupportHTML5(){
			var isSupport = checkVideoSupport();
			if(isSupport){
				return true;
			}
			
			var text = ('HTML5 VIDEO가 지원되지 않습니다.');
			var tag = getDisplayTag.apply(this, [text]);
			
			return false;
		}
		
		// 화면에 에러 출력
		function displayError(){
			var readyState = player.readyState();
			var networkState = player.networkState();
			
			var text = (
					'[ERROR]<br> ' +
					'* readyState : ' + readyState + ' <br> ' +
					'* networkState : ' + networkState
				);
			var tag = getDisplayTag.apply(this, [text]);
		}
		
		function getDisplayTag(text){
			var w = this.$player.width();
			var h = this.$player.height();
			
			var tag = $('<div>' + text + '</div>');
			tag.css({
				'color' : '#FFFFFF',
				'font-size':'15px',
				'position': 'absolute',
				'width' : w,
				'margin-top' : -h/2,
				'text-align': 'center',
				'padding' : '15px'
			});
			this.$player.after(tag);
			
			// 세로 중앙
			var contentH = tag.height();
			console.log("contentH", contentH);
			var top = -h + (h - contentH)/2;
			tag.css('margin-top', top);
			
			return tag;
		}
	
	
	
	
	
	
	
	



	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	