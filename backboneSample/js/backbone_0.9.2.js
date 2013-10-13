//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
//     ※ 역주메모
//     hash - 해시: Ruby의 Hash를 이미지하고 있다고 생각된다. 다만 Router절에서는
//                  URL fragment 로써 해시를 주로 가리키는 것에 주의.
//     attribute - 속성: Model이 표현하는 값의 필드를 가리키는 속성이라 한다.
//     bind - 연결 : 주로 이벤트에서 사용된다. bound도 마찬가지.
//     history - 이력
//     원문서: https://github.com/documentcloud/backbone/blob/918edf86d6633e2a0cdfba5d28eae31ca49cbaac/backbone.js

(function()
{
	
	// Initial Setup
	// -------------
	
	// 글로벌 객체 참조를 저장한다. (브라우저에서는`window`를 가르키며, 서버 환경
	// 에서는`global`을 가르킴).
	var root = this;
	
	// `noConflict`가 사용될 때, 나중에 복원가능 하도록 해두기 위해
	// 기존`Backbone`변수를 저장해 둔다.
	var previousBackbone = root.Backbone;
	
	// slice/splice의 로컬 참조를 작성한다.
	var slice = Array.prototype.slice;
	var splice = Array.prototype.splice;
	
	// 최상위 네임 스페이스. Backbone의 모든 공용 클래스와 모듈은 이것에 연결된다.
	// CommonJS 및 브라우저 환경 모두 export한다.
	var Backbone;
	if (typeof exports !== 'undefined')
	{
		Backbone = exports;
	}
	else
	{
		Backbone = root.Backbone = {};
	}
	
	// 라이브러리의 현재 버전. `package.json`와 동일하게 유지할 것.
	Backbone.VERSION = '0.9.2';
	
	// 만약 서버 환경이며, require가 정의되지 않았다면 underscore를 require 한다.
	var _ = root._;
	if (!_ && (typeof require !== 'undefined')) _ = require('underscore');
	
	// Backbone의 실행을 위해, jQuery, Zepto, Ender 중 하나가`$`변수를 가져간다.
	var $ = root.jQuery || root.Zepto || root.ender;
	
	// DOM 조작 및 Ajax 호출을 위해 사용되는 JavaScript 라이브러리를 설정한다 (예를 들어
	// `$`변수). Backbone의 기본값에서는 jQuery, Zepto, Ender 중 하나를 사용하지만,
	// `setDomLibrary`메서드에서 그 대체가 되는 JavaScript 라이브러리를 설정 할 수 있다.
	// (또는 브라우저 밖에서 View를 테스트하기 위한 mock 라이브러리).
	Backbone.setDomLibrary = function(lib)
	{
		$ = lib;
	};
	
	// * noConflict * 모드에서 Backbone.js를 실행할 때 `Backbone`변수를 이전의 변수로 되돌린다.
	// 그리고 이 Backbone 개체의 참조를 반환한다.
	Backbone.noConflict = function()
	{
		root.Backbone = previousBackbone;
		return this;
	};
	
	// 오래된 HTTP 서버를 지원하기 위해`emulateHTTP`을 활성화한다.
	// 이 옵션을 설정하면 `_method`매개변수와`X-Http-Method-Override`
	// 헤더를 부여하고, 유사하게 "PUT" 과 "DELETE" 요청을 한다.
	Backbone.emulateHTTP = false;
	
	// `application/json`요청을 직접 처리 할 수 없는 오래된 서버를 지원하기 위해,
	// `emulateJSON`를 활성화 하면 ... 대신 `application/x-www-form-urlencoded`
	// 로 request body를 인코딩해, `model`이라는 폼 매개 변수로
	// model을 송신한다.
	Backbone.emulateJSON = false;
	
	// Backbone.Events
	// -----------------
	
	// 이벤트 문자열을 분할하는 정규식
	var eventSplitter = /\s+/;
	
	// *모든 Object*와 mixin이 가능하고, 사용자 지정 이벤트를 제공하는 모듈이다.
	// 이벤트에 콜백 함수를 `on`으로 연결해 `off`에서 삭제할 수 있고,
	// `trigger`에서 이벤트를 실행시켜, 모든 콜백을 실행 할 수 있다.
	//
	// var object = {};
	// _.extend(object, Backbone.Events);
	// object.on('expand', function(){ alert('expanded'); });
	// object.trigger('expand');
	//
	var Events = Backbone.Events = {
		
		// 공백으로 구분 된 하나 또는 복수의 이벤트로 `events` 를 `callback` 함수에
		// 연결한다.`"all"`이 전달되면, 콜백은 모든 이벤트 실행으로 연결인다.
		on : function(events, callback, context)
		{
			
			var calls, event, node, tail, list;
			if (!callback) return this;
			events = events.split(eventSplitter);
			calls = this._callbacks || (this._callbacks = {});
			
			// 변하지 않는 콜백 목록을 작성하고 변경중의 요소를 인지한다. 마지막은 빈 객체로
			// 항상 다음 노드로 이용된다.
			while (event = events.shift())
			{
				list = calls[event];
				node = list ? list.tail : {};
				node.next = tail = {};
				node.context = context;
				node.callback = callback;
				calls[event] = {
					tail : tail,
					next : list ? list.next : node
				};
			}
			
			return this;
		},
		
		// 하나 혹은 복수의 콜백을 삭제한다. 만약 `context` 가 null이면 그 함수에
		// 의한 모든 콜백을 삭제한다. 만약 `callback` 이 null이면 해당 이벤트의
		// 모든 콜백을 삭제한다. 만약 `events` 가 null이면 모든 이벤트에 연관된
		// 콜백을 삭제한다.
		off : function(events, callback, context)
		{
			var event, calls, node, tail, cb, ctx;
			
			// 이벤트가 없음, 혹은*모든*이벤트를 삭제할 때
			if (!(calls = this._callbacks)) return;
			if (!(events || callback || context))
			{
				delete this._callbacks;
				return this;
			}
			
			// 나열된 이벤트와 컨텍스트를 반복하여
			// 링크 된 콜백 목록에서 적절하게 그것들을 제거한다.
			events = events ? events.split(eventSplitter) : _.keys(calls);
			while (event = events.shift())
			{
				node = calls[event];
				delete calls[event];
				if (!node || !(callback || context)) continue;
				
				// 지정된 콜백을 건너 뛰고 새 목록을 작성한다.
				tail = node.tail;
				while ((node = node.next) !== tail)
				{
					cb = node.callback;
					ctx = node.context;
					if ((callback && cb !== callback)
							|| (context && ctx !== context))
					{
						this.on(event, cb, ctx);
					}
				}
			}
			
			return this;
		},
		
		// 하나 혹은 복수의 이벤트를 발생시키고 연결된 모든 콜백을 실행한다.
		// 콜백에는 이벤트 명마다 `trigger` 와 동일한 인수를 건네 준다.
		// (`"all"`를 이용하고 있지 않는 한, 콜백은 본래의 이벤트 명을 첫 번째 인수로
		// 받는다.）
		trigger : function(events)
		{
			var event, node, calls, tail, args, all, rest;
			if (!(calls = this._callbacks)) return this;
			all = calls.all;
			events = events.split(eventSplitter);
			rest = slice.call(arguments, 1);
			
			// 각각의 이벤트에서, 링크 된 콜백 목록을 2회 스캐닝하고,
			// 처음에 이벤트를 발생시킨 다음에 `* all *` 콜백을 발생시킨다.
			while (event = events.shift())
			{
				if (node = calls[event])
				{
					tail = node.tail;
					while ((node = node.next) !== tail)
					{
						node.callback.apply(node.context || this, rest);
					}
				}
				if (node = all)
				{
					tail = node.tail;
					args = [ event ].concat(rest);
					while ((node = node.next) !== tail)
					{
						node.callback.apply(node.context || this, args);
					}
				}
			}
			
			return this;
		}
	
	};
	
	// 하위 호환성을 위한 별칭
	Events.bind = Events.on;
	Events.unbind = Events.off;
	
	// Backbone.Model
	// --------------
	
	// 정의 된 속성과 함께 새로운 모델을 작성한다. 클라이언트 ID (`cid`)는 자동으로 생성
	// 되어 할당된다.
	var Model = Backbone.Model = function(attributes, options)
	{
		var defaults;
		attributes || (attributes = {});
		if (options && options.parse) attributes = this.parse(attributes);
		if (defaults = getValue(this, 'defaults'))
		{
			attributes = _.extend({}, defaults, attributes);
		}
		if (options && options.collection) this.collection = options.collection;
		this.attributes = {};
		this._escapedAttributes = {};
		this.cid = _.uniqueId('c');
		this.changed = {};
		this._silent = {};
		this._pending = {};
		this.set(attributes, {
			silent : true
		});
		
		// 변경 내용 추적을 리셋한다.
		this.changed = {};
		this._silent = {};
		this._pending = {};
		this._previousAttributes = _.clone(this.attributes);
		this.initialize.apply(this, arguments);
	};
	
	// 모든 상속 가능한 메서드를 모델 프로토타입에 연결한다.
	_
			.extend(
					Model.prototype,
					Events,
					{
						
						// 현재와 이전의 값과 다른 속성의 해시.
						changed : null,
						
						// 마지막으로 `change` 가 호출된 때부터 silent 한 변화가 있던 속성의 해시.
						// 다음에 호출 된 경우, 이 속성은 보류 중으로 된다.
						_silent : null,
						
						// 마지막으로 `change` 이벤트가 불린 다음, 변경된 속성의 해시.
						_pending : null,
						
						// JSON `id`속성의 기본 이름은 `"id"`.
						// MongoDB나 CounchDB 의 사용자는 이것을 `"_id"` 로 할 수있다.
						idAttribute : 'id',
						
						// 초기화는 디폴트로 빈 함수. 자신의 초기화 로직으로 재정의한다.
						initialize : function()
						{
						},
						
						// 모델의 `attributes` 객체의 복사본을 돌려 준다.
						toJSON : function(options)
						{
							return _.clone(this.attributes);
						},
						
						// 속성 값을 취득한다.
						get : function(attr)
						{
							return this.attributes[attr];
						},
						
						// 속성 값을 HTML 이스케이프하고 취득한다.
						escape : function(attr)
						{
							var html;
							if (html = this._escapedAttributes[attr]) return html;
							var val = this.get(attr);
							return this._escapedAttributes[attr] = _
									.escape(val == null ? '' : '' + val);
						},
						
						// 속성 값이 null 또는 undefined 가 아니면 `true` 를 돌려 준다.
						has : function(attr)
						{
							return this.get(attr) != null;
						},
						
						// 모델속성의 해시를 객체로 설정하고 silent를 선택하지 않는 한
						// `"change"` 이벤트를 실행한다.
						set : function(key, value, options)
						{
							var attrs, attr, val;
							
							// `"key", value`와`{key: value}`의 두 스타일의 인수를 제어한다.
							if (_.isObject(key) || key == null)
							{
								attrs = key;
								options = value;
							}
							else
							{
								attrs = {};
								attrs[key] = value;
							}
							
							// 속성 및 옵션를 전개한다.
							options || (options = {});
							if (!attrs) return this;
							if (attrs instanceof Model) attrs = attrs.attributes;
							if (options.unset) for (attr in attrs)
								attrs[attr] = void 0;
							
							// 검증을 실행한다.
							if (!this._validate(attrs, options)) return false;
							
							// `id`의 변화를 체크한다.
							if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];
							
							var changes = options.changes = {};
							var now = this.attributes;
							var escaped = this._escapedAttributes;
							var prev = this._previousAttributes || {};
							
							// 각각에 특성을 `set`...
							for (attr in attrs)
							{
								val = attrs[attr];
								
								// 새로운 값과 지금의 값이 다른 경우 변경 사항을 기록한다.
								if (!_.isEqual(now[attr], val)
										|| (options.unset && _.has(now, attr)))
								{
									delete escaped[attr];
									(options.silent ? this._silent : changes)[attr] = true;
								}
								
								// 현재 값을 업데이트하거나 삭제한다.
								options.unset ? delete now[attr]
										: now[attr] = val;
								
								// 이전 값이 다른 경우 변경 사항을 기록하고, 그렇지 않은 경우 이 속성의 변경
								// 내용을 삭제한다.
								if (!_.isEqual(prev[attr], val)
										|| (_.has(now, attr) != _.has(prev,
												attr)))
								{
									this.changed[attr] = val;
									if (!options.silent) this._pending[attr] = true;
								}
								else
								{
									delete this.changed[attr];
									delete this._pending[attr];
								}
							}
							
							// `"change"`이벤트을 실행한다.
							if (!options.silent) this.change(options);
							return this;
						},
						
						// 모델에서 속성을 제거하고, silent를 선택하지 않는 한 `"change"` 이벤트를
						// 실행한다.
						// `unset`은 속성이 존재하지 않으면 아무것도하지 않는다.
						unset : function(attr, options)
						{
							(options || (options = {})).unset = true;
							return this.set(attr, null, options);
						},
						
						// 모델의 모든 속성을 지우고 silent를 선택하지 않는 한` "change"` 이벤트를
						// 실행한다.
						clear : function(options)
						{
							(options || (options = {})).unset = true;
							return this.set(_.clone(this.attributes), options);
						},
						
						// 서버에서 모델을 fetch한다. 서버가 가르키는 모델이 현재 속성과 다를 때
						// 덮어 쓰여지고 `"change"` 이벤트를 실행한다.
						fetch : function(options)
						{
							options = options ? _.clone(options) : {};
							var model = this;
							var success = options.success;
							options.success = function(resp, status, xhr)
							{
								if (!model.set(model.parse(resp, xhr), options)) return false;
								if (success) success(model, resp);
							};
							options.error = Backbone.wrapError(options.error,
									model, options);
							return (this.sync || Backbone.sync).call(this,
									'read', this, options);
						},
						
						// 모델의 속성 해시를 설정하고 모델을 서버와 동기화한다.
						// 서버가 돌려주는 속성 해시가 다른 경우, 모델은 다시 `set` 한다.
						save : function(key, value, options)
						{
							var attrs, current;
							
							// `("key", value)`와`({key: value})`의 두 스타일의 인수를
							// 제어한다.
							if (_.isObject(key) || key == null)
							{
								attrs = key;
								options = value;
							}
							else
							{
								attrs = {};
								attrs[key] = value;
							}
							options = options ? _.clone(options) : {};
							
							// 속성 변경를 `wait` 할 때는 먼저 유효성 검사를 한다.
							if (options.wait)
							{
								if (!this._validate(attrs, options)) return false;
								current = _.clone(this.attributes);
							}
							
							// 서버에 영속화하기 전에 속성를` set` 로서 정규 저장한다.
							var silentOptions = _.extend({}, options, {
								silent : true
							});
							if (attrs
									&& !this.set(attrs,
											options.wait ? silentOptions
													: options)) { return false; }
							
							// 서버 측 저장 성공 후, 클라이언트는 서버 측 상태에
							// 업데이트한다 (옵션).
							var model = this;
							var success = options.success;
							options.success = function(resp, status, xhr)
							{
								var serverAttrs = model.parse(resp, xhr);
								if (options.wait)
								{
									delete options.wait;
									serverAttrs = _.extend(attrs || {},
											serverAttrs);
								}
								if (!model.set(serverAttrs, options)) return false;
								if (success)
								{
									success(model, resp);
								}
								else
								{
									model.trigger('sync', model, resp, options);
								}
							};
							
							// 설정을 마치고, Ajax 요청을 전송한다.
							options.error = Backbone.wrapError(options.error,
									model, options);
							var method = this.isNew() ? 'create' : 'update';
							var xhr = (this.sync || Backbone.sync).call(this,
									method, this, options);
							if (options.wait) this.set(current, silentOptions);
							return xhr;
						},
						
						// 이미 영속화 된 모델을 서버에서 파기한다.
						// 만약 `wait : true` 가 전달되면 제거하기 전에 서버의 응답을 기다린다.
						destroy : function(options)
						{
							options = options ? _.clone(options) : {};
							var model = this;
							var success = options.success;
							
							var triggerDestroy = function()
							{
								model.trigger('destroy', model,
										model.collection, options);
							};
							
							if (this.isNew())
							{
								triggerDestroy();
								return false;
							}
							
							options.success = function(resp)
							{
								if (options.wait) triggerDestroy();
								if (success)
								{
									success(model, resp);
								}
								else
								{
									model.trigger('sync', model, resp, options);
								}
							};
							
							options.error = Backbone.wrapError(options.error,
									model, options);
							var xhr = (this.sync || Backbone.sync).call(this,
									'delete', this, options);
							if (!options.wait) triggerDestroy();
							return xhr;
						},
						
						// 서버에서 모델을 나타내는 기본 URL, Backbone의 RESTful 메서드를 사용하는
						// 경우, 이를 재정의하고 호출해야만 하는 엔드 포인트로 변경한다.
						url : function()
						{
							var base = getValue(this, 'urlRoot')
									|| getValue(this.collection, 'url')
									|| urlError();
							if (this.isNew()) return base;
							return base
									+ (base.charAt(base.length - 1) == '/' ? ''
											: '/')
									+ encodeURIComponent(this.id);
						},
						
						// **parse**는 응답을 모델로 `set` 할 수 있도록 속성의 해시로 변환한다.
						// 기본 구현은 단순히 응답을 전달하고있다.
						parse : function(resp, xhr)
						{
							return resp;
						},
						
						// 현재와 동일한 고유의 속성의 새로운 모델을 작성한다.
						clone : function()
						{
							return new this.constructor(this.attributes);
						},
						
						// 서버에 저장되어 있지 않은 경우, 모델은 새로운 것이며 ID가 없다.
						isNew : function()
						{
							return this.id == null;
						},
						
						// 이 메소드를 호출하면 모델의 `"change"` 이벤트와 수정 된 각 속성에 대해
						// `"change:attribute"`이벤트를 수동으로 실행한다.
						// 이를 호출하면 모델을 감시하고 있는 모든 객체가 업데이트된다.
						change : function(options)
						{
							options || (options = {});
							var changing = this._changing;
							this._changing = true;
							
							// silent한 변경을 보류 중로 변경한다.
							for ( var attr in this._silent)
								this._pending[attr] = true;
							
							// silent한 변경을 trigger한다.
							var changes = _.extend({}, options.changes,
									this._silent);
							this._silent = {};
							for ( var attr in changes)
							{
								this.trigger('change:' + attr, this, this
										.get(attr), options);
							}
							if (changing) return this;
							
							// 보류 중의 변경이 있는 경우는 `"change"`이벤트를 계속실행한다.
							while (!_.isEmpty(this._pending))
							{
								this._pending = {};
								this.trigger('change', this, options);
								
								// 보류 중의 변경과 silent한 변경이 아직 남아있다.
								for ( var attr in this.changed)
								{
									if (this._pending[attr]
											|| this._silent[attr]) continue;
									delete this.changed[attr];
								}
								this._previousAttributes = _
										.clone(this.attributes);
							}
							
							this._changing = false;
							return this;
						},
						
						// 마지막의 `"change"`이벤트로부터, 모델에 변경이 있었나를 판단한다.
						// 속성의 이름을 지정한 경우, 그 속성이 변경되었나를 판단한다.
						hasChanged : function(attr)
						{
							if (!arguments.length) return !_
									.isEmpty(this.changed);
							return _.has(this.changed, attr);
						},
						
						// 변경이 있은 모든 속성을 포함하는 객체 혹은 속성에 변경이 없으면 false 를 반환한다.
						// View 부분을 업데이트 할 필요가 있는지와, 또는 어떤 속성을 서버 측에서 유지할
						// 필요가 있는지를 판단하는 데 유용하다. unset 된 속성은 undefined가
						// 설정된다. 또한 모델에 대한 비교로서 속성 개체를 전달할 수 있고,
						// 변화 여부를 판단 할 수도 있다.
						changedAttributes : function(diff)
						{
							if (!diff) return this.hasChanged() ? _
									.clone(this.changed) : false;
							var val, changed = false, old = this._previousAttributes;
							for ( var attr in diff)
							{
								if (_.isEqual(old[attr], (val = diff[attr]))) continue;
								(changed || (changed = {}))[attr] = val;
							}
							return changed;
						},
						
						// 마지막으로 `"change"` 이벤트가 발생 할 때 기록 된 속성의 값를 취득한다.
						previous : function(attr)
						{
							if (!arguments.length || !this._previousAttributes) return null;
							return this._previousAttributes[attr];
						},
						
						// 마지막 `"change"` 이벤트시의, 모델의 모든 속성를 취득한다.
						previousAttributes : function()
						{
							return _.clone(this._previousAttributes);
						},
						
						// 현재 모델이 정상적인 상태인지를 확인한다. silent 한 변경을 한 경우에만*이상*한
						// 상태임을 취득 할 수있다.
						isValid : function()
						{
							return !this.validate(this.attributes);
						},
						
						// 모델의 다음의 완전한 속성 세트에 대해 검증를 실행하고,
						// 모두 유효한 경우는 `true` 를 돌려 준다.
						// 특정 `error` 콜백을 지정하여 전달 된 경우
						// 보통의 `"error"` 이벤트 대신 호출된다.
						_validate : function(attrs, options)
						{
							if (options.silent || !this.validate) return true;
							attrs = _.extend({}, this.attributes, attrs);
							var error = this.validate(attrs, options);
							if (!error) return true;
							if (options && options.error)
							{
								options.error(this, error, options);
							}
							else
							{
								this.trigger('error', this, error, options);
							}
							return false;
						}
					
					});
	
	// Backbone.Collection
	// -------------------
	
	// 순서에 상관없이 모델의 세트용으로 표준 컬렉션 클래스를 제공한다.
	// `comparator`이 지정되어 있는 경우 컬렉션은 모델이 추가,
	// 또는 삭제 된 상태의 순서를 유지한다.
	var Collection = Backbone.Collection = function(models, options)
	{
		options || (options = {});
		if (options.model) this.model = options.model;
		if (options.comparator) this.comparator = options.comparator;
		this._reset();
		this.initialize.apply(this, arguments);
		if (models) this.reset(models, {
			silent : true,
			parse : options.parse
		});
	};
	
	// 컬렉션의 상속 메서드를 정의한다.
	_
			.extend(
					Collection.prototype,
					Events,
					{
						
						// 컬렉션의 디폴트 모델은 **Backbone.Model**이다. 대부분의 경우는
						// 이를 재정의해야 한다.
						model : Model,
						
						// 초기화는 디폴트로 빈 함수. 자신의 초기화 로직으로 재정의한다.
						initialize : function()
						{
						},
						
						// 컬렉션을, 모델의 속성을 배열로 한 것으로서 JSON 표현으로 한다.
						toJSON : function(options)
						{
							return this.map(function(model)
							{
								return model.toJSON(options);
							});
						},
						
						// 모델 또는 모델의 목록을 지정한다. **silent**를 지정하면
						// `add`이벤트가 각각의 새로운 모델로 실행하는 것을 방지한다.
						add : function(models, options)
						{
							var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
							options || (options = {});
							models = _.isArray(models) ? models.slice()
									: [ models ];
							
							// 먼저 요소의 객체를 모델의 참조로 변경하고
							// 그리고 잘못된 모델이나 중복 모델이 추가되는 것을 방지한다.
							for (i = 0, length = models.length; i < length; i++)
							{
								if (!(model = models[i] = this._prepareModel(
										models[i], options))) { throw new Error(
										"Can't add an invalid model to a collection"); }
								cid = model.cid;
								id = model.id;
								if (cids[cid]
										|| this._byCid[cid]
										|| ((id != null) && (ids[id] || this._byId[id])))
								{
									dups.push(i);
									continue;
								}
								cids[cid] = ids[id] = model;
							}
							
							// 중복을 제거한다.
							i = dups.length;
							while (i--)
							{
								models.splice(dups[i], 1);
							}
							
							// 추가 된 모델의 이벤트를 listen 하고 `id`와 `cid` 에서 룩업 할 수 있도록
							// 인덱스를 작성한다.
							for (i = 0, length = models.length; i < length; i++)
							{
								(model = models[i]).on('all',
										this._onModelEvent, this);
								this._byCid[model.cid] = model;
								if (model.id != null) this._byId[model.id] = model;
							}
							
							// 컬렉션에 모델를 삽입하고, 필요한 경우 다시 정렬하고, silent 가 아니면
							// 각 모델의` add` 이벤트를 trigger한다.
							this.length += length;
							index = options.at != null ? options.at
									: this.models.length;
							splice.apply(this.models, [ index, 0 ]
									.concat(models));
							if (this.comparator) this.sort({
								silent : true
							});
							if (options.silent) return this;
							for (i = 0, length = this.models.length; i < length; i++)
							{
								if (!cids[(model = this.models[i]).cid]) continue;
								options.index = i;
								model.trigger('add', model, this, options);
							}
							return this;
						},
						
						// 모델 또는 모델의 목록을 세트에서 제거한다. silent를 지정하면
						// `remove`이벤트가 각각의 모델에서 발생하는 것을 방지한다.
						remove : function(models, options)
						{
							var i, l, index, model;
							options || (options = {});
							models = _.isArray(models) ? models.slice()
									: [ models ];
							for (i = 0, l = models.length; i < l; i++)
							{
								model = this.getByCid(models[i])
										|| this.get(models[i]);
								if (!model) continue;
								delete this._byId[model.id];
								delete this._byCid[model.cid];
								index = this.indexOf(model);
								this.models.splice(index, 1);
								this.length--;
								if (!options.silent)
								{
									options.index = index;
									model.trigger('remove', model, this,
											options);
								}
								this._removeReference(model);
							}
							return this;
						},
						
						// 컬렉션의 끝에 모델을 추가한다.
						push : function(model, options)
						{
							model = this._prepareModel(model, options);
							this.add(model, options);
							return model;
						},
						
						// 컬렉션의 끝에서 모델을 삭제한다.
						pop : function(options)
						{
							var model = this.at(this.length - 1);
							this.remove(model, options);
							return model;
						},
						
						// 컬렉션의 선두에 모델을 추가한다.
						unshift : function(model, options)
						{
							model = this._prepareModel(model, options);
							this.add(model, _.extend({
								at : 0
							}, options));
							return model;
						},
						
						// 컬렉션의 선두에서 모델을 삭제한다.
						shift : function(options)
						{
							var model = this.at(0);
							this.remove(model, options);
							return model;
						},
						
						// 지정된 ID에서 모델을 취득한다.
						get : function(id)
						{
							if (id == null) return void 0;
							return this._byId[id.id != null ? id.id : id];
						},
						
						// 지정한 클라이언트 ID로부터 모델을 취득한다.
						getByCid : function(cid)
						{
							return cid && this._byCid[cid.cid || cid];
						},
						
						// 주어진 인덱스의 모델을 취득한다.
						at : function(index)
						{
							return this.models[index];
						},
						
						// 속성이 일치하는 모델들을 반환한다. `filter` 의 심플한 사례로 도움이 된다.
						where : function(attrs)
						{
							if (_.isEmpty(attrs)) return [];
							return this
									.filter(function(model)
									{
										for ( var key in attrs)
										{
											if (attrs[key] !== model.get(key)) return false;
										}
										return true;
									});
						},
						
						// 강제적으로 컬렉션을 스스로 재정렬시킨다. 각 아이템이 추가 될 때마다 순서 정렬
						// 이 유지되고 있는 일반적인 상황에서는 이를 호출 할 필요는 없다.
						sort : function(options)
						{
							options || (options = {});
							if (!this.comparator) throw new Error(
									'Cannot sort a set without a comparator');
							var boundComparator = _.bind(this.comparator, this);
							if (this.comparator.length == 1)
							{
								this.models = this.sortBy(boundComparator);
							}
							else
							{
								this.models.sort(boundComparator);
							}
							if (!options.silent) this.trigger('reset', this,
									options);
							return this;
						},
						
						// 지정한 속성을 컬렉션의 각 모델로부터 추출한다.
						pluck : function(attr)
						{
							return _.map(this.models, function(model)
							{
								return model.get(attr);
							});
						},
						
						// 개별적으로 추가하는 것보다 더 많은 아이템이있을 때, `add`나`remove` 이벤트를
						// 실행하지 않고, 새로운 모델 목록에서 기존의 세트 전체를 리셋 할 수있다.
						// 마지막에 `reset` 이벤트가 실행된다.
						reset : function(models, options)
						{
							models || (models = []);
							options || (options = {});
							for ( var i = 0, l = this.models.length; i < l; i++)
							{
								this._removeReference(this.models[i]);
							}
							this._reset();
							this.add(models, _.extend({
								silent : true
							}, options));
							if (!options.silent) this.trigger('reset', this,
									options);
							return this;
						},
						
						// 이 컬렉션에 있어서의 모델의 기본 세트를 fetch하고, 그것들로 컬렉션을
						// 리셋한다. `add: true`가 전달 된 때 리셋하지 않고 모델을 컬렉션에
						// 추가한다.
						fetch : function(options)
						{
							options = options ? _.clone(options) : {};
							if (options.parse === undefined) options.parse = true;
							var collection = this;
							var success = options.success;
							options.success = function(resp, status, xhr)
							{
								collection[options.add ? 'add' : 'reset'](
										collection.parse(resp, xhr), options);
								if (success) success(collection, resp);
							};
							options.error = Backbone.wrapError(options.error,
									collection, options);
							return (this.sync || Backbone.sync).call(this,
									'read', this, options);
						},
						
						// 컬렉션에 새 모델의 인스턴스를 작성한다. 서버의 응답을 기다리도록
						// `wait: true`가 전달되지 않으면, 모델은 컬렉션에 즉시 추가된다.
						create : function(model, options)
						{
							var coll = this;
							options = options ? _.clone(options) : {};
							model = this._prepareModel(model, options);
							if (!model) return false;
							if (!options.wait) coll.add(model, options);
							var success = options.success;
							options.success = function(nextModel, resp, xhr)
							{
								if (options.wait) coll.add(nextModel, options);
								if (success)
								{
									success(nextModel, resp);
								}
								else
								{
									nextModel.trigger('sync', model, resp,
											options);
								}
							};
							model.save(null, options);
							return model;
						},
						
						// **parse**는 응답을 모델 목록으로서 컬렉션에 추가되도록 변환한다.
						// 디폴트 구현은 단순히 응답을 전달하고 있다.
						parse : function(resp, xhr)
						{
							return resp;
						},
						
						// _의 chain 프록시. Underscore 의 생성자에 의존하고 있기 때문에,
						// 나머지 메서드를 같은형식으로 프록시 할 수 없다.
						chain : function()
						{
							return _(this.models).chain();
						},
						
						// 모든 내부 상태를 리셋한다. 컬렉션이 리셋 될 때 호출된다.
						_reset : function(options)
						{
							this.length = 0;
							this.models = [];
							this._byId = {};
							this._byCid = {};
						},
						
						// 모델 또는 속성 해시를 컬렉션에 추가 할 수 있도록 준비한다.
						_prepareModel : function(model, options)
						{
							options || (options = {});
							if (!(model instanceof Model))
							{
								var attrs = model;
								options.collection = this;
								model = new this.model(attrs, options);
								if (!model._validate(model.attributes, options)) model = false;
							}
							else if (!model.collection)
							{
								model.collection = this;
							}
							return model;
						},
						
						// 모델과 컬렉션의 연결을 삭제하는 내부 메서드.
						_removeReference : function(model)
						{
							if (this == model.collection)
							{
								delete model.collection;
							}
							model.off('all', this._onModelEvent, this);
						},
						
						// 설정되어있는 모델이 이벤트를 실행 할 때마다 호출되는 내부 메서드.
						// 모델 ID가 변경 될 때, 모델 세트의 인덱스를 업데이트 할 필요가 있다.
						// 그 이외의 이벤트시에는, 단순히 이벤트를 프록시하고 지나간다.
						// 다른 컬렉션에서 유래 한 "add" 와 "remove"이벤트는 무시된다.
						_onModelEvent : function(event, model, collection,
								options)
						{
							if ((event == 'add' || event == 'remove')
									&& collection != this) return;
							if (event == 'destroy')
							{
								this.remove(model, options);
							}
							if (model
									&& event === 'change:' + model.idAttribute)
							{
								delete this._byId[model
										.previous(model.idAttribute)];
								this._byId[model.id] = model;
							}
							this.trigger.apply(this, arguments);
						}
					
					});
	
	// 컬렉션에 구현하려는 Underscore 메서드 모음.
	var methods = [ 'forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
			'detect', 'filter', 'select', 'reject', 'every', 'all', 'some',
			'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy',
			'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest',
			'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty',
			'groupBy' ];
	
	// Underscore 메서드가` Collection#models` 에 대한 프록시가 되도록 mixin한다.
	_.each(methods, function(method)
	{
		Collection.prototype[method] = function()
		{
			return _[method].apply(_, [ this.models ].concat(_
					.toArray(arguments)));
		};
	});
	
	// Backbone.Router
	// -------------------
	
	// 라우터는 페이크 URL을 액션에 매핑하고, 경로가 일치 할 때 이벤트를 실행한다.
	// 정적으로 설정되어 있지 않으면, 새로 작성 한 시점에 `routes` 해시가 설정된다.
	var Router = Backbone.Router = function(options)
	{
		options || (options = {});
		if (options.routes) this.routes = options.routes;
		this._bindRoutes();
		this.initialize.apply(this, arguments);
	};
	
	// 경로 문자열의 이름이 지정된 매개 변수나
	// 분할 된 부품을 매칭하기 위한 정규식 캐시.
	var namedParam = /:\w+/g;
	var splatParam = /\*\w+/g;
	var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
	
	// 모든 **Backbone.Router**로부터 상속되는 속성과 메서드을 설정한다.
	_.extend(Router.prototype, Events, {
		
		// 초기화는 디폴트로 빈 함수. 자신의 초기화 로직으로 재정의한다.
		initialize : function()
		{
		},
		
		// 수동으로 단일의 이름이 붙은 경로를 콜백으로 연결한다. 예 :
		//
		// this.route('search/:query/p:num', 'search', function(query, num) {
		// ...
		// });
		//
		route : function(route, name, callback)
		{
			Backbone.history || (Backbone.history = new History);
			if (!_.isRegExp(route)) route = this._routeToRegExp(route);
			if (!callback) callback = this[name];
			Backbone.history.route(route, _.bind(function(fragment)
			{
				var args = this._extractParameters(route, fragment);
				callback && callback.apply(this, args);
				this.trigger.apply(this, [ 'route:' + name ].concat(args));
				Backbone.history.trigger('route', this, name, args);
			}, this));
			return this;
		},
		
		// 기록에 fragment를 저장하기 위한 `Backbone.history` 에 대한 간단한 프록시.
		navigate : function(fragment, options)
		{
			Backbone.history.navigate(fragment, options);
		},
		
		// 정의 된 모든 경로를 `Backbone.history` 에 연결한다.
		// 가장 일반적인 경로를 경로 맵 하단에 지정하는 동작을 지원하기 위해,
		// 여기서 경로 순서를 반대로 할 필요가 있다.
		_bindRoutes : function()
		{
			if (!this.routes) return;
			var routes = [];
			for ( var route in this.routes)
			{
				routes.unshift([ route, this.routes[route] ]);
			}
			for ( var i = 0, l = routes.length; i < l; i++)
			{
				this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
			}
		},
		
		// 현재 위치의 해시에 대하여 매칭하도록 경로 문자열을 정규표현으로 변환한다.
		_routeToRegExp : function(route)
		{
			route = route.replace(escapeRegExp, '\\$&').replace(namedParam,
					'([^\/]+)').replace(splatParam, '(.*?)');
			return new RegExp('^' + route + '$');
		},
		
		// 경로와 그것에 일치하는 URL 프래그먼트를 부여하면 추출 된 매개 변수의 배열을 반환한다.
		_extractParameters : function(route, fragment)
		{
			return route.exec(fragment).slice(1);
		}
	
	});
	
	// Backbone.History
	// ----------------
	
	// URL fragment를 기반으로 한 크로스 브라우저의 이력 관리를 제어한다.
	// 브라우저가 `onhashchange` 를 지원하지 않으면 폴링으로 fallback한다.
	var History = Backbone.History = function()
	{
		this.handlers = [];
		_.bindAll(this, 'checkUrl');
	};
	
	// 선행하는 해시와 슬래시를 제거하는 정규식.
	var routeStripper = /^[#\/]/;
	
	// Microsoft InternextExplorer를 감지하는 정규 표현식.
	var isExplorer = /msie [\w.]+/;
	
	// 이력 제어가 이미 시작되고 있는지?
	History.started = false;
	
	// 모든 **Backbone.History**로부터 상속되는 속성과 메서드를 설정한다.
	_
			.extend(
					History.prototype,
					Events,
					{
						
						// 해시 체인지의 폴링이 필요한 경우, 디폴트 인터벌은 1초에 20 번이다.
						interval : 50,
						
						// 본래 해시 값을 취득한다. Firefox에 있어서 location.hash가 항상 디코드되는
						// 버그에 의해 location.hash를 직접 취급 할 수 없다.
						getHash : function(windowOverride)
						{
							var loc = windowOverride ? windowOverride.location
									: window.location;
							var match = loc.href.match(/#(.*)$/);
							return match ? match[1] : '';
						},
						
						// 크로스 브라우저에서 정규화 된 URL을 URL, 해시 또는 재정의로부터 취득한다.
						getFragment : function(fragment, forcePushState)
						{
							if (fragment == null)
							{
								if (this._hasPushState || forcePushState)
								{
									fragment = window.location.pathname;
									var search = window.location.search;
									if (search) fragment += search;
								}
								else
								{
									fragment = this.getHash();
								}
							}
							if (!fragment.indexOf(this.options.root)) fragment = fragment
									.substr(this.options.root.length);
							return fragment.replace(routeStripper, '');
						},
						
						// 해시의 변경 제어를 시작, 현재 URL에 기존 경로가 일치하면 `true` 를 반환,
						// 그렇지 않으면 `false` 를 반환한다.
						start : function(options)
						{
							if (History.started) throw new Error(
									"Backbone.history has already been started");
							History.started = true;
							
							// 초기 설정을 찾는다. iframe이 필요한가? pushState가 필요하지만, 그것이
							// 유효한가?
							this.options = _.extend({}, {
								root : '/'
							}, this.options, options);
							this._wantsHashChange = this.options.hashChange !== false;
							this._wantsPushState = !!this.options.pushState;
							this._hasPushState = !!(this.options.pushState
									&& window.history && window.history.pushState);
							var fragment = this.getFragment();
							var docMode = document.documentMode;
							var oldIE = (isExplorer.exec(navigator.userAgent
									.toLowerCase()) && (!docMode || docMode <= 7));
							
							if (oldIE)
							{
								this.iframe = $(
										'<iframe src="javascript:0" tabindex="-1" />')
										.hide().appendTo('body')[0].contentWindow;
								this.navigate(fragment);
							}
							
							// pushState나 해시를 사용하고 있는지 여부, 'onhashchange'의 지원여부
							// 에 따라 URL 상태를 어떻게 확인할지 결정한다.
							if (this._hasPushState)
							{
								$(window).bind('popstate', this.checkUrl);
							}
							else if (this._wantsHashChange
									&& ('onhashchange' in window) && !oldIE)
							{
								$(window).bind('hashchange', this.checkUrl);
							}
							else if (this._wantsHashChange)
							{
								this._checkUrlInterval = setInterval(
										this.checkUrl, this.interval);
							}
							
							// pushState를 지원하지 않는 브라우저에 의해 열린 pushState 링크를 위해
							// 기본 URL을 변경해야 하는지의 여부를 결정한다.
							this.fragment = fragment;
							var loc = window.location;
							var atRoot = loc.pathname == this.options.root;
							
							// `pushState` 을 지원하는 브라우저 경로로 시작했지만 현재
							// 브라우저가 지원하지 않는 경우...
							if (this._wantsHashChange && this._wantsPushState
									&& !this._hasPushState && !atRoot)
							{
								this.fragment = this.getFragment(null, true);
								window.location.replace(this.options.root + '#'
										+ this.fragment);
								
								// 브라우저가 새로운 URL로 리다이렉션하도록 즉시 return한다.
								return true;
								
								// 또는 해시 기반 경로에서 시작했지만 현재 브라우저는 `pushState` 기반으로
								// 대신이 가능 할 때...
							}
							else if (this._wantsPushState && this._hasPushState
									&& atRoot && loc.hash)
							{
								this.fragment = this.getHash().replace(
										routeStripper, '');
								window.history.replaceState({}, document.title,
										loc.protocol + '//' + loc.host
												+ this.options.root
												+ this.fragment);
							}
							
							if (!this.options.silent) { return this.loadUrl(); }
						},
						
						// 아마 일시적으로 Backbone.history을 무효로 한다. 실제 응용 프로그램에서 사용할 수
						// 없지만,
						// Router 단위 테스트를 할 때 유용할 수 있다.
						stop : function()
						{
							$(window).unbind('popstate', this.checkUrl).unbind(
									'hashchange', this.checkUrl);
							clearInterval(this._checkUrlInterval);
							History.started = false;
						},
						
						// 프래그먼트가 변화 한 때 테스트하는 경로를 추가한다. 경로가 추가되면
						// 이전 경로는 재정의된다.
						route : function(route, callback)
						{
							this.handlers.unshift({
								route : route,
								callback : callback
							});
						},
						
						// 해시가 변경되었는지 현재 URL을 검사하고 그렇다면 `loadUrl` 를 호출하고,
						// 숨겨진 iframe을 통하여 정규화한다.
						checkUrl : function(e)
						{
							var current = this.getFragment();
							if (current == this.fragment && this.iframe) current = this
									.getFragment(this.getHash(this.iframe));
							if (current == this.fragment) return false;
							if (this.iframe) this.navigate(current);
							this.loadUrl() || this.loadUrl(this.getHash());
						},
						
						// 현재 URL fragment의 로드를 시도한다. 매치하여 경로가 성공하면 `true` 을 돌려
						// 준다.
						// 정의 된 경로에 프래그먼트가 일치하지 않으면 `false` 를 반환한다.
						loadUrl : function(fragmentOverride)
						{
							var fragment = this.fragment = this
									.getFragment(fragmentOverride);
							var matched = _.any(this.handlers,
									function(handler)
									{
										if (handler.route.test(fragment))
										{
											handler.callback(fragment);
											return true;
										}
									});
							return matched;
						},
						
						// 프래그먼트를 해시 이력에 저장할것인가, 'replace'옵션이 지정된 경우에
						// URL 상태를 바꿔친다. 사전의 fragment의 URL 인코딩은 스스로 적절히 실시한다.
						//
						// 경로 콜백을 실행 할 경우 (일반적으로 바람직하지 않음), 옵션 개체에
						// `trigger: true`가 포함되는게 가능하며, 또한 이력에 현재 URL를 추가하지 않고
						// 변경하고자
						// 하는 경우는 `replace: true`가 있다.
						navigate : function(fragment, options)
						{
							if (!History.started) return false;
							if (!options || options === true) options = {
								trigger : options
							};
							var frag = (fragment || '').replace(routeStripper,
									'');
							if (this.fragment == frag) return;
							
							// pushState가 유효하면, 그것을 사용하여 실제 URL과 같이 프래그먼트를 설정한다.
							if (this._hasPushState)
							{
								if (frag.indexOf(this.options.root) != 0) frag = this.options.root
										+ frag;
								this.fragment = frag;
								window.history[options.replace ? 'replaceState'
										: 'pushState']
										({}, document.title, frag);
								
								// 해시의 변경이 명시적으로 해제되어 있지 않으면 이력에 저장하기 위해 해시를
								// 갱신한다.
							}
							else if (this._wantsHashChange)
							{
								this.fragment = frag;
								this._updateHash(window.location, frag,
										options.replace);
								if (this.iframe
										&& (frag != this.getFragment(this
												.getHash(this.iframe))))
								{
									
									// IE7 이전에서 해시의 변경을 저장하기 위해 iframe을 열고-닫는
									// 트릭을 시행한다.
									// replace가 true이면 하지 않는다.
									if (!options.replace) this.iframe.document
											.open().close();
									this._updateHash(this.iframe.location,
											frag, options.replace);
								}
								
								// 해시 변경 기반의 이력 대체를 명시적으로 원하지 않으면 `navigate` 는
								// 페이지를 새로 고친다.
							}
							else
							{
								window.location.assign(this.options.root
										+ fragment);
							}
							if (options.trigger) this.loadUrl(fragment);
						},
						
						// 어떤하나의 현재 항목을 바꾸거나 브라우저 이력에 새로운 것을 추가하여
						// 해시의 location을 ​​업데이트한다.
						_updateHash : function(location, fragment, replace)
						{
							if (replace)
							{
								location.replace(location.toString().replace(
										/(javascript:|#).*$/, '')
										+ '#' + fragment);
							}
							else
							{
								location.hash = fragment;
							}
						}
					});
	
	// Backbone.View
	// -------------
	
	// Backbone.View을 만들면, 기존 요소가 제공되지 않을 경우, DOM 밖에 초기 요소가 만들어진다.
	var View = Backbone.View = function(options)
	{
		this.cid = _.uniqueId('view');
		this._configure(options || {});
		this._ensureElement();
		this.initialize.apply(this, arguments);
		this.delegateEvents();
	};
	
	// `delegate` 에서 키를 분할하는 정규식.
	var delegateEventSplitter = /^(\S+)\s*(.*)$/;
	
	// 속성으로 병합되는 View 옵션 목록.
	var viewOptions = [ 'model', 'collection', 'el', 'id', 'attributes',
			'className', 'tagName' ];
	
	// 모든 **Backbone.View**로부터 상속되는 속성과 메서드을 설정한다.
	_.extend(View.prototype, Events, {
		
		// 뷰 요소의 `tagName`은 디폴트로 `"div"` 이다.
		tagName : 'div',
		
		// 현재 뷰에있는 DOM 요소를 대상으로 하는 형태로 요소 조회를 jQuery에 위임한다.
		// 만약 가능하다면, 이 방법은 전체에 대한 룩업을 하는 것보다 권장된다.
		$ : function(selector)
		{
			return this.$el.find(selector);
		},
		
		// 초기화는 디폴트로 빈 함수. 자신의 초기화 로직으로 재정의한다.
		initialize : function()
		{
		},
		
		// **render**는 적절한 HTML에서 요소 (`this.el`)를 생성하기 위해
		// 각자의 뷰가 재정의해야 하는 코어 함수이다.
		// **render**에서는 항상 this를 반환 하는것이 일반적으로 이루어지고있다.
		render : function()
		{
			return this;
		},
		
		// DOM로부터 뷰를 삭제한다. 주의 : 뷰는 기본값에서는 DOM에 없기 때문에
		// 이 메소드에서 아무것도 일어나지 않을지도 모른다.
		remove : function()
		{
			this.$el.remove();
			return this;
		},
		
		// 소량의 DOM 요소이기에 제대로된 템플릿을 필요로하지 않을 때, **make**를 사용하여
		// 하나씩 요소를 생성 할 수있다.
		//
		// var el = this.make('li', {'class': 'row'},
		// this.model.escape('title'));
		//
		make : function(tagName, attributes, content)
		{
			var el = document.createElement(tagName);
			if (attributes) $(el).attr(attributes);
			if (content) $(el).html(content);
			return el;
		},
		
		// 뷰 요소 (`this.el` 속성)를 변경하고, 내포하는 이벤트를 재위임한다.
		setElement : function(element, delegate)
		{
			if (this.$el) this.undelegateEvents();
			this.$el = (element instanceof $) ? element : $(element);
			this.el = this.$el[0];
			if (delegate !== false) this.delegateEvents();
			return this;
		},
		
		// `this.events`해시에 표시된 콜백를 설정한다.
		//
		// *{"event selector": "callback"}*
		//
		// {
		// 'mousedown .title': 'edit',
		// 'click .button': 'save'
		// 'click .open': function(e) { ... }
		// }
		//
		// 짝으로 되어있다. `this` 에 속성을 설정하고 콜백은 뷰로 연결된다.
		// 효율성을 위해 이벤트 위임을 사용하고 있다. 셀렉터를 생략하면, `this.el`에
		// 연결되어진다. 위임 가능한 이벤트에만 동작한다.`focus`、`blur`는 그렇지 않다.
		// 또한 Internet Explorerで는 `change`,`submit`,`reset`가 그렇지 않다.
		delegateEvents : function(events)
		{
			if (!(events || (events = getValue(this, 'events')))) return;
			this.undelegateEvents();
			for ( var key in events)
			{
				var method = events[key];
				if (!_.isFunction(method)) method = this[events[key]];
				if (!method) throw new Error('Method "' + events[key]
						+ '" does not exist');
				var match = key.match(delegateEventSplitter);
				var eventName = match[1], selector = match[2];
				method = _.bind(method, this);
				eventName += '.delegateEvents' + this.cid;
				if (selector === '')
				{
					this.$el.bind(eventName, method);
				}
				else
				{
					this.$el.delegate(selector, eventName, method);
				}
			}
		},
		
		// `delegateEvents` 에 의해 뷰에 연결된 콜백을 모두 삭제한다.
		// 일반적으로 이것을 필요로하지 않지만, 같은 DOM 요소에 여러 개의 뷰를 연결 할 때 필요 할
		// 지도 모른다.
		undelegateEvents : function()
		{
			this.$el.unbind('.delegateEvents' + this.cid);
		},
		
		// 일련의 옵션에 의해 뷰의 초기 설정을 실시한다. 특별한 의미를 가진 키
		// *(model, collection, id, className)*는 뷰에 직접 연결된다.
		_configure : function(options)
		{
			if (this.options) options = _.extend({}, this.options, options);
			for ( var i = 0, l = viewOptions.length; i < l; i++)
			{
				var attr = viewOptions[i];
				if (options[attr]) this[attr] = options[attr];
			}
			this.options = options;
		},
		
		// 뷰가 render 를 위해 DOM 요소를 가지고 있는지 확인한다. 만약 `this.el`가
		// 문자열이면 `$()` 에 전달하여 매치 한 최초의 요소를 `el` 에 다시 할당한다.
		// 그렇지 않은 경우 `id`, `className`, `tagName` 속성으로 부터 요소를 생성한다.
		_ensureElement : function()
		{
			if (!this.el)
			{
				var attrs = getValue(this, 'attributes') || {};
				if (this.id) attrs.id = this.id;
				if (this.className) attrs['class'] = this.className;
				this.setElement(this.make(this.tagName, attrs), false);
			}
			else
			{
				this.setElement(this.el, false);
			}
		}
	
	});
	
	// Backbone 클래스에서 사용되는 자기 전파에 의한 확장을하는 함수.
	var extend = function(protoProps, classProps)
	{
		var child = inherits(this, protoProps, classProps);
		child.extend = this.extend;
		return child;
	};
	
	// 상속을 모델, 컬렉션, 뷰에 설정한다.
	Model.extend = Collection.extend = Router.extend = View.extend = extend;
	
	// Backbone.sync
	// -------------
	
	// `Backbone.sync` 의 디폴트 구현이 사용됨, CRUD를 HTTP로 대체하는 맵.
	var methodMap = {
		'create' : 'POST',
		'update' : 'PUT',
		'delete' : 'DELETE',
		'read' : 'GET'
	};
	
	// 모델을 서버에서 영속화하는 방법을 변경하려면 이 함수를 재정의한다.
	// 요청 유형 및 대상의 모델이 전달된다. 기본값에서는 Model의 `url()` 에 대해
	// RESTful 한 Ajax 요청을 한다. 일부 사용자정의의 가능성을 다음에 나타낸다.
	//
	// * `setTimeout` 을 사용하여 단일 요청에 의한 배치로 신속하게 업데이트한다.
	// * 모델을 JSON 대신 XML로 보낸다.
	// * Ajax 대신 WebScokets 을 통해 모델을 영속화한다.
	//
	// `Backbone.emulateHTTP` 을 활성화하면 `PUT` 과 `DELETE` 를 `_method` 매개 변수에
	// 본래의 HTTP 메서드를 포함한 상태에서 `POST` 로 전송하게 되어 요청 본문을
	// `application/json`으로 바꾸고, `application/x-www-form-urlencoded` 으로
	// `model`이라는 매개변수와 함께 송신하게 된다. **PHP**와 같이 `PUT`요청
	// 의 본문을 읽어내는것이 어려운 서버사이드의 인터페이스를 갖는 경우에 편리하다.
	
	Backbone.sync = function(method, model, options)
	{
		var type = methodMap[method];
		
		// 지정하지 않으면 기본 옵션.
		options || (options = {});
		
		// 디폴트 JSON 요청 옵션.
		var params = {
			type : type,
			dataType : 'json'
		};
		
		// URL을 가지고 있는지 확인한다.
		if (!options.url)
		{
			params.url = getValue(model, 'url') || urlError();
		}
		
		// 적절한 요청 데이터를 가지고 있는지 확인한다.
		if (!options.data && model
				&& (method == 'create' || method == 'update'))
		{
			params.contentType = 'application/json';
			params.data = JSON.stringify(model.toJSON());
		}
		
		// 오래된 서버는 요청을 HTML-form 형식으로 인코딩하여 JSON을 에뮬레이트한다.
		if (Backbone.emulateJSON)
		{
			params.contentType = 'application/x-www-form-urlencoded';
			params.data = params.data ? {
				model : params.data
			} : {};
		}
		
		// 오래된 서버는 `_method`와 `X-HTTP-Method-Override` 헤더에 원래의 HTTP 메서드
		// 를 모방함으로써 HTTP를 에뮬레이트한다.
		if (Backbone.emulateHTTP)
		{
			if (type === 'PUT' || type === 'DELETE')
			{
				if (Backbone.emulateJSON) params.data._method = type;
				params.type = 'POST';
				params.beforeSend = function(xhr)
				{
					xhr.setRequestHeader('X-HTTP-Method-Override', type);
				};
			}
		}
		
		// GET이 아닌 요청인 경우 데이터를 처리하지 않는다.
		if (params.type !== 'GET' && !Backbone.emulateJSON)
		{
			params.processData = false;
		}
		
		// 모든 Ajax 옵션의 재정의가 이루어지고, 요청처리를 한다.
		return $.ajax(_.extend(params, options));
	};
	
	// fallback의 오류 이벤트와 함께 옵션의 오류 콜백을 래핑한다.
	Backbone.wrapError = function(onError, originalModel, options)
	{
		return function(model, resp)
		{
			resp = model === originalModel ? resp : model;
			if (onError)
			{
				onError(originalModel, resp, options);
			}
			else
			{
				originalModel.trigger('error', originalModel, resp, options);
			}
		};
	};
	
	// Helpers
	// -------
	
	// 프로토타입 체인의 작성을 돕기 위하여 빈 생성자 함수를 공유한다.
	var ctor = function()
	{
	};
	
	// 서브 클래스의 프로토타입 체인을 바르게 설정하는 도우미 함수. `goog.inherits` 와
	// 닮아 있지만 프로토타입 속성의 해시를 이용하고, 클래스 속성을 상속한다.
	var inherits = function(parent, protoProps, staticProps)
	{
		var child;
		
		// 새로운 서브 클래스의 생성자 함수는 자신이 정의한 것 인가 ("constructor"
		// 속성을 `extend` 의 정의에 넣는다) 디폴트로 단순히 부모의 생성자 중 하나를 호출한다.
		if (protoProps && protoProps.hasOwnProperty('constructor'))
		{
			child = protoProps.constructor;
		}
		else
		{
			child = function()
			{
				parent.apply(this, arguments);
			};
		}
		
		// 부모 클래스 (정적) 속성을 상속한다.
		_.extend(child, parent);
		
		// `parent`의 생성자를 호출하지 않고, `parent` 로부터 프로토타입 체인을 상속한다.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		
		// 제공되면, 서브 클래스에 프로토타입 속성 (인스턴스 속성)을
		// 추가한다.
		if (protoProps) _.extend(child.prototype, protoProps);
		
		// 제공되면, 생성자 함수에 정적 속성을 추가한다.
		if (staticProps) _.extend(child, staticProps);
		
		// child의 `prototype.constructor` 를 설정한다.
		child.prototype.constructor = child;
		
		// 나중에 부모의 프로토타입이 필요할 때 유용한 속성을 설정한다.
		child.__super__ = parent.prototype;
		
		return child;
	};
	
	// Backbone 개체에서 속성 또는 함수로서 값을 얻기위한 헬퍼 함수.
	var getValue = function(object, prop)
	{
		if (!(object && object[prop])) return null;
		return _.isFunction(object[prop]) ? object[prop]() : object[prop];
	};
	
	// URL이 필요한데도 제공되지 않을 때 오류을 던진다.
	var urlError = function()
	{
		throw new Error('A "url" property or function must be specified');
	};
	
}).call(this);
