/*!
 * Flow: Front-end site library
 * @license MIT
 * Inline scripts may access the api using an async handler:
 *   var Flow = Flow || [];
 *   Flow.push(readyFunction);
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// __webpack_require__(4);
	// __webpack_require__(5);
	// __webpack_require__(6);
	// __webpack_require__(7);
	// __webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(1);
	__webpack_require__(10);
	__webpack_require__(11);
	// __webpack_require__(12);
	// __webpack_require__(13);
	// __webpack_require__(14);
	// __webpack_require__(15);
	// __webpack_require__(16);
	module.exports = __webpack_require__(17);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Flow: Core site library
	 */

	var Flow = {};
	var modules = {};
	var primary = [];
	var secondary = window.Flow || [];
	var $ = window.jQuery;
	var $win = $(window);
	var $doc = $(document);
	var isFunction = $.isFunction;
	var _ = Flow._ = __webpack_require__(18);
	var tram = __webpack_require__(3) && $.tram;
	var domready = false;
	var destroyed = false;
	var Modernizr = window.Modernizr;
	var noop = function() {};
	tram.config.hideBackface = false;
	tram.config.keepInherited = true;

	/**
	 * Flow.define - Define a named module
	 * @param  {string} name
	 * @param  {function} factory
	 * @return {object}
	 */
	Flow.define = function(name, factory) {
	  if (modules[name]) unbindModule(modules[name]);
	  var instance = modules[name] = factory($, _) || {};
	  bindModule(instance);
	  return instance;
	};

	/**
	 * Flow.require - Require a named module
	 * @param  {string} name
	 * @return {object}
	 */
	Flow.require = function(name) {
	  return modules[name];
	};

	function bindModule(module) {
	  // If running in Flow app, subscribe to design/preview events
	  if (Flow.env()) {
	    isFunction(module.design) && $win.on('__wf_design', module.design);
	    isFunction(module.preview) && $win.on('__wf_preview', module.preview);
	  }
	  // Subscribe to front-end destroy event
	  isFunction(module.destroy) && $win.on('__wf_destroy', module.destroy);
	  // Look for ready method on module
	  if (module.ready && isFunction(module.ready)) {
	    addReady(module);
	  }
	}

	function addReady(module) {
	  // If domready has already happened, run ready method
	  if (domready) {
	    module.ready();
	    return;
	  }
	  // Otherwise add ready method to the primary queue (only once)
	  if (_.contains(primary, module.ready)) return;
	  primary.push(module.ready);
	}

	function unbindModule(module) {
	  // Unsubscribe module from window events
	  isFunction(module.design) && $win.off('__wf_design', module.design);
	  isFunction(module.preview) && $win.off('__wf_preview', module.preview);
	  isFunction(module.destroy) && $win.off('__wf_destroy', module.destroy);
	  // Remove ready method from primary queue
	  if (module.ready && isFunction(module.ready)) {
	    removeReady(module);
	  }
	}

	function removeReady(module) {
	  primary = _.filter(primary, function(readyFn) {
	    return readyFn !== module.ready;
	  });
	}

	/**
	 * Flow.push - Add a ready handler into secondary queue
	 * @param {function} ready  Callback to invoke on domready
	 */
	Flow.push = function(ready) {
	  // If domready has already happened, invoke handler
	  if (domready) {
	    isFunction(ready) && ready();
	    return;
	  }
	  // Otherwise push into secondary queue
	  secondary.push(ready);
	};

	/**
	 * Flow.env - Get the state of the Flow app
	 * @param {string} mode [optional]
	 * @return {boolean}
	 */
	Flow.env = function(mode) {
	  var designFlag = window.__wf_design;
	  var inApp = typeof designFlag !== 'undefined';
	  if (!mode) return inApp;
	  if (mode === 'design') return inApp && designFlag;
	  if (mode === 'preview') return inApp && !designFlag;
	  if (mode === 'slug') return inApp && window.__wf_slug;
	  if (mode === 'editor') return window.FlowEditor;
	  if (mode === 'test') return window.__wf_test;
	};

	// Feature detects + browser sniffs  ಠ_ಠ
	var userAgent = navigator.userAgent.toLowerCase();
	var appVersion = navigator.appVersion.toLowerCase();
	var touch = Flow.env.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
	var chrome = Flow.env.chrome = /chrome/.test(userAgent) && /Google/.test(navigator.vendor) && parseInt(appVersion.match(/chrome\/(\d+)\./)[1], 10);
	var ios = Flow.env.ios = Modernizr && Modernizr.ios;
	Flow.env.safari = /safari/.test(userAgent) && !chrome && !ios;

	// Maintain current touch target to prevent late clicks on touch devices
	var touchTarget;
	// Listen for both events to support touch/mouse hybrid devices
	touch && $doc.on('touchstart mousedown', function(evt) {
	  touchTarget = evt.target;
	});

	/**
	 * Flow.validClick - validate click target against current touch target
	 * @param  {HTMLElement} clickTarget  Element being clicked
	 * @return {Boolean}  True if click target is valid (always true on non-touch)
	 */
	Flow.validClick = touch ? function(clickTarget) {
	  return clickTarget === touchTarget || $.contains(clickTarget, touchTarget);
	} : function() { return true; };

	/**
	 * Flow.resize, Flow.scroll - throttled event proxies
	 */
	var resizeEvents = 'resize.flow orientationchange.flow load.flow';
	var scrollEvents = 'scroll.flow ' + resizeEvents;
	Flow.resize = eventProxy($win, resizeEvents);
	Flow.scroll = eventProxy($win, scrollEvents);
	Flow.redraw = eventProxy();

	// Create a proxy instance for throttled events
	function eventProxy(target, types) {

	  // Set up throttled method (using custom frame-based _.throttle)
	  var handlers = [];
	  var proxy = {};
	  proxy.up = _.throttle(function(evt) {
	    _.each(handlers, function(h) { h(evt); });
	  });

	  // Bind events to target
	  if (target && types) target.on(types, proxy.up);

	  /**
	   * Add an event handler
	   * @param  {function} handler
	   */
	  proxy.on = function(handler) {
	    if (typeof handler !== 'function') return;
	    if (_.contains(handlers, handler)) return;
	    handlers.push(handler);
	  };

	  /**
	   * Remove an event handler
	   * @param  {function} handler
	   */
	  proxy.off = function(handler) {
	    // If no arguments supplied, clear all handlers
	    if (!arguments.length) {
	      handlers = [];
	      return;
	    }
	    // Otherwise, remove handler from the list
	    handlers = _.filter(handlers, function(h) {
	      return h !== handler;
	    });
	  };

	  return proxy;
	}

	// Flow.location - Wrap window.location in api
	Flow.location = function(url) {
	  window.location = url;
	};

	// Flow.app - Designer-specific methods
	Flow.app = Flow.env() ? {} : null;
	if (Flow.app) {

	  // Trigger redraw for specific elements
	  var redraw = new Event('__wf_redraw');
	  Flow.app.redrawElement = function(i, el) { el.dispatchEvent(redraw); };

	  // Flow.location - Re-route location change to trigger an event
	  Flow.location = function(url) {
	    window.dispatchEvent(new CustomEvent('__wf_location', { detail: url }));
	  };
	}

	// Flow.ready - Call primary and secondary handlers
	Flow.ready = function() {
	  domready = true;

	  // Restore modules after destroy
	  if (destroyed) {
	    restoreModules();

	  // Otherwise run primary ready methods
	  } else {
	    _.each(primary, callReady);
	  }

	  // Run secondary ready methods
	  _.each(secondary, callReady);

	  // Trigger resize
	  Flow.resize.up();
	};

	function callReady(readyFn) {
	  isFunction(readyFn) && readyFn();
	}

	function restoreModules() {
	  destroyed = false;
	  _.each(modules, bindModule);
	}

	/**
	 * Flow.load - Add a window load handler that will run even if load event has already happened
	 * @param  {function} handler
	 */
	var deferLoad;
	Flow.load = function(handler) {
	  deferLoad.then(handler);
	};

	function bindLoad() {
	  // Reject any previous deferred (to support destroy)
	  if (deferLoad) {
	    deferLoad.reject();
	    $win.off('load', deferLoad.resolve);
	  }
	  // Create deferred and bind window load event
	  deferLoad = new $.Deferred();
	  $win.on('load', deferLoad.resolve);
	}

	// Flow.destroy - Trigger a destroy event for all modules
	Flow.destroy = function(options) {
	  options = options || {};
	  destroyed = true;
	  $win.triggerHandler('__wf_destroy');

	  // Allow domready reset for tests
	  if (options.domready != null) {
	    domready = options.domready;
	  }

	  // Unbind modules
	  _.each(modules, unbindModule);

	  // Clear any proxy event handlers
	  Flow.resize.off();
	  Flow.scroll.off();
	  Flow.redraw.off();

	  // Clear any queued ready methods
	  primary = [];
	  secondary = [];

	  // If load event has not yet fired, replace the deferred
	  if (deferLoad.state() === 'pending') bindLoad();
	};

	// Listen for domready
	$(Flow.ready);

	// Listen for window.onload and resolve deferred
	bindLoad();

	// Export commonjs module
	module.exports = window.Flow = Flow;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Flow: IX Event triggers for other modules
	 */

	var $ = window.jQuery;
	var api = {};
	var eventQueue = [];
	var namespace = '.w-ix';

	var eventTriggers = {
	  reset: function(i, el) {
	    el.__wf_intro = null;
	  },
	  intro: function(i, el) {
	    if (el.__wf_intro) return;
	    el.__wf_intro = true;
	    $(el).triggerHandler(api.types.INTRO);
	  },
	  outro: function(i, el) {
	    if (!el.__wf_intro) return;
	    el.__wf_intro = null;
	    $(el).triggerHandler(api.types.OUTRO);
	  }
	};

	api.triggers = {};

	api.types = {
	  INTRO: 'w-ix-intro' + namespace,
	  OUTRO: 'w-ix-outro' + namespace
	};

	// Trigger any events in queue + restore trigger methods
	api.init = function() {
	  var count = eventQueue.length;
	  for (var i = 0; i < count; i++) {
	    var memo = eventQueue[i];
	    memo[0](0, memo[1]);
	  }
	  eventQueue = [];
	  $.extend(api.triggers, eventTriggers);
	};

	// Replace all triggers with async wrapper to queue events until init
	api.async = function() {
	  for (var key in eventTriggers) {
	    var func = eventTriggers[key];
	    if (!eventTriggers.hasOwnProperty(key)) continue;

	    // Replace trigger method with async wrapper
	    api.triggers[key] = function(i, el) {
	      eventQueue.push([func, el]);
	    };
	  }
	};

	// Default triggers to async queue
	api.async();

	module.exports = api;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*!
	 * tram.js v0.8.1-global
	 * Cross-browser CSS3 transitions in JavaScript
	 * https://github.com/bkwld/tram
	 * MIT License
	 */
	window.tram=function(a){function b(a,b){var c=new L.Bare;return c.init(a,b)}function c(a){return a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}function d(a){var b=parseInt(a.slice(1),16),c=b>>16&255,d=b>>8&255,e=255&b;return[c,d,e]}function e(a,b,c){return"#"+(1<<24|a<<16|b<<8|c).toString(16).slice(1)}function f(){}function g(a,b){_("Type warning: Expected: ["+a+"] Got: ["+typeof b+"] "+b)}function h(a,b,c){_("Units do not match ["+a+"]: "+b+", "+c)}function i(a,b,c){if(void 0!==b&&(c=b),void 0===a)return c;var d=c;return Z.test(a)||!$.test(a)?d=parseInt(a,10):$.test(a)&&(d=1e3*parseFloat(a)),0>d&&(d=0),d===d?d:c}function j(a){for(var b=-1,c=a?a.length:0,d=[];++b<c;){var e=a[b];e&&d.push(e)}return d}var k=function(a,b,c){function d(a){return"object"==typeof a}function e(a){return"function"==typeof a}function f(){}function g(h,i){function j(){var a=new k;return e(a.init)&&a.init.apply(a,arguments),a}function k(){}i===c&&(i=h,h=Object),j.Bare=k;var l,m=f[a]=h[a],n=k[a]=j[a]=new f;return n.constructor=j,j.mixin=function(b){return k[a]=j[a]=g(j,b)[a],j},j.open=function(a){if(l={},e(a)?l=a.call(j,n,m,j,h):d(a)&&(l=a),d(l))for(var c in l)b.call(l,c)&&(n[c]=l[c]);return e(n.init)||(n.init=h),j},j.open(i)}return g}("prototype",{}.hasOwnProperty),l={ease:["ease",function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(-2.75*f*e+11*e*e+-15.5*f+8*e+.25*a)}],"ease-in":["ease-in",function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(-1*f*e+3*e*e+-3*f+2*e)}],"ease-out":["ease-out",function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(.3*f*e+-1.6*e*e+2.2*f+-1.8*e+1.9*a)}],"ease-in-out":["ease-in-out",function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(2*f*e+-5*e*e+2*f+2*e)}],linear:["linear",function(a,b,c,d){return c*a/d+b}],"ease-in-quad":["cubic-bezier(0.550, 0.085, 0.680, 0.530)",function(a,b,c,d){return c*(a/=d)*a+b}],"ease-out-quad":["cubic-bezier(0.250, 0.460, 0.450, 0.940)",function(a,b,c,d){return-c*(a/=d)*(a-2)+b}],"ease-in-out-quad":["cubic-bezier(0.455, 0.030, 0.515, 0.955)",function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b}],"ease-in-cubic":["cubic-bezier(0.550, 0.055, 0.675, 0.190)",function(a,b,c,d){return c*(a/=d)*a*a+b}],"ease-out-cubic":["cubic-bezier(0.215, 0.610, 0.355, 1)",function(a,b,c,d){return c*((a=a/d-1)*a*a+1)+b}],"ease-in-out-cubic":["cubic-bezier(0.645, 0.045, 0.355, 1)",function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a+b:c/2*((a-=2)*a*a+2)+b}],"ease-in-quart":["cubic-bezier(0.895, 0.030, 0.685, 0.220)",function(a,b,c,d){return c*(a/=d)*a*a*a+b}],"ease-out-quart":["cubic-bezier(0.165, 0.840, 0.440, 1)",function(a,b,c,d){return-c*((a=a/d-1)*a*a*a-1)+b}],"ease-in-out-quart":["cubic-bezier(0.770, 0, 0.175, 1)",function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a+b:-c/2*((a-=2)*a*a*a-2)+b}],"ease-in-quint":["cubic-bezier(0.755, 0.050, 0.855, 0.060)",function(a,b,c,d){return c*(a/=d)*a*a*a*a+b}],"ease-out-quint":["cubic-bezier(0.230, 1, 0.320, 1)",function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b}],"ease-in-out-quint":["cubic-bezier(0.860, 0, 0.070, 1)",function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b}],"ease-in-sine":["cubic-bezier(0.470, 0, 0.745, 0.715)",function(a,b,c,d){return-c*Math.cos(a/d*(Math.PI/2))+c+b}],"ease-out-sine":["cubic-bezier(0.390, 0.575, 0.565, 1)",function(a,b,c,d){return c*Math.sin(a/d*(Math.PI/2))+b}],"ease-in-out-sine":["cubic-bezier(0.445, 0.050, 0.550, 0.950)",function(a,b,c,d){return-c/2*(Math.cos(Math.PI*a/d)-1)+b}],"ease-in-expo":["cubic-bezier(0.950, 0.050, 0.795, 0.035)",function(a,b,c,d){return 0===a?b:c*Math.pow(2,10*(a/d-1))+b}],"ease-out-expo":["cubic-bezier(0.190, 1, 0.220, 1)",function(a,b,c,d){return a===d?b+c:c*(-Math.pow(2,-10*a/d)+1)+b}],"ease-in-out-expo":["cubic-bezier(1, 0, 0, 1)",function(a,b,c,d){return 0===a?b:a===d?b+c:(a/=d/2)<1?c/2*Math.pow(2,10*(a-1))+b:c/2*(-Math.pow(2,-10*--a)+2)+b}],"ease-in-circ":["cubic-bezier(0.600, 0.040, 0.980, 0.335)",function(a,b,c,d){return-c*(Math.sqrt(1-(a/=d)*a)-1)+b}],"ease-out-circ":["cubic-bezier(0.075, 0.820, 0.165, 1)",function(a,b,c,d){return c*Math.sqrt(1-(a=a/d-1)*a)+b}],"ease-in-out-circ":["cubic-bezier(0.785, 0.135, 0.150, 0.860)",function(a,b,c,d){return(a/=d/2)<1?-c/2*(Math.sqrt(1-a*a)-1)+b:c/2*(Math.sqrt(1-(a-=2)*a)+1)+b}],"ease-in-back":["cubic-bezier(0.600, -0.280, 0.735, 0.045)",function(a,b,c,d,e){return void 0===e&&(e=1.70158),c*(a/=d)*a*((e+1)*a-e)+b}],"ease-out-back":["cubic-bezier(0.175, 0.885, 0.320, 1.275)",function(a,b,c,d,e){return void 0===e&&(e=1.70158),c*((a=a/d-1)*a*((e+1)*a+e)+1)+b}],"ease-in-out-back":["cubic-bezier(0.680, -0.550, 0.265, 1.550)",function(a,b,c,d,e){return void 0===e&&(e=1.70158),(a/=d/2)<1?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b}]},m={"ease-in-back":"cubic-bezier(0.600, 0, 0.735, 0.045)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.320, 1)","ease-in-out-back":"cubic-bezier(0.680, 0, 0.265, 1)"},n=document,o=window,p="bkwld-tram",q=/[\-\.0-9]/g,r=/[A-Z]/,s="number",t=/^(rgb|#)/,u=/(em|cm|mm|in|pt|pc|px)$/,v=/(em|cm|mm|in|pt|pc|px|%)$/,w=/(deg|rad|turn)$/,x="unitless",y=/(all|none) 0s ease 0s/,z=/^(width|height)$/,A=" ",B=n.createElement("a"),C=["Webkit","Moz","O","ms"],D=["-webkit-","-moz-","-o-","-ms-"],E=function(a){if(a in B.style)return{dom:a,css:a};var b,c,d="",e=a.split("-");for(b=0;b<e.length;b++)d+=e[b].charAt(0).toUpperCase()+e[b].slice(1);for(b=0;b<C.length;b++)if(c=C[b]+d,c in B.style)return{dom:c,css:D[b]+a}},F=b.support={bind:Function.prototype.bind,transform:E("transform"),transition:E("transition"),backface:E("backface-visibility"),timing:E("transition-timing-function")};if(F.transition){var G=F.timing.dom;if(B.style[G]=l["ease-in-back"][0],!B.style[G])for(var H in m)l[H][0]=m[H]}var I=b.frame=function(){var a=o.requestAnimationFrame||o.webkitRequestAnimationFrame||o.mozRequestAnimationFrame||o.oRequestAnimationFrame||o.msRequestAnimationFrame;return a&&F.bind?a.bind(o):function(a){o.setTimeout(a,16)}}(),J=b.now=function(){var a=o.performance,b=a&&(a.now||a.webkitNow||a.msNow||a.mozNow);return b&&F.bind?b.bind(a):Date.now||function(){return+new Date}}(),K=k(function(b){function d(a,b){var c=j((""+a).split(A)),d=c[0];b=b||{};var e=X[d];if(!e)return _("Unsupported property: "+d);if(!b.weak||!this.props[d]){var f=e[0],g=this.props[d];return g||(g=this.props[d]=new f.Bare),g.init(this.$el,c,e,b),g}}function e(a,b,c){if(a){var e=typeof a;if(b||(this.timer&&this.timer.destroy(),this.queue=[],this.active=!1),"number"==e&&b)return this.timer=new R({duration:a,context:this,complete:h}),void(this.active=!0);if("string"==e&&b){switch(a){case"hide":n.call(this);break;case"stop":k.call(this);break;case"redraw":o.call(this);break;default:d.call(this,a,c&&c[1])}return h.call(this)}if("function"==e)return void a.call(this,this);if("object"==e){var f=0;t.call(this,a,function(a,b){a.span>f&&(f=a.span),a.stop(),a.animate(b)},function(a){"wait"in a&&(f=i(a.wait,0))}),s.call(this),f>0&&(this.timer=new R({duration:f,context:this}),this.active=!0,b&&(this.timer.complete=h));var g=this,j=!1,l={};I(function(){t.call(g,a,function(a){a.active&&(j=!0,l[a.name]=a.nextStyle)}),j&&g.$el.css(l)})}}}function f(a){a=i(a,0),this.active?this.queue.push({options:a}):(this.timer=new R({duration:a,context:this,complete:h}),this.active=!0)}function g(a){return this.active?(this.queue.push({options:a,args:arguments}),void(this.timer.complete=h)):_("No active transition timer. Use start() or wait() before then().")}function h(){if(this.timer&&this.timer.destroy(),this.active=!1,this.queue.length){var a=this.queue.shift();e.call(this,a.options,!0,a.args)}}function k(a){this.timer&&this.timer.destroy(),this.queue=[],this.active=!1;var b;"string"==typeof a?(b={},b[a]=1):b="object"==typeof a&&null!=a?a:this.props,t.call(this,b,u),s.call(this)}function l(a){k.call(this,a),t.call(this,a,v,w)}function m(a){"string"!=typeof a&&(a="block"),this.el.style.display=a}function n(){k.call(this),this.el.style.display="none"}function o(){this.el.offsetHeight}function q(){k.call(this),a.removeData(this.el,p),this.$el=this.el=null}function s(){var a,b,c=[];this.upstream&&c.push(this.upstream);for(a in this.props)b=this.props[a],b.active&&c.push(b.string);c=c.join(","),this.style!==c&&(this.style=c,this.el.style[F.transition.dom]=c)}function t(a,b,e){var f,g,h,i,j=b!==u,k={};for(f in a)h=a[f],f in Y?(k.transform||(k.transform={}),k.transform[f]=h):(r.test(f)&&(f=c(f)),f in X?k[f]=h:(i||(i={}),i[f]=h));for(f in k){if(h=k[f],g=this.props[f],!g){if(!j)continue;g=d.call(this,f)}b.call(this,g,h)}e&&i&&e.call(this,i)}function u(a){a.stop()}function v(a,b){a.set(b)}function w(a){this.$el.css(a)}function x(a,c){b[a]=function(){return this.children?z.call(this,c,arguments):(this.el&&c.apply(this,arguments),this)}}function z(a,b){var c,d=this.children.length;for(c=0;d>c;c++)a.apply(this.children[c],b);return this}b.init=function(b){if(this.$el=a(b),this.el=this.$el[0],this.props={},this.queue=[],this.style="",this.active=!1,T.keepInherited&&!T.fallback){var c=V(this.el,"transition");c&&!y.test(c)&&(this.upstream=c)}F.backface&&T.hideBackface&&U(this.el,F.backface.css,"hidden")},x("add",d),x("start",e),x("wait",f),x("then",g),x("next",h),x("stop",k),x("set",l),x("show",m),x("hide",n),x("redraw",o),x("destroy",q)}),L=k(K,function(b){function c(b,c){var d=a.data(b,p)||a.data(b,p,new K.Bare);return d.el||d.init(b),c?d.start(c):d}b.init=function(b,d){var e=a(b);if(!e.length)return this;if(1===e.length)return c(e[0],d);var f=[];return e.each(function(a,b){f.push(c(b,d))}),this.children=f,this}}),M=k(function(a){function b(){var a=this.get();this.update("auto");var b=this.get();return this.update(a),b}function c(a,b,c){return void 0!==b&&(c=b),a in l?a:c}function d(a){var b=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(a);return(b?e(b[1],b[2],b[3]):a).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3")}var f={duration:500,ease:"ease",delay:0};a.init=function(a,b,d,e){this.$el=a,this.el=a[0];var g=b[0];d[2]&&(g=d[2]),W[g]&&(g=W[g]),this.name=g,this.type=d[1],this.duration=i(b[1],this.duration,f.duration),this.ease=c(b[2],this.ease,f.ease),this.delay=i(b[3],this.delay,f.delay),this.span=this.duration+this.delay,this.active=!1,this.nextStyle=null,this.auto=z.test(this.name),this.unit=e.unit||this.unit||T.defaultUnit,this.angle=e.angle||this.angle||T.defaultAngle,T.fallback||e.fallback?this.animate=this.fallback:(this.animate=this.transition,this.string=this.name+A+this.duration+"ms"+("ease"!=this.ease?A+l[this.ease][0]:"")+(this.delay?A+this.delay+"ms":""))},a.set=function(a){a=this.convert(a,this.type),this.update(a),this.redraw()},a.transition=function(a){this.active=!0,a=this.convert(a,this.type),this.auto&&("auto"==this.el.style[this.name]&&(this.update(this.get()),this.redraw()),"auto"==a&&(a=b.call(this))),this.nextStyle=a},a.fallback=function(a){var c=this.el.style[this.name]||this.convert(this.get(),this.type);a=this.convert(a,this.type),this.auto&&("auto"==c&&(c=this.convert(this.get(),this.type)),"auto"==a&&(a=b.call(this))),this.tween=new Q({from:c,to:a,duration:this.duration,delay:this.delay,ease:this.ease,update:this.update,context:this})},a.get=function(){return V(this.el,this.name)},a.update=function(a){U(this.el,this.name,a)},a.stop=function(){(this.active||this.nextStyle)&&(this.active=!1,this.nextStyle=null,U(this.el,this.name,this.get()));var a=this.tween;a&&a.context&&a.destroy()},a.convert=function(a,b){if("auto"==a&&this.auto)return a;var c,e="number"==typeof a,f="string"==typeof a;switch(b){case s:if(e)return a;if(f&&""===a.replace(q,""))return+a;c="number(unitless)";break;case t:if(f){if(""===a&&this.original)return this.original;if(b.test(a))return"#"==a.charAt(0)&&7==a.length?a:d(a)}c="hex or rgb string";break;case u:if(e)return a+this.unit;if(f&&b.test(a))return a;c="number(px) or string(unit)";break;case v:if(e)return a+this.unit;if(f&&b.test(a))return a;c="number(px) or string(unit or %)";break;case w:if(e)return a+this.angle;if(f&&b.test(a))return a;c="number(deg) or string(angle)";break;case x:if(e)return a;if(f&&v.test(a))return a;c="number(unitless) or string(unit or %)"}return g(c,a),a},a.redraw=function(){this.el.offsetHeight}}),N=k(M,function(a,b){a.init=function(){b.init.apply(this,arguments),this.original||(this.original=this.convert(this.get(),t))}}),O=k(M,function(a,b){a.init=function(){b.init.apply(this,arguments),this.animate=this.fallback},a.get=function(){return this.$el[this.name]()},a.update=function(a){this.$el[this.name](a)}}),P=k(M,function(a,b){function c(a,b){var c,d,e,f,g;for(c in a)f=Y[c],e=f[0],d=f[1]||c,g=this.convert(a[c],e),b.call(this,d,g,e)}a.init=function(){b.init.apply(this,arguments),this.current||(this.current={},Y.perspective&&T.perspective&&(this.current.perspective=T.perspective,U(this.el,this.name,this.style(this.current)),this.redraw()))},a.set=function(a){c.call(this,a,function(a,b){this.current[a]=b}),U(this.el,this.name,this.style(this.current)),this.redraw()},a.transition=function(a){var b=this.values(a);this.tween=new S({current:this.current,values:b,duration:this.duration,delay:this.delay,ease:this.ease});var c,d={};for(c in this.current)d[c]=c in b?b[c]:this.current[c];this.active=!0,this.nextStyle=this.style(d)},a.fallback=function(a){var b=this.values(a);this.tween=new S({current:this.current,values:b,duration:this.duration,delay:this.delay,ease:this.ease,update:this.update,context:this})},a.update=function(){U(this.el,this.name,this.style(this.current))},a.style=function(a){var b,c="";for(b in a)c+=b+"("+a[b]+") ";return c},a.values=function(a){var b,d={};return c.call(this,a,function(a,c,e){d[a]=c,void 0===this.current[a]&&(b=0,~a.indexOf("scale")&&(b=1),this.current[a]=this.convert(b,e))}),d}}),Q=k(function(b){function c(a){1===n.push(a)&&I(g)}function g(){var a,b,c,d=n.length;if(d)for(I(g),b=J(),a=d;a--;)c=n[a],c&&c.render(b)}function i(b){var c,d=a.inArray(b,n);d>=0&&(c=n.slice(d+1),n.length=d,c.length&&(n=n.concat(c)))}function j(a){return Math.round(a*o)/o}function k(a,b,c){return e(a[0]+c*(b[0]-a[0]),a[1]+c*(b[1]-a[1]),a[2]+c*(b[2]-a[2]))}var m={ease:l.ease[1],from:0,to:1};b.init=function(a){this.duration=a.duration||0,this.delay=a.delay||0;var b=a.ease||m.ease;l[b]&&(b=l[b][1]),"function"!=typeof b&&(b=m.ease),this.ease=b,this.update=a.update||f,this.complete=a.complete||f,this.context=a.context||this,this.name=a.name;var c=a.from,d=a.to;void 0===c&&(c=m.from),void 0===d&&(d=m.to),this.unit=a.unit||"","number"==typeof c&&"number"==typeof d?(this.begin=c,this.change=d-c):this.format(d,c),this.value=this.begin+this.unit,this.start=J(),a.autoplay!==!1&&this.play()},b.play=function(){this.active||(this.start||(this.start=J()),this.active=!0,c(this))},b.stop=function(){this.active&&(this.active=!1,i(this))},b.render=function(a){var b,c=a-this.start;if(this.delay){if(c<=this.delay)return;c-=this.delay}if(c<this.duration){var d=this.ease(c,0,1,this.duration);return b=this.startRGB?k(this.startRGB,this.endRGB,d):j(this.begin+d*this.change),this.value=b+this.unit,void this.update.call(this.context,this.value)}b=this.endHex||this.begin+this.change,this.value=b+this.unit,this.update.call(this.context,this.value),this.complete.call(this.context),this.destroy()},b.format=function(a,b){if(b+="",a+="","#"==a.charAt(0))return this.startRGB=d(b),this.endRGB=d(a),this.endHex=a,this.begin=0,void(this.change=1);if(!this.unit){var c=b.replace(q,""),e=a.replace(q,"");c!==e&&h("tween",b,a),this.unit=c}b=parseFloat(b),a=parseFloat(a),this.begin=this.value=b,this.change=a-b},b.destroy=function(){this.stop(),this.context=null,this.ease=this.update=this.complete=f};var n=[],o=1e3}),R=k(Q,function(a){a.init=function(a){this.duration=a.duration||0,this.complete=a.complete||f,this.context=a.context,this.play()},a.render=function(a){var b=a-this.start;b<this.duration||(this.complete.call(this.context),this.destroy())}}),S=k(Q,function(a,b){a.init=function(a){this.context=a.context,this.update=a.update,this.tweens=[],this.current=a.current;var b,c;for(b in a.values)c=a.values[b],this.current[b]!==c&&this.tweens.push(new Q({name:b,from:this.current[b],to:c,duration:a.duration,delay:a.delay,ease:a.ease,autoplay:!1}));this.play()},a.render=function(a){var b,c,d=this.tweens.length,e=!1;for(b=d;b--;)c=this.tweens[b],c.context&&(c.render(a),this.current[c.name]=c.value,e=!0);return e?void(this.update&&this.update.call(this.context)):this.destroy()},a.destroy=function(){if(b.destroy.call(this),this.tweens){var a,c=this.tweens.length;for(a=c;a--;)this.tweens[a].destroy();this.tweens=null,this.current=null}}}),T=b.config={defaultUnit:"px",defaultAngle:"deg",keepInherited:!1,hideBackface:!1,perspective:"",fallback:!F.transition,agentTests:[]};b.fallback=function(a){if(!F.transition)return T.fallback=!0;T.agentTests.push("("+a+")");var b=new RegExp(T.agentTests.join("|"),"i");T.fallback=b.test(navigator.userAgent)},b.fallback("6.0.[2-5] Safari"),b.tween=function(a){return new Q(a)},b.delay=function(a,b,c){return new R({complete:b,duration:a,context:c})},a.fn.tram=function(a){return b.call(null,this,a)};var U=a.style,V=a.css,W={transform:F.transform&&F.transform.css},X={color:[N,t],background:[N,t,"background-color"],"outline-color":[N,t],"border-color":[N,t],"border-top-color":[N,t],"border-right-color":[N,t],"border-bottom-color":[N,t],"border-left-color":[N,t],"border-width":[M,u],"border-top-width":[M,u],"border-right-width":[M,u],"border-bottom-width":[M,u],"border-left-width":[M,u],"border-spacing":[M,u],"letter-spacing":[M,u],margin:[M,u],"margin-top":[M,u],"margin-right":[M,u],"margin-bottom":[M,u],"margin-left":[M,u],padding:[M,u],"padding-top":[M,u],"padding-right":[M,u],"padding-bottom":[M,u],"padding-left":[M,u],"outline-width":[M,u],opacity:[M,s],top:[M,v],right:[M,v],bottom:[M,v],left:[M,v],"font-size":[M,v],"text-indent":[M,v],"word-spacing":[M,v],width:[M,v],"min-width":[M,v],"max-width":[M,v],height:[M,v],"min-height":[M,v],"max-height":[M,v],"line-height":[M,x],"scroll-top":[O,s,"scrollTop"],"scroll-left":[O,s,"scrollLeft"]},Y={};F.transform&&(X.transform=[P],Y={x:[v,"translateX"],y:[v,"translateY"],rotate:[w],rotateX:[w],rotateY:[w],scale:[s],scaleX:[s],scaleY:[s],skew:[w],skewX:[w],skewY:[w]}),F.transform&&F.backface&&(Y.z=[v,"translateZ"],Y.rotateZ=[w],Y.scaleZ=[s],Y.perspective=[u]);var Z=/ms/,$=/s|\./,_=function(){var a="warn",b=window.console;return b&&b[a]?function(c){b[a](c)}:f}();return a.tram=b}(window.jQuery);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {},
/* 5 */
/***/ function(module, exports, __webpack_require__) {},
/* 6 */
/***/ function(module, exports, __webpack_require__) {},
/* 7 */
/***/ function(module, exports, __webpack_require__) {},
/* 8 */
/***/ function(module, exports, __webpack_require__) {},
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * : Interactions
	 */

	var Flow = __webpack_require__(1);
	var IXEvents = __webpack_require__(2);

	Flow.define('ix', module.exports = function($, _) {
	  var api = {};
	  var designer;
	  var $win = $(window);
	  var namespace = '.w-ix';
	  var tram = $.tram;
	  var env = Flow.env;
	  var inApp = env();
	  var emptyFix = env.chrome && env.chrome < 35;
	  var transNone = 'none 0s ease 0s';
	  var fallbackProps = /width|height/;
	  var $subs = $();
	  var config = {};
	  var anchors = [];
	  var loads = [];
	  var readys = [];
	  var destroyed;
	  var readyDelay = 1;

	  // Component types and proxy selectors
	  var components = {
	    tabs: '.w-tab-link, .w-tab-pane',
	    dropdown: '.w-dropdown',
	    slider: '.w-slide',
	    navbar: '.w-nav'
	  };

	  // -----------------------------------
	  // Module methods

	  api.init = function(list) {
	    setTimeout(function() { configure(list); }, 1);
	  };

	  api.preview = function() {
	    designer = false;
	    readyDelay = 100;
	    setTimeout(function() { configure(window.__wf_ix); }, 1);
	  };

	  api.design = function() {
	    designer = true;
	    api.destroy();
	  };

	  api.destroy = function() {
	    destroyed = true;
	    $subs.each(teardown);
	    Flow.scroll.off(scroll);
	    IXEvents.async();
	    anchors = [];
	    loads = [];
	    readys = [];
	  };

	  api.ready = function() {
	    // Ready should only be used after destroy, as a way to re-init
	    if (config && destroyed) {
	      destroyed = false;
	      init();
	    }
	  };

	  api.run = run;
	  api.style = inApp ? styleApp : stylePub;

	  // -----------------------------------
	  // Private methods

	  function configure(list) {
	    if (!list) return;

	    // Map all interactions by slug
	    config = {};
	    _.each(list, function(item) {
	      config[item.slug] = item.value;
	    });

	    // Init ix after config
	    init();
	  }

	  function init() {
	    // Build each element's interaction keying from data attribute
	    var els = $('[data-ix]');
	    if (!els.length) return;
	    els.each(teardown);
	    els.each(build);

	    // Listen for scroll events if any anchors exist
	    if (anchors.length) {
	      Flow.scroll.on(scroll);
	      setTimeout(scroll, 1);
	    }

	    // Handle loads or readys if they exist
	    if (loads.length) Flow.load(runLoads);
	    if (readys.length) setTimeout(runReadys, readyDelay);

	    // Trigger queued events, must happen after init
	    IXEvents.init();

	    // Trigger a redraw to ensure all IX intros play
	    Flow.redraw.up();
	  }

	  function build(i, el) {
	    var $el = $(el);
	    var id = $el.attr('data-ix');
	    var ix = config[id];
	    if (!ix) return;
	    var triggers = ix.triggers;
	    if (!triggers) return;

	    // Set styles immediately to provide tram with starting transform values
	    api.style($el, ix.style);

	    _.each(triggers, function(trigger) {
	      var state = {};
	      var type = trigger.type;
	      var stepsB = trigger.stepsB && trigger.stepsB.length;

	      function runA() { run(trigger, $el, { group: 'A' }); }
	      function runB() { run(trigger, $el, { group: 'B' }); }

	      if (type === 'load') {
	        (trigger.preload && !inApp) ? loads.push(runA) : readys.push(runA);
	        return;
	      }

	      if (type === 'click') {
	        $el.on('click' + namespace, function(evt) {
	          // Avoid late clicks on touch devices
	          if (!Flow.validClick(evt.currentTarget)) return;

	          // Prevent default on empty hash urls
	          if ($el.attr('href') === '#') evt.preventDefault();

	          run(trigger, $el, { group: state.clicked ? 'B' : 'A' });
	          if (stepsB) state.clicked = !state.clicked;
	        });
	        $subs = $subs.add($el);
	        return;
	      }

	      if (type === 'hover') {
	        $el.on('mouseenter' + namespace, runA);
	        $el.on('mouseleave' + namespace, runB);
	        $subs = $subs.add($el);
	        return;
	      }

	      if (type === 'scroll') {
	        anchors.push({
	          el: $el, trigger: trigger, state: { active: false },
	          offsetTop: convert(trigger.offsetTop),
	          offsetBot: convert(trigger.offsetBot)
	        });
	        return;
	      }

	      // Check for a proxy component selector
	      // type == [tabs, dropdown, slider, navbar]
	      var proxy = components[type];
	      if (proxy) {
	        var $proxy = $el.closest(proxy);
	        $proxy.on(IXEvents.types.INTRO, runA).on(IXEvents.types.OUTRO, runB);
	        $subs = $subs.add($proxy);
	        return;
	      }
	    });
	  }

	  function convert(offset) {
	    if (!offset) return 0;
	    offset = offset + '';
	    var result = parseInt(offset, 10);
	    if (result !== result) return 0;
	    if (offset.indexOf('%') > 0) {
	      result = result / 100;
	      if (result >= 1) result = 0.999;
	    }
	    return result;
	  }

	  function teardown(i, el) {
	    $(el).off(namespace);
	  }

	  function scroll() {
	    var viewTop = $win.scrollTop();
	    var viewHeight = $win.height();

	    // Check each anchor for a valid scroll trigger
	    var count = anchors.length;
	    for (var i = 0; i < count; i++) {
	      var anchor = anchors[i];
	      var $el = anchor.el;
	      var trigger = anchor.trigger;
	      var stepsB = trigger.stepsB && trigger.stepsB.length;
	      var state = anchor.state;
	      var top = $el.offset().top;
	      var height = $el.outerHeight();
	      var offsetTop = anchor.offsetTop;
	      var offsetBot = anchor.offsetBot;
	      if (offsetTop < 1 && offsetTop > 0) offsetTop *= viewHeight;
	      if (offsetBot < 1 && offsetBot > 0) offsetBot *= viewHeight;
	      var active = (top + height - offsetTop >= viewTop && top + offsetBot <= viewTop + viewHeight);
	      if (active === state.active) continue;
	      if (active === false && !stepsB) continue;
	      state.active = active;
	      run(trigger, $el, { group: active ? 'A' : 'B' });
	    }
	  }

	  function runLoads() {
	    var count = loads.length;
	    for (var i = 0; i < count; i++) {
	      loads[i]();
	    }
	  }

	  function runReadys() {
	    var count = readys.length;
	    for (var i = 0; i < count; i++) {
	      readys[i]();
	    }
	  }

	  function run(trigger, $el, opts, replay) {
	    opts = opts || {};
	    var done = opts.done;

	    // Do not run in designer unless forced
	    if (designer && !opts.force) return;

	    // Operate on a set of grouped steps
	    var group = opts.group || 'A';
	    var loop = trigger['loop' + group];
	    var steps = trigger['steps' + group];
	    if (!steps || !steps.length) return;
	    if (steps.length < 2) loop = false;

	    // One-time init before any loops
	    if (!replay) {

	      // Find selector within element descendants, siblings, or query whole document
	      var selector = trigger.selector;
	      if (selector) {
	        $el = (
	          trigger.descend ? $el.find(selector) :
	          trigger.siblings ? $el.siblings(selector) :
	          $(selector)
	        );
	        if (inApp) $el.attr('data-ix-affect', 1);
	      }

	      // Apply empty fix for certain Chrome versions
	      if (emptyFix) $el.addClass('w-ix-emptyfix');
	    }

	    var _tram = tram($el);

	    // Add steps
	    var meta = {};
	    for (var i = 0; i < steps.length; i++) {
	      addStep(_tram, steps[i], meta);
	    }

	    function fin() {
	      // Run trigger again if looped
	      if (loop) return run(trigger, $el, opts, true);

	      // Reset any 'auto' values
	      if (meta.width === 'auto') _tram.set({ width: 'auto' });
	      if (meta.height === 'auto') _tram.set({ height: 'auto' });

	      // Run callback
	      done && done();
	    }

	    // Add final step to queue if tram has started
	    meta.start ? _tram.then(fin) : fin();
	  }

	  function addStep(_tram, step, meta) {
	    var addMethod = 'add';
	    var startMethod = 'start';

	    // Once the transition has started, we will always use then() to add to the queue.
	    if (meta.start) addMethod = startMethod = 'then';

	    // Parse transitions string on the current step
	    var transitions = step.transition;
	    if (transitions) {
	      transitions = transitions.split(',');
	      for (var i = 0; i < transitions.length; i++) {
	        var transition = transitions[i];
	        var options = fallbackProps.test(transition) ? { fallback: true } : null;
	        _tram[addMethod](transition, options);
	      }
	    }

	    // Build a clean object to pass to the tram method
	    var clean = tramify(step) || {};

	    // Store last width and height values
	    if (clean.width != null) meta.width = clean.width;
	    if (clean.height != null) meta.height = clean.height;

	    // When transitions are not present, set values immediately and continue queue.
	    if (transitions == null) {

	      // If we have started, wrap set() in then() and reset queue
	      if (meta.start) {
	        _tram.then(function() {
	          var queue = this.queue;
	          this.set(clean);
	          if (clean.display) {
	            _tram.redraw();
	            Flow.redraw.up();
	          }
	          this.queue = queue;
	          this.next();
	        });
	      } else {
	        _tram.set(clean);

	        // Always redraw after setting display
	        if (clean.display) {
	          _tram.redraw();
	          Flow.redraw.up();
	        }
	      }

	      // Use the wait() method to kick off queue in absence of transitions.
	      var wait = clean.wait;
	      if (wait != null) {
	        _tram.wait(wait);
	        meta.start = true;
	      }

	    // Otherwise, when transitions are present
	    } else {

	      // If display is present, handle it separately
	      if (clean.display) {
	        var display = clean.display;
	        delete clean.display;

	        // If we've already started, we need to wrap it in a then()
	        if (meta.start) {
	          _tram.then(function() {
	            var queue = this.queue;
	            this.set({ display: display }).redraw();
	            Flow.redraw.up();
	            this.queue = queue;
	            this.next();
	          });
	        } else {
	          _tram.set({ display: display }).redraw();
	          Flow.redraw.up();
	        }
	      }

	      // Otherwise, start a transition using the current start method.
	      _tram[startMethod](clean);
	      meta.start = true;
	    }
	  }

	  // (In app) Set styles immediately and manage upstream transition
	  function styleApp(el, data) {
	    var _tram = tram(el);

	    // Get computed transition value
	    el.css('transition', '');
	    var computed = el.css('transition');

	    // If computed is set to none, clear upstream
	    if (computed === transNone) computed = _tram.upstream = null;

	    // Set upstream transition to none temporarily
	    _tram.upstream = transNone;

	    // Set values immediately
	    _tram.set(tramify(data));

	    // Only restore upstream in preview mode
	    _tram.upstream = computed;
	  }

	  // (Published) Set styles immediately on specified jquery element
	  function stylePub(el, data) {
	    tram(el).set(tramify(data));
	  }

	  // Build a clean object for tram
	  function tramify(obj) {
	    var result = {};
	    var found = false;
	    for (var x in obj) {
	      if (x === 'transition') continue;
	      result[x] = obj[x];
	      found = true;
	    }
	    // If empty, return null for tram.set/stop compliance
	    return found ? result : null;
	  }

	  // Export module
	  return api;
	});
/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/*eslint
	  no-use-before-define: 0,
	  no-shadow: 0
	*/

	/**
	 * : Lightbox component
	 */

	var Flow = __webpack_require__(1);

	function createLightbox(window, document, $) {
	  var tram = $.tram;
	  var isArray = Array.isArray;
	  var namespace = 'w-lightbox';
	  var prefix = namespace + '-';
	  var prefixRegex = /(^|\s+)/g;

	  // Array of objects describing items to be displayed.
	  var items = [];

	  // Index of the currently displayed item.
	  var currentIndex;

	  // Object holding references to jQuery wrapped nodes.
	  var $refs;

	  // Instance of Spinner
	  var spinner;

	  function lightbox(thing, index) {
	    items = isArray(thing) ? thing : [thing];

	    if (!$refs) {
	      lightbox.build();
	    }

	    if (items.length > 1) {
	      $refs.items = $refs.empty;

	      items.forEach(function (item) {
	        var $thumbnail = dom('thumbnail');
	        var $item = dom('item').append($thumbnail);

	        $refs.items = $refs.items.add($item);

	        loadImage(item.thumbnailUrl || item.url, function ($image) {
	          if ($image.prop('width') > $image.prop('height')) {
	            addClass($image, 'wide');
	          } else {
	            addClass($image, 'tall');
	          }
	          $thumbnail.append(addClass($image, 'thumbnail-image'));
	        });
	      });

	      $refs.strip.empty().append($refs.items);
	      addClass($refs.content, 'group');
	    }

	    tram(
	      // Focus the lightbox to receive keyboard events.
	      removeClass($refs.lightbox, 'hide').focus()
	    )
	      .add('opacity .3s')
	      .start({opacity: 1});

	    // Prevent document from scrolling while lightbox is active.
	    addClass($refs.html, 'noscroll');

	    return lightbox.show(index || 0);
	  }

	  /**
	   * Creates the DOM structure required by the lightbox.
	   */
	  lightbox.build = function () {
	    // In case `build` is called more than once.
	    lightbox.destroy();

	    $refs = {
	      html: $(document.documentElement),
	      // Empty jQuery object can be used to build new ones using `.add`.
	      empty: $()
	    };

	    $refs.arrowLeft = dom('control left inactive');
	    $refs.arrowRight = dom('control right inactive');
	    $refs.close = dom('control close');

	    $refs.spinner = dom('spinner');
	    $refs.strip = dom('strip');

	    spinner = new Spinner($refs.spinner, prefixed('hide'));

	    $refs.content = dom('content')
	      .append($refs.spinner, $refs.arrowLeft, $refs.arrowRight, $refs.close);

	    $refs.container = dom('container')
	      .append($refs.content, $refs.strip);

	    $refs.lightbox = dom('backdrop hide')
	      .append($refs.container);

	    // We are delegating events for performance reasons and also
	    // to not have to reattach handlers when images change.
	    $refs.strip.on('tap', selector('item'), itemTapHandler);
	    $refs.content
	      .on('swipe', swipeHandler)
	      .on('tap', selector('left'), handlerPrev)
	      .on('tap', selector('right'), handlerNext)
	      .on('tap', selector('close'), handlerHide)
	      .on('tap', selector('image, caption'), handlerNext);
	    $refs.container
	      .on('tap', selector('view, strip'), handlerHide)
	      // Prevent images from being dragged around.
	      .on('dragstart', selector('img'), preventDefault);
	    $refs.lightbox
	      .on('keydown', keyHandler)
	      // IE loses focus to inner nodes without letting us know.
	      .on('focusin', focusThis);

	    // The `tabindex` attribute is needed to enable non-input elements
	    // to receive keyboard events.
	    $('body').append($refs.lightbox.prop('tabIndex', 0));

	    return lightbox;
	  };

	  /**
	   * Dispose of DOM nodes created by the lightbox.
	   */
	  lightbox.destroy = function () {
	    if (!$refs) {
	      return;
	    }

	    // Event handlers are also removed.
	    removeClass($refs.html, 'noscroll');
	    $refs.lightbox.remove();
	    $refs = undefined;
	  };

	  /**
	   * Show a specific item.
	   */
	  lightbox.show = function (index) {
	    // Bail if we are already showing this item.
	    if (index === currentIndex) {
	      return;
	    }

	    var item = items[index];
	    if (!item) { return lightbox.hide(); }

	    var previousIndex = currentIndex;
	    currentIndex = index;
	    spinner.show();

	    // For videos, load an empty SVG with the video dimensions to preserve
	    // the video’s aspect ratio while being responsive.
	    var url = item.html && svgDataUri(item.width, item.height) || item.url;
	    loadImage(url, function ($image) {
	      // Make sure this is the last item requested to be shown since
	      // images can finish loading in a different order than they were
	      // requested in.
	      if (index !== currentIndex) {
	        return;
	      }

	      var $figure = dom('figure', 'figure').append(addClass($image, 'image'));
	      var $frame = dom('frame').append($figure);
	      var $newView = dom('view').append($frame);
	      var $html, isIframe;

	      if (item.html) {
	        $html = $(item.html);
	        isIframe = $html.is('iframe');

	        if (isIframe) {
	          $html.on('load', transitionToNewView);
	        }

	        $figure.append(addClass($html, 'embed'));
	      }

	      if (item.caption) {
	        $figure.append(dom('caption', 'figcaption').text(item.caption));
	      }

	      $refs.spinner.before($newView);

	      if (!isIframe) {
	        transitionToNewView();
	      }

	      function transitionToNewView() {
	        spinner.hide();

	        if (index !== currentIndex) {
	          $newView.remove();
	          return;
	        }


	        toggleClass($refs.arrowLeft, 'inactive', index <= 0);
	        toggleClass($refs.arrowRight, 'inactive', index >= items.length - 1);

	        if ($refs.view) {
	          tram($refs.view)
	            .add('opacity .3s')
	            .start({opacity: 0})
	            .then(remover($refs.view));

	          tram($newView)
	            .add('opacity .3s')
	            .add('transform .3s')
	            .set({x: index > previousIndex ? '80px' : '-80px'})
	            .start({opacity: 1, x: 0});
	        } else {
	          $newView.css('opacity', 1);
	        }

	        $refs.view = $newView;

	        if ($refs.items) {
	          // Mark proper thumbnail as active
	          addClass(removeClass($refs.items, 'active').eq(index), 'active');
	        }
	      }
	    });

	    return lightbox;
	  };

	  /**
	   * Hides the lightbox.
	   */
	  lightbox.hide = function () {
	    tram($refs.lightbox)
	      .add('opacity .3s')
	      .start({opacity: 0})
	      .then(hideLightbox);

	    return lightbox;
	  };

	  lightbox.prev = function () {
	    if (currentIndex > 0) {
	      lightbox.show(currentIndex - 1);
	    }
	  };

	  lightbox.next = function () {
	    if (currentIndex < items.length - 1) {
	      lightbox.show(currentIndex + 1);
	    }
	  };

	  function createHandler(action) {
	    return function (event) {
	      // We only care about events triggered directly on the bound selectors.
	      if (this !== event.target) {
	        return;
	      }

	      event.stopPropagation();
	      event.preventDefault();

	      action();
	    };
	  }

	  var handlerPrev = createHandler(lightbox.prev);
	  var handlerNext = createHandler(lightbox.next);
	  var handlerHide = createHandler(lightbox.hide);

	  var itemTapHandler = function(event) {
	    var index = $(this).index();

	    event.preventDefault();
	    lightbox.show(index);
	  };

	  var swipeHandler = function (event, data) {
	    // Prevent scrolling.
	    event.preventDefault();

	    if (data.direction === 'left') {
	      lightbox.next();
	    } else if (data.direction === 'right') {
	      lightbox.prev();
	    }
	  };

	  var focusThis = function () {
	    this.focus();
	  };

	  function preventDefault(event) {
	    event.preventDefault();
	  }

	  function keyHandler(event) {
	    var keyCode = event.keyCode;

	    // [esc]
	    if (keyCode === 27) {
	      lightbox.hide();
	    }

	    // [◀]
	    else if (keyCode === 37) {
	      lightbox.prev();
	    }

	    // [▶]
	    else if (keyCode === 39) {
	      lightbox.next();
	    }
	  }

	  function hideLightbox() {
	    // If the lightbox hasn't been destroyed already
	    if ($refs) {
	      removeClass($refs.html, 'noscroll');
	      addClass($refs.lightbox, 'hide');
	      $refs.strip.empty();
	      $refs.view && $refs.view.remove();

	      // Reset some stuff
	      removeClass($refs.content, 'group');
	      addClass($refs.arrowLeft, 'inactive');
	      addClass($refs.arrowRight, 'inactive');

	      currentIndex = $refs.view = undefined;
	    }
	  }

	  function loadImage(url, callback) {
	    var $image = dom('img', 'img');

	    $image.one('load', function () {
	      callback($image);
	    });

	    // Start loading image.
	    $image.attr('src', url);

	    return $image;
	  }

	  function remover($element) {
	    return function () {
	      $element.remove();
	    };
	  }

	  /**
	   * Spinner
	   */
	  function Spinner($spinner, className, delay) {
	    this.$element = $spinner;
	    this.className = className;
	    this.delay = delay || 200;
	    this.hide();
	  }

	  Spinner.prototype.show = function () {
	    var spinner = this;

	    // Bail if we are already showing the spinner.
	    if (spinner.timeoutId) {
	      return;
	    }

	    spinner.timeoutId = setTimeout(function () {
	      spinner.$element.removeClass(spinner.className);
	      delete spinner.timeoutId;
	    }, spinner.delay);
	  };

	  Spinner.prototype.hide = function () {
	    var spinner = this;
	    if (spinner.timeoutId) {
	      clearTimeout(spinner.timeoutId);
	      delete spinner.timeoutId;
	      return;
	    }

	    spinner.$element.addClass(spinner.className);
	  };

	  function prefixed(string, isSelector) {
	    return string.replace(prefixRegex, (isSelector ? ' .' : ' ') + prefix);
	  }

	  function selector(string) {
	    return prefixed(string, true);
	  }

	  /**
	   * jQuery.addClass with auto-prefixing
	   * @param  {jQuery} Element to add class to
	   * @param  {string} Class name that will be prefixed and added to element
	   * @return {jQuery}
	   */
	  function addClass($element, className) {
	    return $element.addClass(prefixed(className));
	  }

	  /**
	   * jQuery.removeClass with auto-prefixing
	   * @param  {jQuery} Element to remove class from
	   * @param  {string} Class name that will be prefixed and removed from element
	   * @return {jQuery}
	   */
	  function removeClass($element, className) {
	    return $element.removeClass(prefixed(className));
	  }

	  /**
	   * jQuery.toggleClass with auto-prefixing
	   * @param  {jQuery}  Element where class will be toggled
	   * @param  {string}  Class name that will be prefixed and toggled
	   * @param  {boolean} Optional boolean that determines if class will be added or removed
	   * @return {jQuery}
	   */
	  function toggleClass($element, className, shouldAdd) {
	    return $element.toggleClass(prefixed(className), shouldAdd);
	  }

	  /**
	   * Create a new DOM element wrapped in a jQuery object,
	   * decorated with our custom methods.
	   * @param  {string} className
	   * @param  {string} [tag]
	   * @return {jQuery}
	   */
	  function dom(className, tag) {
	    return addClass($(document.createElement(tag || 'div')), className);
	  }

	  function isObject(value) {
	    return typeof value === 'object' && value != null && !isArray(value);
	  }

	  function svgDataUri(width, height) {
	    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"/>';
	    return 'data:image/svg+xml;charset=utf-8,' + encodeURI(svg);
	  }

	  // Compute some dimensions manually for iOS, because of buggy support for VH.
	  // Also, Android built-in browser does not support viewport units.
	  (function () {
	    var ua = window.navigator.userAgent;
	    var iOS = /(iPhone|iPod|iPad).+AppleWebKit/i.test(ua);
	    var android = ua.indexOf('Android ') > -1 && ua.indexOf('Chrome') === -1;

	    if (!iOS && !android) {
	      return;
	    }

	    var styleNode = document.createElement('style');
	    document.head.appendChild(styleNode);
	    window.addEventListener('orientationchange', refresh, true);

	    function refresh() {
	      var vh = window.innerHeight;
	      var vw = window.innerWidth;
	      var content =
	        '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' +
	          'height:' + vh + 'px' +
	        '}' +
	        '.w-lightbox-view {' +
	          'width:' + vw + 'px' +
	        '}' +
	        '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' +
	          'height:' + (0.86 * vh) + 'px' +
	        '}' +
	        '.w-lightbox-image {' +
	          'max-width:' + vw + 'px;' +
	          'max-height:' + vh + 'px' +
	        '}' +
	        '.w-lightbox-group .w-lightbox-image {' +
	          'max-height:' + (0.86 * vh) + 'px' +
	        '}' +
	        '.w-lightbox-strip {' +
	          'padding: 0 ' + (0.01 * vh) + 'px' +
	        '}' +
	        '.w-lightbox-item {' +
	          'width:' + (0.1 * vh) + 'px;' +
	          'padding:' + (0.02 * vh) + 'px ' + (0.01 * vh) + 'px' +
	        '}' +
	        '.w-lightbox-thumbnail {' +
	          'height:' + (0.1 * vh) + 'px' +
	        '}' +
	        '@media (min-width: 768px) {' +
	          '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' +
	            'height:' + (0.96 * vh) + 'px' +
	          '}' +
	          '.w-lightbox-content {' +
	            'margin-top:' + (0.02 * vh) + 'px' +
	          '}' +
	          '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' +
	            'height:' + (0.84 * vh) + 'px' +
	          '}' +
	          '.w-lightbox-image {' +
	            'max-width:' + (0.96 * vw) + 'px;' +
	            'max-height:' + (0.96 * vh) + 'px' +
	          '}' +
	          '.w-lightbox-group .w-lightbox-image {' +
	            'max-width:' + (0.823 * vw) + 'px;' +
	            'max-height:' + (0.84 * vh) + 'px' +
	          '}' +
	        '}';

	      styleNode.textContent = content;
	    }

	    refresh();
	  })();

	  return lightbox;
	}

	Flow.define('lightbox', module.exports = function($, _) {
	  var api = {};
	  var lightbox = createLightbox(window, document, $);
	  var $doc = $(document);
	  var $body;
	  var $lightboxes;
	  var designer;
	  var inApp = Flow.env();
	  var namespace = '.w-lightbox';
	  var groups;

	  // -----------------------------------
	  // Module methods

	  api.ready = api.design = api.preview = init;

	  // -----------------------------------
	  // Private methods

	  function init() {
	    designer = inApp && Flow.env('design');
	    $body = $(document.body);

	    // Reset Lightbox
	    lightbox.destroy();

	    // Reset groups
	    groups = {};

	    // Find all instances on the page
	    $lightboxes = $doc.find(namespace);

	    // Instantiate all lighboxes
	    $lightboxes.flowLightBox();
	  }

	  jQuery.fn.extend({
	    flowLightBox: function() {
	      var $el = this;
	      $.each($el, function(i, el) {
	        // Store state in data
	        var data = $.data(el, namespace);
	        if (!data) {
	          data = $.data(el, namespace, {
	            el: $(el),
	            mode: 'images',
	            images: [],
	            embed: ''
	          });
	        }

	        // Remove old events
	        data.el.off(namespace);

	        // Set config from json script tag
	        configure(data);

	        // Add events based on mode
	        if (designer) {
	          data.el.on('setting' + namespace, configure.bind(null, data));
	        } else {
	          data.el
	            .on('tap' + namespace, tapHandler(data))
	            // Prevent page scrolling to top when clicking on lightbox triggers.
	            .on('click' + namespace, function (e) { e.preventDefault(); });
	        }
	      });
	    }
	  });

	  function configure(data) {
	    var json = data.el.children('.w-json').html();
	    var groupName, groupItems;

	    if (!json) {
	      data.items = [];
	      return;
	    }

	    try {
	      json = JSON.parse(json);
	    } catch(e) {
	      console.error('Malformed lightbox JSON configuration.', e);
	    }

	    supportOldLightboxJson(json);

	    groupName = json.group;

	    if (groupName) {
	      groupItems = groups[groupName];
	      if (!groupItems) {
	        groupItems = groups[groupName] = [];
	      }

	      data.items = groupItems;

	      if (json.items.length) {
	        data.index = groupItems.length;
	        groupItems.push.apply(groupItems, json.items);
	      }
	    } else {
	      data.items = json.items;
	    }
	  }

	  function tapHandler(data) {
	    return function () {
	      data.items.length && lightbox(data.items, data.index || 0);
	    };
	  }

	  function supportOldLightboxJson(data) {
	    if (data.images) {
	      data.images.forEach(function (item) {
	        item.type = 'image';
	      });
	      data.items = data.images;
	    }

	    if (data.embed) {
	      data.embed.type = 'video';
	      data.items = [data.embed];
	    }

	    if (data.groupId) {
	      data.group = data.groupId;
	    }
	  }

	  // Export module
	  return api;
	});
/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * : Auto-select links to current page or section
	 */

	var Flow = __webpack_require__(1);

	Flow.define('links', module.exports = function($, _) {
	  var api = {};
	  var $win = $(window);
	  var designer;
	  var inApp = Flow.env();
	  var location = window.location;
	  var tempLink = document.createElement('a');
	  var linkCurrent = 'w--current';
	  var validHash = /^#[a-zA-Z][\w:.-]*$/;
	  var indexPage = /index\.(html|php)$/;
	  var dirList = /\/$/;
	  var anchors;
	  var slug;

	  // -----------------------------------
	  // Module methods

	  api.ready = api.design = api.preview = init;

	  // -----------------------------------
	  // Private methods

	  function init() {
	    designer = inApp && Flow.env('design');
	    slug = Flow.env('slug') || location.pathname || '';

	    // Reset scroll listener, init anchors
	    Flow.scroll.off(scroll);
	    anchors = [];

	    // Test all links for a selectable href
	    var links = document.links;
	    for (var i = 0; i < links.length; ++i) {
	      select(links[i]);
	    }

	    // Listen for scroll if any anchors exist
	    if (anchors.length) {
	      Flow.scroll.on(scroll);
	      scroll();
	    }
	  }

	  function select(link) {
	    var href = (designer && link.getAttribute('href-disabled')) || link.getAttribute('href');
	    tempLink.href = href;

	    // Ignore any hrefs with a colon to safely avoid all uri schemes
	    if (href.indexOf(':') >= 0) return;

	    var $link = $(link);

	    // Check for valid hash links w/ sections and use scroll anchor
	    if (href.indexOf('#') === 0 && validHash.test(href)) {
	      var $section = $(href);
	      $section.length && anchors.push({ link: $link, sec: $section, active: false });
	      return;
	    }

	    // Ignore empty # links
	    if (href === '#') return;

	    // Determine whether the link should be selected
	    var match = (tempLink.href === location.href) || (href === slug) || (indexPage.test(href) && dirList.test(slug));
	    setClass($link, linkCurrent, match);
	  }

	  function scroll() {
	    var viewTop = $win.scrollTop();
	    var viewHeight = $win.height();

	    // Check each anchor for a section in view
	    _.each(anchors, function(anchor) {
	      var $link = anchor.link;
	      var $section = anchor.sec;
	      var top = $section.offset().top;
	      var height = $section.outerHeight();
	      var offset = viewHeight * 0.5;
	      var active = ($section.is(':visible') &&
	        top + height - offset >= viewTop &&
	        top + offset <= viewTop + viewHeight);
	      if (anchor.active === active) return;
	      anchor.active = active;
	      setClass($link, linkCurrent, active);
	      if (designer) $link[0].__wf_current = active;
	    });
	  }

	  function setClass($elem, className, add) {
	    var exists = $elem.hasClass(className);
	    if (add && exists) return;
	    if (!add && !exists) return;
	    add ? $elem.addClass(className) : $elem.removeClass(className);
	  }

	  // Export module
	  return api;
	});
/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {},
/* 13 */
/***/ function(module, exports, __webpack_require__) {},
/* 14 */
/***/ function(module, exports, __webpack_require__) {},
/* 15 */
/***/ function(module, exports, __webpack_require__) {},
/* 16 */
/***/ function(module, exports, __webpack_require__) {},
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * : Touch events
	 */

	var Flow = __webpack_require__(1);

	Flow.define('touch', module.exports = function($, _) {
	  var api = {};
	  var fallback = !document.addEventListener;
	  var getSelection = window.getSelection;

	  // Fallback to click events in old IE
	  if (fallback) {
	    $.event.special.tap = { bindType: 'click', delegateType: 'click' };
	  }

	  api.init = function(el) {
	    if (fallback) return null;
	    el = typeof el === 'string' ? $(el).get(0) : el;
	    return el ? new Touch(el) : null;
	  };

	  function Touch(el) {
	    var active = false;
	    var dirty = false;
	    var useTouch = false;
	    var thresholdX = Math.min(Math.round(window.innerWidth * 0.04), 40);
	    var startX, startY, lastX;

	    el.addEventListener('touchstart', start, false);
	    el.addEventListener('touchmove', move, false);
	    el.addEventListener('touchend', end, false);
	    el.addEventListener('touchcancel', cancel, false);
	    el.addEventListener('mousedown', start, false);
	    el.addEventListener('mousemove', move, false);
	    el.addEventListener('mouseup', end, false);
	    el.addEventListener('mouseout', cancel, false);

	    function start(evt) {
	      // We don’t handle multi-touch events yet.
	      var touches = evt.touches;
	      if (touches && touches.length > 1) {
	        return;
	      }

	      active = true;
	      dirty = false;

	      if (touches) {
	        useTouch = true;
	        startX = touches[0].clientX;
	        startY = touches[0].clientY;
	      } else {
	        startX = evt.clientX;
	        startY = evt.clientY;
	      }

	      lastX = startX;
	    }

	    function move(evt) {
	      if (!active) return;

	      if (useTouch && evt.type === 'mousemove') {
	        evt.preventDefault();
	        evt.stopPropagation();
	        return;
	      }

	      var touches = evt.touches;
	      var x = touches ? touches[0].clientX : evt.clientX;
	      var y = touches ? touches[0].clientY : evt.clientY;

	      var velocityX = x - lastX;
	      lastX = x;

	      // Allow swipes while pointer is down, but prevent them during text selection
	      if (Math.abs(velocityX) > thresholdX && getSelection && getSelection() + '' === '') {
	        triggerEvent('swipe', evt, { direction: velocityX > 0 ? 'right' : 'left' });
	        cancel();
	      }

	      // If pointer moves more than 10px flag to cancel tap
	      if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) {
	        dirty = true;
	      }
	    }

	    function end(evt) {
	      if (!active) return;
	      active = false;

	      if (useTouch && evt.type === 'mouseup') {
	        evt.preventDefault();
	        evt.stopPropagation();
	        useTouch = false;
	        return;
	      }

	      if (!dirty) triggerEvent('tap', evt);
	    }

	    function cancel(evt) {
	      active = false;
	    }

	    function destroy() {
	      el.removeEventListener('touchstart', start, false);
	      el.removeEventListener('touchmove', move, false);
	      el.removeEventListener('touchend', end, false);
	      el.removeEventListener('touchcancel', cancel, false);
	      el.removeEventListener('mousedown', start, false);
	      el.removeEventListener('mousemove', move, false);
	      el.removeEventListener('mouseup', end, false);
	      el.removeEventListener('mouseout', cancel, false);
	      el = null;
	    }

	    // Public instance methods
	    this.destroy = destroy;
	  }

	  // Wrap native event to supoprt preventdefault + stopPropagation
	  function triggerEvent(type, evt, data) {
	    var newEvent = $.Event(type, { originalEvent: evt });
	    $(evt.target).trigger(newEvent, data);
	  }

	  // Listen for touch events on all nodes by default.
	  api.instance = api.init(document);

	  // Export module
	  return api;
	});
/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*jshint -W054 */

	// Include tram for frame-throttling
	var $ = window.$;
	var tram = __webpack_require__(3) && $.tram;

	/*!
	 * Flow._ (aka) Underscore.js 1.6.0 (custom build)
	 * _.each
	 * _.map
	 * _.find
	 * _.filter
	 * _.any
	 * _.contains
	 * _.delay
	 * _.defer
	 * _.throttle (flow)
	 * _.debounce
	 * _.keys
	 * _.has
	 * _.now
	 *
	 * http://underscorejs.org
	 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Underscore may be freely distributed under the MIT license.
	 * @license MIT
	 */
	module.exports = (function() {
	  var _ = {};

	  // Current version.
	  _.VERSION = '1.6.0-Flow';

	  // Establish the object that gets returned to break out of a loop iteration.
	  var breaker = {};

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    concat           = ArrayProto.concat,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeForEach      = ArrayProto.forEach,
	    nativeMap          = ArrayProto.map,
	    nativeReduce       = ArrayProto.reduce,
	    nativeReduceRight  = ArrayProto.reduceRight,
	    nativeFilter       = ArrayProto.filter,
	    nativeEvery        = ArrayProto.every,
	    nativeSome         = ArrayProto.some,
	    nativeIndexOf      = ArrayProto.indexOf,
	    nativeLastIndexOf  = ArrayProto.lastIndexOf,
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles objects with the built-in `forEach`, arrays, and raw objects.
	  // Delegates to **ECMAScript 5**'s native `forEach` if available.
	  var each = _.each = _.forEach = function(obj, iterator, context) {
	    /* jshint shadow:true */
	    if (obj == null) return obj;
	    if (nativeForEach && obj.forEach === nativeForEach) {
	      obj.forEach(iterator, context);
	    } else if (obj.length === +obj.length) {
	      for (var i = 0, length = obj.length; i < length; i++) {
	        if (iterator.call(context, obj[i], i, obj) === breaker) return;
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iterator to each element.
	  // Delegates to **ECMAScript 5**'s native `map` if available.
	  _.map = _.collect = function(obj, iterator, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	    each(obj, function(value, index, list) {
	      results.push(iterator.call(context, value, index, list));
	    });
	    return results;
	  };

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var result;
	    any(obj, function(value, index, list) {
	      if (predicate.call(context, value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };

	  // Return all the elements that pass a truth test.
	  // Delegates to **ECMAScript 5**'s native `filter` if available.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    if (obj == null) return results;
	    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
	    each(obj, function(value, index, list) {
	      if (predicate.call(context, value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Delegates to **ECMAScript 5**'s native `some` if available.
	  // Aliased as `any`.
	  var any = _.some = _.any = function(obj, predicate, context) {
	    predicate || (predicate = _.identity);
	    var result = false;
	    if (obj == null) return result;
	    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
	    each(obj, function(value, index, list) {
	      if (result || (result = predicate.call(context, value, index, list))) return breaker;
	    });
	    return !!result;
	  };

	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
	    return any(obj, function(value) {
	      return value === target;
	    });
	  };

	  // Function (ahem) Functions
	  // --------------------

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){ return func.apply(null, args); }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };

	  // Returns a function, that, when invoked, will only be triggered once every
	  // browser animation frame - using tram's requestAnimationFrame polyfill.
	  _.throttle = function(func) {
	    var wait, args, context;
	    return function() {
	      if (wait) return;
	      wait = true;
	      args = arguments;
	      context = this;
	      tram.frame(function() {
	        wait = false;
	        func.apply(context, args);
	      });
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;
	      if (last < wait) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) {
	        timeout = setTimeout(later, wait);
	      }
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Object Functions
	  // ----------------

	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      var source = arguments[i];
	      for (var prop in source) {
	        if (obj[prop] === void 0) obj[prop] = source[prop];
	      }
	    }
	    return obj;
	  };

	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    return keys;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return hasOwnProperty.call(obj, key);
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    return obj === Object(obj);
	  };

	  // Utility Functions
	  // -----------------

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() { return new Date().getTime(); };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Export underscore
	  return _;
	}());
/***/ },
/* 19 */
/***/ function(module, exports) {}
/******/ ]);