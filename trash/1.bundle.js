webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./login": 6,
		"./login.js": 6,
		"./router": 1,
		"./router.js": 1,
		"./storage": 7,
		"./storage.js": 7,
		"./thought/view-thoughts/thoughts-graph-view": 11,
		"./thought/view-thoughts/thoughts-graph-view.js": 11,
		"./thought/view-thoughts/view-thoughts": 12,
		"./thought/view-thoughts/view-thoughts.js": 12
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 5;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"https://apis.google.com/js/client.js?onload=checkAuth\"\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	    __webpack_require__(7),
	    __webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    gapi_GLOBAL_VARIABLE_MODULE,
	    storage,
	    router
	) {

	    return {
	        init: init,
	    };

	    function init() {
	          // Your Client ID can be retrieved from your project in the Google
	         console.debug('gapi: ', gapi);
	          // Developer Console, https://console.developers.google.com
	          var CLIENT_ID = '586695064067-2k8v88rq1litcqj8v0ofnstj6t6qfhpa.apps.googleusercontent.com';

	          var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

	            $('#authorize-button').on('click', handleAuthClick);

	          /**
	           * Check if current user has authorized this application.
	           */
	          function checkAuth() {
	            gapi.auth.authorize(
	              {
	                'client_id': CLIENT_ID,
	                'scope': SCOPES.join(' '),
	                'immediate': true
	              }, handleAuthResult);
	          }

	          /**
	           * Handle response from authorization server.
	           *
	           * @param {Object} authResult Authorization result.
	           */
	          function handleAuthResult(authResult) {
	            var authorizeDiv = document.getElementById('authorize-div');
	            console.debug('authResult: ', authResult);
	            if (authResult && !authResult.error) {
	              // Hide auth UI, then load client library.
	              authorizeDiv.style.display = 'none';
	              loadDriveApi();
	            } else {
	              // Show auth UI, allowing the user to initiate authorization by
	              // clicking authorize button.
	              authorizeDiv.style.display = 'inline';
	            }
	          }

	          /**
	           * Initiate auth flow in response to user clicking authorize button.
	           *
	           * @param {Event} event Button click event.
	           */
	          function handleAuthClick(event) {
	              console.debug('handleAuthClick()');
	            gapi.auth.authorize(
	              {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
	              handleAuthResult);
	            return false;
	          }

	          /**
	           * Load Drive API client library.
	           */
	          function loadDriveApi() {
	            gapi.client.load('drive', 'v3', listFiles);
	          }

	          /**
	           * Print files.
	           */
	          function listFiles() {
	            var request = gapi.client.drive.files.list({
	                'pageSize': 10,
	                'fields': "nextPageToken, files(id, name)"
	              });

	              request.execute(function(resp) {
	                console.debug('resp: ', resp);
	                storage.thoughts = resp.files;
	                router.go('view-thoughts');
	              });

	          }
	    }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Just a storage singleton object for data :)
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	) {
	    var storage = {};
	    return storage;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;console.debug('thoughts-graph-view.js');
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"d3\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    d3
	) {
	    console.debug('d3.js: ', d3);

	    var thoughts = [];

	    return {
	        set: set,
	        render: render
	    };

	    function set(p_thoughts) {
	        thoughts = p_thoughts;
	    }
	    
	    function render() {
	        console.debug('redner!');

	        //Make an SVG Container
	        var svgContainer = d3.select("#output").append("svg")
	            .attr("width", 1000)
	            .attr("height", 500);

	        thoughts.forEach(function(thought, index) {
	            if (thought.name.length > 10) {
	                thought.name = thought.name.substr(0, 8) + '...';
	            }
	            var period = 2 * Math.PI / thoughts.length;
	            var thoughtCenterX = 2 * 135 * Math.cos(index * period) + 350;
	            var thoughtCenterY = 2 * 100  * Math.sin(index * period) + 250;

	            //Draw the Circle
	            var text = svgContainer.append("text")
	                 .text(thought.name)
	                 .attr("x", function() {
	                     return thoughtCenterX - this.getComputedTextLength() / 2;
	                 })
	                 .attr("y", thoughtCenterY);

	            //Draw the Center of thought
	            var circle = svgContainer.append("circle")
	                .attr('cx', thoughtCenterX)
	                .attr('cy', thoughtCenterY)
	                .attr('r', 1)
	                .attr('fill', 'black');

	            //Draw the Circle
	            var circle = svgContainer.append("ellipse")
	                 .attr("cx", thoughtCenterX)
	                 .attr("cy", thoughtCenterY)
	                 .attr("rx", 80)
	                 .attr("ry", 30)
	                 .style('fill', 'transparent')
	                 .style('fill-opacity', 0)
	                 .style('stroke', 'pink');
	        });
	    }


	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;console.debug('view-htoughts.js');
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(11),
	    !(function webpackMissingModule() { var e = new Error("Cannot find module \"https://apis.google.com/js/client.js?onload=checkAuth\"\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    thoughtsGraphView,
	    gapi_GLOBAL_VARIABLE_MODULE,
	    storage
	) {

	    return {
	        init: init
	    };

	    function init() {
	        console.debug('thoughtsGraphView: ', thoughtsGraphView);
	        console.debug('storage: ', storage);
	        thoughtsGraphView.set(storage.thoughts);
	        thoughtsGraphView.render();

	        appendPre('Files:');
	        var files = storage.thoughts;
	        if (files && files.length > 0) {
	          for (var i = 0; i < files.length; i++) {
	            var file = files[i];
	            appendPre(file.name + ' (' + file.id + ')');
	          }
	        } else {
	          appendPre('No files found.');
	        }
	    }


	      /**
	       * Append a pre element to the body containing the given message
	       * as its text node.
	       *
	       * @param {string} message Text to be placed in pre element.
	       */
	      function appendPre(message) {
	        var pre = document.getElementById('output');
	        var textContent = document.createTextNode(message + '\n');
	        pre.appendChild(textContent);
	      }
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
]);