define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

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

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;;;

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    router
	) {

	    $(document).ready(function() {
	        console.debug('app start');

	        console.debug('call router init');
	        router.init();

	    });

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"text!thought/create-thought/create-thought.html\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"text!thought/view-thoughts/view-thoughts.html\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"text!login.html\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    createThoughtTemplate,
	    viewThoughtsTemplate,
	    loginTemplate
	) {
	    var router = {
	        init: init,
	        goToRoute: goToRoute,
	        go: goToRoute,
	        goToRouteInAdressBar: goToRouteInAdressBar
	    };

	    return router;
	    
	    
	    function init() {
	        goToRouteInAdressBar();
	        setRouterLinkListeners();
	    }

	    function goToRouteInAdressBar() {
	        var route = window.location.hash.slice(1);
	        goToRoute(route);
	    }

	    function setRouterLinkListeners() {
	        $('[data-router-link]').on('click', function(event) {
	            event.preventDefault();

	            var $element = $(event.target);
	            var href = $element.attr('href');
	            var route = href.slice(1);

	            goToRoute(route);

	            return false;
	        });
	    }

	    function goToRoute(route) {
	        console.debug('route: ', route);
	        var $siteContainer = $('.site-content');
	        var template;
	        var controllerPath;
	        switch (route) {
	            case 'login':
	                template = loginTemplate;
	                controllerPath = 'login';
	                break;
	            case 'create-thought':
	                template = createThoughtTemplate;
	                break;
	            case 'view-thoughts':
	                template = viewThoughtsTemplate;
	                controllerPath = 'thought/view-thoughts/view-thoughts';
	                break;
	            default: 
	                template = loginTemplate;
	                controllerPath = 'login';
	                break;
	        }

	        $siteContainer.empty();
	        $siteContainer.append(template);
	        
	        if (controllerPath.length > 0) {
	            __webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(5)(controllerPath)]; (function(controller) {
	                controller.init();
	            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});
	        }

	        window.location.hash = route;
	    }

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])});;