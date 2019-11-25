/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"dom": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./ui/src/index.jsx","common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ui/src/core/hook.jsx":
/*!******************************!*\
  !*** ./ui/src/core/hook.jsx ***!
  \******************************/
/*! exports provided: appEvent, appFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"appEvent\", function() { return appEvent; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"appFilter\", function() { return appFilter; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"./node_modules/underscore/underscore.js\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\n\nvar eventHooks = {},\n    filterHooks = {};\n/**\r\n * Gets the list of attached filters or event hook.\r\n *\r\n * @access private\r\n *\r\n * @param {string} type                                     Required. Either `filter` or `event`.\r\n * @param {string} name                                     Required. The hook's trigger name.\r\n *\r\n * @returns {Array}\r\n */\n\nvar _getHooks = function getHooks(type, name) {\n  if ('event' === type) {\n    return eventHooks[name] || [];\n  }\n\n  return filterHooks[name] || [];\n};\n/**\r\n * Updates the list of hooked callbacks.\r\n *\r\n * @access private\r\n *\r\n * @param {string} type\r\n * @param {string} name\r\n * @param {array} value\r\n */\n\n\nvar updateHooks = function updateHooks(type, name, value) {\n  if ('event' === type) {\n    eventHooks[name] = value;\n    return;\n  }\n\n  filterHooks[name] = value;\n};\n/**\r\n * Add callable function to the list of hooks that are triggered base on the given name.\r\n *\r\n * @param {string} type                 The type of hook.\r\n * @param {string} name                 The name of the hook use to trigger an action.\r\n * @param {function} callback           The function to execute when the hook name is called.\r\n * @param {int} priority                The order to which the function will be executed. Default is 0.\r\n * @param {any} args                    Optional arguments to insert when the function is called.\r\n * @param {boolean} once                Whether to call the on function only once or every time the actionable hook is called.\r\n */\n\n\nvar addHook = function addHook(type, name, callback) {\n  var priority = arguments[3] || 0,\n      once = arguments[4] || false;\n\n  if (!callback.name) {\n    return false;\n  }\n\n  var hook = {\n    callback: callback,\n    priority: priority,\n    once: once\n  },\n      hooks = _getHooks(type, name),\n      exist = false;\n\n  hooks.map(function (h) {\n    if (exist) {\n      return;\n    }\n\n    if (h.callback.name === callback.name) {\n      exist = true;\n    }\n  });\n\n  if (exist) {\n    return;\n  }\n\n  hooks.push(hook);\n  updateHooks(type, name, hooks);\n  return true;\n};\n/**\r\n * Remove the actionable function from the list or remove the entire list.\r\n *\r\n * @param {string} type                 The type of hook to remove from.\r\n * @param {string} name                 The name of the list.\r\n * @param {function} callback           The function that was previously inserted from the list. If omitted, will remove\r\n *                                      the entire list of actionable functions.\r\n */\n\n\nvar removeHook = function removeHook(type, name) {\n  var callback = arguments[2] || false,\n      hooks = _getHooks(type, name);\n\n  if (!hooks.length) {\n    return;\n  }\n\n  if (!callback) {\n    // Remove all\n    updateHooks(type, name, []);\n    return;\n  }\n\n  var index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.findIndex(hooks, {\n    callback: callback\n  });\n\n  if (index >= 0) {\n    hooks = hooks.filter(function (hook, i) {\n      return i !== index;\n    });\n  }\n\n  updateHooks(type, name, hooks);\n};\n/**\r\n * Check if the given hook type and name contains actionable list of functions.\r\n *\r\n * @param {string} type\r\n * @param {string} name\r\n * @returns {boolean}\r\n */\n\n\nvar hasHook = function hasHook(type, name) {\n  var hooks = _getHooks(type, name);\n\n  return !!(hooks && hooks.length);\n};\n/**\r\n * Custom action event hook and listener.\r\n *\r\n * @type {object}\r\n */\n\n\nvar appEvent = {\n  /**\r\n   * Attached an event listener callback on the given event action name.\r\n   *\r\n   * @param {string} eventName\r\n   * @param {function} callback\r\n   * @returns {boolean}\r\n   */\n  on: function on(eventName, callback) {\n    var priority = arguments[1] || 0;\n    return addHook('event', eventName, callback, priority);\n  },\n\n  /**\r\n   * Attached an event listener which only triggered once.\r\n   *\r\n   * @param {string} eventName\r\n   * @param {function} callback\r\n   * @returns {boolean}\r\n   */\n  once: function once(eventName, callback) {\n    var priority = arguments[1] || 0;\n    return addHook('event', eventName, callback, priority, true);\n  },\n\n  /**\r\n   * Removes an event listener.\r\n   *\r\n   * @param {string} eventName\r\n   * @param {function} callback                   The callback function event listener to remove to. If omitted, will\r\n   *                                              remove all function callbacks attached to the event name.\r\n   */\n  off: function off(eventName) {\n    var callback = arguments[1];\n    return removeHook('event', eventName, callback);\n  },\n  trigger: function trigger(name) {\n    var args = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.values(arguments).slice(1);\n\n    if (!hasHook('event', name)) {\n      return Promise.resolve(args);\n    }\n\n    var hooks = _getHooks('event', name);\n\n    hooks = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(hooks, 'priority');\n\n    for (var i = 0; i < hooks.length; i++) {\n      var hook = hooks[i],\n          callback = hook.callback;\n      callback.apply(null, args);\n\n      if (hook.once) {\n        removeHook('event', name, callback);\n      }\n    }\n  },\n\n  /**\r\n   * Triggers a custom action event.\r\n   *\r\n   * @async\r\n   *\r\n   * @param {string} name\r\n   *\r\n   * @returns {*}\r\n   */\n  asyncTrigger: function asyncTrigger(name) {\n    var args = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.values(arguments).slice(1);\n\n    if (!hasHook('event', name)) {\n      return Promise.resolve(args);\n    }\n\n    var hooks = _getHooks('event', name),\n        func = [];\n\n    hooks = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(hooks, 'priority');\n\n    for (var i = 0; i < hooks.length; i++) {\n      var hook = hooks[i],\n          callback = hook.callback;\n      func.push(callback);\n\n      if (hook.once) {\n        removeHook('event', name, callback);\n      }\n    }\n\n    return func.reduce(function (promise, f) {\n      return promise.then(function (e) {\n        return f.apply(null, args);\n      });\n    }, Promise.resolve());\n  }\n};\nvar appFilter = {\n  getHooks: function getHooks(name) {\n    return _getHooks('filter', name);\n  },\n  add: function add(name, callback) {\n    var priority = arguments[2] || 0;\n    return addHook('filter', name, callback, priority);\n  },\n  apply: function apply(name, value) {\n    var args = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.values(arguments).slice(1);\n\n    if (!hasHook('filter', name)) {\n      return value;\n    }\n\n    var hooks = _getHooks('filter', name);\n\n    hooks = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(hooks, 'priority');\n\n    for (var i = 0; i < hooks.length; i++) {\n      var hook = hooks[i],\n          callback = hook.callback;\n      value = callback.apply(null, args);\n\n      if (hook.once) {\n        removeHook('filter', name, callback);\n      }\n    }\n\n    return value;\n  },\n  asyncApply: function asyncApply(name, value) {\n    var args = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.values(arguments).slice(1);\n\n    if (!hasHook('filter', name)) {\n      return Promise.resolve(value);\n    }\n\n    var hooks = _getHooks('filter', name),\n        func = [];\n\n    hooks = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.sortBy(hooks, 'priority');\n\n    for (var i = 0; i < hooks.length; i++) {\n      var hook = hooks[i],\n          callback = hook.callback;\n      func.push(callback);\n\n      if (hook.once) {\n        removeHook('filter', name, callback);\n      }\n    }\n\n    return func.reduce(function (promise, f) {\n      return promise.then(function (e) {\n        return f.apply(null, e);\n      });\n    }, Promise.resolve(args));\n  }\n};\n\n//# sourceURL=webpack:///./ui/src/core/hook.jsx?");

/***/ }),

/***/ "./ui/src/core/request.jsx":
/*!*********************************!*\
  !*** ./ui/src/core/request.jsx ***!
  \*********************************/
/*! exports provided: getRequest, postRequest, uploadFile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getRequest\", function() { return getRequest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"postRequest\", function() { return postRequest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"uploadFile\", function() { return uploadFile; });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"./node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ \"./node_modules/underscore/underscore.js\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar DEFAULT_HEADERS = {\n  'Content-Type': 'application/json',\n  'Accept': 'application/json, */*;q=0.1'\n};\n\nfunction instance(options) {\n  var headers = options.headers;\n  headers = headers || {};\n  options.headers = underscore__WEBPACK_IMPORTED_MODULE_1___default.a.extend({}, DEFAULT_HEADERS, headers);\n  return axios__WEBPACK_IMPORTED_MODULE_0___default.a.create(options);\n}\n\nfunction handleCancel(onCancel) {\n  return new axios__WEBPACK_IMPORTED_MODULE_0___default.a.CancelToken(onCancel);\n}\n\nfunction handleResponse(response) {\n  var data = response.data;\n  return data;\n}\n\nfunction handleError(err) {\n  return [err];\n}\n\nfunction getRequest(url) {\n  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n  var onCancel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;\n  params = params || {};\n  var inst = instance({\n    headers: headers\n  }),\n      CancelToken = onCancel ? handleCancel(onCancel) : false;\n  return inst.get(url, {\n    params: params,\n    CancelToken: CancelToken\n  }).then(handleResponse)[\"catch\"](handleError);\n}\nfunction postRequest(url, params) {\n  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n  var onCancel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;\n  params = params || {};\n  var inst = instance({\n    headers: headers\n  }),\n      CancelToken = onCancel ? handleCancel(onCancel) : false;\n  return inst.post(url, params, {\n    CancelToken: CancelToken\n  }).then(handleResponse)[\"catch\"](handleError);\n}\nfunction uploadFile(url, params) {\n  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n  var onCancel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;\n  headers = headers || {}; // Change content-type\n\n  headers['Content-Type'] = 'multipart/form-data; boundary=' + new Date().getTime();\n  return postRequest(url, params, headers, onCancel);\n}\n\n//# sourceURL=webpack:///./ui/src/core/request.jsx?");

/***/ }),

/***/ "./ui/src/core/route.jsx":
/*!*******************************!*\
  !*** ./ui/src/core/route.jsx ***!
  \*******************************/
/*! exports provided: getRoute, setRoute */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getRoute\", function() { return getRoute; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setRoute\", function() { return setRoute; });\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./ui/src/core/state.jsx\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore */ \"./node_modules/underscore/underscore.js\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path_to_regexp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path-to-regexp */ \"./node_modules/path-to-regexp/dist.es2015/index.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ \"./ui/src/utils/index.jsx\");\n\n\n\n\nvar Routes = new _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nfunction getRoute(path) {\n  var routes = Routes.get();\n\n  if (routes[path]) {\n    return underscore__WEBPACK_IMPORTED_MODULE_1___default.a.extend({}, routes[path], {\n      params: {}\n    });\n  }\n\n  var route;\n  Routes.getKeys().map(function (routePath) {\n    var _routes$routePath = routes[routePath],\n        regex = _routes$routePath.regex,\n        keys = _routes$routePath.keys;\n    var params = {},\n        arr = regex.exec(path);\n\n    if (arr) {\n      route = routes[path]; // Remove the first item on the array\n\n      arr.shift();\n      keys.map(function (param, i) {\n        if (param.name) {\n          params[param.name] = arr[i];\n        }\n      });\n      route.params = params;\n    }\n  });\n  return route;\n}\n/**\r\n *\r\n * @param {string} path\r\n * @param {object} props\r\n * @param {object|function} props.state\r\n * @param {boolean} replace\r\n */\n\nfunction setRoute(path, props) {\n  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;\n\n  if (!replace && Routes.get(path)) {\n    return;\n  }\n\n  var keys = [],\n      regex = Object(path_to_regexp__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(path, keys),\n      data = {\n    regex: regex,\n    keys: keys,\n    props: props\n  },\n      url = Object(_utils__WEBPACK_IMPORTED_MODULE_3__[\"parseUrl\"])(path);\n  data.query = url.query;\n  Routes.set(path, data);\n}\n\n//# sourceURL=webpack:///./ui/src/core/route.jsx?");

/***/ }),

/***/ "./ui/src/core/screen.jsx":
/*!********************************!*\
  !*** ./ui/src/core/screen.jsx ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./ui/src/core/state.jsx\");\n/* harmony import */ var _route__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./route */ \"./ui/src/core/route.jsx\");\n/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request */ \"./ui/src/core/request.jsx\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\n\n\n\nvar Config = new _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\nvar ScreenState =\n/*#__PURE__*/\nfunction (_State) {\n  _inherits(ScreenState, _State);\n\n  function ScreenState() {\n    _classCallCheck(this, ScreenState);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(ScreenState).call(this));\n  }\n\n  _createClass(ScreenState, [{\n    key: \"addScreen\",\n    value: function addScreen(path, props) {\n      return Object(_route__WEBPACK_IMPORTED_MODULE_1__[\"setRoute\"])(path, props);\n    }\n  }, {\n    key: \"load\",\n    value: function load(path) {\n      var _this = this;\n\n      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      var curPath = this.get('path');\n\n      if (curPath === path && !refresh) {\n        return; // Do nothing\n      }\n\n      var route = Object(_route__WEBPACK_IMPORTED_MODULE_1__[\"getRoute\"])(path);\n\n      if (!route) {\n        // Get 404\n        route = Object(_route__WEBPACK_IMPORTED_MODULE_1__[\"getRoute\"])('404');\n      }\n\n      if (!route) {\n        return; // todo: Do something, perhaps load a default 404 page\n      }\n\n      Object(_request__WEBPACK_IMPORTED_MODULE_2__[\"getRequest\"])(path).then(function (r) {\n        return _this.updateScreen(r, route, path);\n      });\n    }\n  }, {\n    key: \"updateScreen\",\n    value: function updateScreen(res, route, path) {\n      var state = res.state;\n      state = state || {};\n      state.params = route.params;\n      state.path = path;\n\n      if (route.state) {\n        var routeState = route.state;\n\n        if ('function' === typeof routeState) {\n          routeState = route.state.call(null, route.params, state);\n        }\n\n        _.extend(state, routeState);\n      }\n\n      this.reset(state);\n    }\n  }]);\n\n  return ScreenState;\n}(_state__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\nvar Screen = function Screen() {\n  return new ScreenState();\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Screen);\n\n//# sourceURL=webpack:///./ui/src/core/screen.jsx?");

/***/ }),

/***/ "./ui/src/core/state.jsx":
/*!*******************************!*\
  !*** ./ui/src/core/state.jsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return State; });\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! underscore */ \"./node_modules/underscore/underscore.js\");\n/* harmony import */ var underscore__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_0__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar State =\n/*#__PURE__*/\nfunction () {\n  function State() {\n    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n    var subscribers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n    _classCallCheck(this, State);\n\n    this.state = this.filter(initialState);\n    this.subscribers = subscribers;\n  }\n\n  _createClass(State, [{\n    key: \"filter\",\n    value: function filter(state) {\n      return state;\n    }\n  }, {\n    key: \"get\",\n    value: function get(name) {\n      if (name) {\n        return this.state[name];\n      }\n\n      return this.state;\n    }\n  }, {\n    key: \"set\",\n    value: function set(name, value) {\n      var isSilent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n      var state = this.state;\n\n      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isObject(value)) {\n        state = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.extend({}, state, value);\n      } else {\n        state[name] = value;\n      }\n\n      this.state = this.filter(state);\n\n      if (isSilent) {\n        return;\n      } // Call subscribers here\n\n\n      this.__subscribe();\n    }\n  }, {\n    key: \"unset\",\n    value: function unset(name) {\n      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n      var isSilent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n      if (!this.state[name]) {\n        return;\n      }\n\n      if (!value) {\n        this.state = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.omit(this.state, name);\n        return;\n      }\n\n      var stateValue = this.state[name];\n\n      if (underscore__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(stateValue)) {\n        stateValue = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.without(stateValue, value);\n        this.state[name] = stateValue;\n      }\n\n      if (isSilent) {\n        return;\n      } // Call subscribers\n\n\n      this.__subscribe();\n    }\n  }, {\n    key: \"reset\",\n    value: function reset(state) {\n      var isSilent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      this.state = this.filter(state);\n\n      if (isSilent) {\n        return;\n      }\n\n      this.__subscribe();\n    }\n  }, {\n    key: \"__subscribe\",\n    value: function __subscribe() {\n      var _this = this;\n\n      if (!this.subscribers || !this.subscribers.length) {\n        return;\n      }\n\n      this.subscribers.map(function (s) {\n        return s.call(null, _this.state);\n      });\n    }\n  }, {\n    key: \"subscribe\",\n    value: function subscribe(subscriber) {\n      this.subscribers.push(subscriber);\n    }\n  }, {\n    key: \"unsubscribe\",\n    value: function unsubscribe(subscriber) {\n      if (!this.subscribers || !this.subscribers.length) {\n        return;\n      }\n\n      this.subscribers = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.without(this.subscribers, subscriber);\n    }\n  }, {\n    key: \"getKeys\",\n    value: function getKeys() {\n      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.keys(this.state);\n    }\n  }, {\n    key: \"getValues\",\n    value: function getValues() {\n      return underscore__WEBPACK_IMPORTED_MODULE_0___default.a.values(this.state);\n    }\n  }, {\n    key: \"count\",\n    value: function count() {\n      return this.getKeys().length;\n    }\n    /**\r\n     * Get the next property\r\n     *\r\n     * @param {string} name\r\n     */\n\n  }, {\n    key: \"nextOf\",\n    value: function nextOf(name) {\n      name = new String(name);\n\n      var keys = this.getKeys(),\n          index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.findIndex(keys, name);\n\n      if (index < 0 || !keys[index + 1]) {\n        return null;\n      }\n\n      return this.get(keys[index + 1]);\n    }\n    /**\r\n     * Get the previous property.\r\n     *\r\n     * @param {string} name\r\n     */\n\n  }, {\n    key: \"prevOf\",\n    value: function prevOf(name) {\n      name = new String(name);\n\n      var keys = this.getKeys(),\n          index = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.findIndex(keys, name);\n\n      if (index <= 0 || !keys[index - 1]) {\n        return null;\n      }\n\n      return this.get(keys[index - 1]);\n    }\n    /**\r\n     * Returns the an state object. Removing any other instance of state.\r\n     *\r\n     * @returns {object}\r\n     */\n\n  }, {\n    key: \"toJSON\",\n    value: function toJSON() {\n      var json = function json(obj) {\n        obj = underscore__WEBPACK_IMPORTED_MODULE_0___default.a.clone(obj);\n        Object.keys(obj).map(function (key) {\n          var value = obj[key]; // If a value is an `state` object, get the state only\n\n          if (value && value.subscribe) {\n            value = value.toJSON();\n          }\n\n          obj[key] = value;\n        });\n        return obj;\n      };\n\n      return json(this.state);\n    }\n  }]);\n\n  return State;\n}();\n\n\n\n//# sourceURL=webpack:///./ui/src/core/state.jsx?");

/***/ }),

/***/ "./ui/src/index.jsx":
/*!**************************!*\
  !*** ./ui/src/index.jsx ***!
  \**************************/
/*! exports provided: State, Screen, getRequest, postRequest, uploadFile, appFilter, appEvent, Utils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/state */ \"./ui/src/core/state.jsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"State\", function() { return _core_state__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _core_screen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/screen */ \"./ui/src/core/screen.jsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Screen\", function() { return _core_screen__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _core_request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/request */ \"./ui/src/core/request.jsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"getRequest\", function() { return _core_request__WEBPACK_IMPORTED_MODULE_2__[\"getRequest\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"postRequest\", function() { return _core_request__WEBPACK_IMPORTED_MODULE_2__[\"postRequest\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"uploadFile\", function() { return _core_request__WEBPACK_IMPORTED_MODULE_2__[\"uploadFile\"]; });\n\n/* harmony import */ var _core_hook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/hook */ \"./ui/src/core/hook.jsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"appFilter\", function() { return _core_hook__WEBPACK_IMPORTED_MODULE_3__[\"appFilter\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"appEvent\", function() { return _core_hook__WEBPACK_IMPORTED_MODULE_3__[\"appEvent\"]; });\n\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ \"./ui/src/utils/index.jsx\");\n/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, \"Utils\", function() { return _utils__WEBPACK_IMPORTED_MODULE_4__; });\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./ui/src/index.jsx?");

/***/ }),

/***/ "./ui/src/utils/index.jsx":
/*!********************************!*\
  !*** ./ui/src/utils/index.jsx ***!
  \********************************/
/*! exports provided: parseUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _parseurl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseurl */ \"./ui/src/utils/parseurl.jsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"parseUrl\", function() { return _parseurl__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n\n\n\n//# sourceURL=webpack:///./ui/src/utils/index.jsx?");

/***/ }),

/***/ "./ui/src/utils/parseurl.jsx":
/*!***********************************!*\
  !*** ./ui/src/utils/parseurl.jsx ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return parseUrl; });\nfunction parseUrl(url) {\n  // Parser\n  var obj = {\n    protocol: '',\n    host: '',\n    params: {},\n    queryString: '',\n    query: {}\n  };\n  var p1 = url.indexOf('//');\n\n  if (p1 > 0) {\n    obj.protocol = url.substr(0, p1 - 1);\n    url = url.substr(p1 + 2);\n  }\n\n  var p2 = url.indexOf('/');\n\n  if (p2 >= 0) {\n    obj.host = url.substr(0, p2);\n    url = url.substr(p2);\n  }\n\n  var p3 = url.indexOf('?');\n\n  if (p3 > 0) {\n    obj.queryString = url.substr(p3);\n    url = url.substr(0, p3);\n    var queryString = obj.queryString.substr(1);\n    queryString.split('&').map(function (q1) {\n      var q2 = q1.split('=');\n      obj.query[q2[0]] = q2[1] || '';\n    });\n  }\n\n  obj.path = url;\n\n  if ('/' === url.charAt(0)) {\n    url = url.substr(1);\n  }\n\n  obj.list = url.split('/');\n  var params = {},\n      list = url.split('/'),\n      last = false;\n  list.sort(function (a, b) {\n    params[a] = b;\n    last = b;\n  });\n  obj.params = params;\n\n  obj.compose = function () {\n    var com = [];\n\n    if (obj.protocol) {\n      com.push(obj.protocol + ':/');\n    }\n\n    if (obj.host) {\n      com.push(obj.host);\n    } else {\n      // Add slashes\n      com.push('');\n    }\n\n    com = com.concat(obj.list);\n    var query = [];\n\n    _.keys(obj.query).map(function (key) {\n      query.push(key + '=' + obj.query[key]);\n    });\n\n    if (query.length) {\n      obj.queryString = '?' + query.join('&');\n    }\n\n    return com.join('/') + obj.queryString;\n  };\n\n  return obj;\n}\n\n//# sourceURL=webpack:///./ui/src/utils/parseurl.jsx?");

/***/ })

/******/ });