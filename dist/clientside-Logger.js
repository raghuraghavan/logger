(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.fatal = exports.error = exports.warn = exports.info = exports.log = exports.debug = exports.tryCatch = exports.catcher = exports.init = exports.LOGLEVELS = void 0;

var _Cache = _interopRequireDefault(require("./util/Cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var LOGLEVELS = {
  DEBUG: "DEBUG",
  LOG: "LOG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  FATAL: "FATAL"
};
exports.LOGLEVELS = LOGLEVELS;
var LOGTHESHOLD = {
  DEBUG: 0,
  LOG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};
var cache = new _Cache.default({
  instantiated: false,
  logURL: '',
  logLevels: Object.keys(LOGLEVELS).map(function (key) {
    return LOGLEVELS[keys];
  }),
  logThresold: LOGLEVELS.ERROR,
  routeURL: '',
  showMessageInDevelopment: true,
  showMessageInProduction: false,
  silenceStackTrace: false,
  additionalInformation: ''
});

var logger = function logger() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var logLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'FATAL';
  var logURL = cache.get('logURL');
  var routeURL = cache.get('routeURL');
  var showMessageInDevelopment = cache.get('showMessageInDevelopment');
  var showMessageInProduction = cache.get('showMessageInProduction');
  var silenceStackTrace = cache.get('silenceStackTrace');
  var additionalInformation = cache.get('additionalInformation');
  var $logLevel = logLevel === 'fatal' ? 'error' : logLevel;

  if (!instantiated && showMessageInDevelopment) {
    console.warn("WARNING: Logger functon [".concat(logLevel, "] was called while logger global error handling was not enabled (eg. logger.init() was not exeucted"));
  }

  var payloadIsArray = Array.isArray(payload);

  if (window && console && document && (_typeof(payload) === 'object' || payloadIsArray)) {
    var payloadMessage = payloadIsArray ? payload : payload.errorMessage ? payload.errorMessage : '';
    var loggedMessage = ["[".concat(logLevel, "]:")].concat(payloadIsArray ? payloadMessage : [payloadMessage]);

    if (showMessageInDevelopment || showMessageInProduction) {
      if (console && console.hasOwnProperty($logLevel)) {
        var _console;

        (_console = console)[$logLevel].apply(_console, _toConsumableArray(loggedMessage));
      } else if (console && console.log) {
        var _console2;

        (_console2 = console).log.apply(_console2, _toConsumableArray(loggedMessage));
      }
    } // re-direction ..... 


    var _routeOnError = function _routeOnError() {
      if (routeURL && !payloadIsArray && window && window.location.pathname !== routeURL) {
        window.location.href = routeURL;
      }
    };

    if (logURL && LOGTHESHOLD[logLevel] >= LOGTHESHOLD[logThresold]) {
      var formattedPayload = Object.assign({
        url: window.location.pathname,
        logType: logLevel,
        message: (payloadIsArray ? payloadMessage.toString() : payloadMessage) + '.     ' + (additionalInformation && typeof additionalInformation === 'string' ? ' --> ' + additionalInformation : ''),
        detailMessage: payload.stack || ''
      });

      try {
        var request = new XMLHttpRequest();
        request.open('POST', logURL, true);
        request.setRequestHeader('content-Type', 'application/json; charset=UTF-8');
        request.onload = _routeOnError;

        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE && request.status !== 200) {
            _routeOnError();
          }
        };

        request.send(JSON.stringify(formattedPayload));
      } catch (err) {
        console && console.log('unable to send log information ', err);

        _routeOnError();
      }
    }
  } else routeOnError();
};

var listener = {
  error: function error(_ref) {
    var message = _ref.message,
        lineno = _ref.lineno,
        colno = _ref.colno,
        filename = _ref.filename,
        source = _ref.source,
        _error = _ref.error;

    var _filename = filename || source;

    if (!message.includes('Script error')) {
      logger({
        errorMessage: message,
        rowNumber: lineno,
        columnnumber: colno,
        stack: _error && _error.stack,
        _filename: _filename
      }, 'FATAL');
    }
  },
  unhandledrejection: function unhandledrejection(_ref2) {
    var promise = _ref2.promise,
        reason = _ref2.reason;
    logger({
      errorMessage: "Un-handled error occured in promise [".concat(promise, "] => ").concat(reason)
    }, 'fatal');
  }
};

var init = function init() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      logURL = _ref3.logURL,
      logThresold = _ref3.logThresold,
      routeURL = _ref3.routeURL,
      showMessageInDevelopment = _ref3.showMessageInDevelopment,
      showMessageInProduction = _ref3.showMessageInProduction,
      silenceStackTrace = _ref3.silenceStackTrace,
      additionalInformation = _ref3.additionalInformation;

  for (var key in listener) {
    window.addEventListener(key, listener[key]);
  }

  if (typeof logURL === 'string') {
    cache.set('logURL', logURL);
  }

  if (typeof logThresold === 'string') {
    cache.set('logThresold', logThresold);
  }

  if (typeof routeURL === 'string') {
    cache.set('routeURL', routeURL);
  }

  if (typeof silenceStackTrace === 'boolean') {
    cache.set('silenceStackTrace', silenceStackTrace);
  }

  if (typeof showMessageInDevelopment === 'boolean') {
    cache.set('showMessageInDevelopment', showMessageInDevelopment);
  }

  if (typeof showMessageInProduction === 'boolean') {
    cache.set('showMessageInProduction', showMessageInProduction);
  }

  if (additionalInformation) {
    cache.set('additionalInformation', additionalInformation);
  }
};

exports.init = init;

var catcher = function catcher(_ref4) {
  var message = _ref4.message,
      stack = _ref4.stack;
  logger({
    errorMessage: message,
    stack: stack
  }, 'ERROR');
};

exports.catcher = catcher;

var tryCatch = function tryCatch() {
  var tryCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
  var catchCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  try {
    tryCallback && tryCallback === 'function' && tryCallback();
  } catch (error) {
    catcher(error);
    catchCallback && catchCallback(error);
  }
};

exports.tryCatch = tryCatch;

var debug = function debug(messages) {
  return logger(messages, 'DEBUG');
};

exports.debug = debug;

var log = function log(messages) {
  return logger(messages, 'LOG');
};

exports.log = log;

var info = function info(messages) {
  return logger(messages, 'INFO');
};

exports.info = info;

var warn = function warn(messages) {
  return logger(messages, 'WARN');
};

exports.warn = warn;

var error = function error(messages) {
  return logger(messages, 'ERROR');
};

exports.error = error;

var fatal = function fatal(messages) {
  return logger(messages, 'FATAL');
};

exports.fatal = fatal;
var _default = {
  init: init,
  catcher: catcher,
  tryCatch: tryCatch,
  LOGLEVELS: LOGLEVELS,
  debug: debug,
  log: log,
  info: info,
  warn: warn,
  error: error,
  fatal: fatal
};
exports.default = _default;

},{"./util/Cache":2}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cache =
/*#__PURE__*/
function () {
  function Cache(cache) {
    _classCallCheck(this, Cache);

    this.cache = cache || {};
  }

  _createClass(Cache, [{
    key: "set",
    value: function set(key, value) {
      this.cache[key] = value;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.cache[key];
    }
  }]);

  return Cache;
}();

module.exports = Cache;

},{}]},{},[1]);
