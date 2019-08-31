module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./atoms/Animated.tsx":
/*!****************************!*\
  !*** ./atoms/Animated.tsx ***!
  \****************************/
/*! exports provided: Animated */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animated", function() { return Animated; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Animated = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.div.withConfig({
  displayName: "Animated",
  componentId: "sweofb-0"
})(["opacity:", ";transition:opacity ", ";"], props => props.launch ? 1 : 0, props => props.time ? props.time + 's' : '0.2s');

/***/ }),

/***/ "./atoms/Button.tsx":
/*!**************************!*\
  !*** ./atoms/Button.tsx ***!
  \**************************/
/*! exports provided: Button */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Button = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.button.withConfig({
  displayName: "Button",
  componentId: "zob06-0"
})(["font-size:1em;border:2px solid white;border-radius:3px;margin:7px;"]);

/***/ }),

/***/ "./atoms/Header.tsx":
/*!**************************!*\
  !*** ./atoms/Header.tsx ***!
  \**************************/
/*! exports provided: Header */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Header", function() { return Header; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Header = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.div.withConfig({
  displayName: "Header",
  componentId: "sc-1fdihrz-0"
})(["top:0px;background-color:gainsboro;position:sticky;width:100%;height:40px;"]);

/***/ }),

/***/ "./atoms/Input.tsx":
/*!*************************!*\
  !*** ./atoms/Input.tsx ***!
  \*************************/
/*! exports provided: Input */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Input", function() { return Input; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Input = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.input.attrs(props => ({
  type: props.type,
  size: props.size || '1em'
})).withConfig({
  displayName: "Input",
  componentId: "q9obwi-0"
})(["color:black;font-size:1em;border:2px solid white;border-radius:3px;margin:7px;width:120px;"]);

/***/ }),

/***/ "./atoms/Title.tsx":
/*!*************************!*\
  !*** ./atoms/Title.tsx ***!
  \*************************/
/*! exports provided: Title */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Title", function() { return Title; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Title = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.h1.withConfig({
  displayName: "Title",
  componentId: "sc-1t8uqv5-0"
})(["font-family:", ";font-size:50px;text-align:center;"], props => props.font);

/***/ }),

/***/ "./atoms/Wrapper.tsx":
/*!***************************!*\
  !*** ./atoms/Wrapper.tsx ***!
  \***************************/
/*! exports provided: Wrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Wrapper", function() { return Wrapper; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);

const Wrapper = styled_components__WEBPACK_IMPORTED_MODULE_0___default.a.div.withConfig({
  displayName: "Wrapper",
  componentId: "sc-1fb18dj-0"
})([""]);

/***/ }),

/***/ "./atoms/index.ts":
/*!************************!*\
  !*** ./atoms/index.ts ***!
  \************************/
/*! exports provided: Animated, Button, Header, Input, Title, Wrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animated */ "./atoms/Animated.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Animated", function() { return _Animated__WEBPACK_IMPORTED_MODULE_0__["Animated"]; });

/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./atoms/Button.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return _Button__WEBPACK_IMPORTED_MODULE_1__["Button"]; });

/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Header */ "./atoms/Header.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Header", function() { return _Header__WEBPACK_IMPORTED_MODULE_2__["Header"]; });

/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Input */ "./atoms/Input.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Input", function() { return _Input__WEBPACK_IMPORTED_MODULE_3__["Input"]; });

/* harmony import */ var _Title__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Title */ "./atoms/Title.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Title", function() { return _Title__WEBPACK_IMPORTED_MODULE_4__["Title"]; });

/* harmony import */ var _Wrapper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Wrapper */ "./atoms/Wrapper.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Wrapper", function() { return _Wrapper__WEBPACK_IMPORTED_MODULE_5__["Wrapper"]; });








/***/ }),

/***/ "./molecules/IntersectingWrapper.tsx":
/*!*******************************************!*\
  !*** ./molecules/IntersectingWrapper.tsx ***!
  \*******************************************/
/*! exports provided: IntersectingWrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntersectingWrapper", function() { return IntersectingWrapper; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _atoms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../atoms */ "./atoms/index.ts");
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/molecules/IntersectingWrapper.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


const IntersectingWrapper = ({
  children,
  time
}) => {
  const element = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(null);
  const {
    0: isIntersecting,
    1: setIsIntersecting
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    let node = element.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const {
          isIntersecting
        } = entry;

        if (!!element && !!element.current) {
          if (isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(element.current);
          }
        }
      });
    });

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [element]);
  return __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Animated"], {
    launch: isIntersecting,
    time: !!time ? time : 1,
    ref: element,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: undefined
  }, children);
};

/***/ }),

/***/ "./molecules/index.ts":
/*!****************************!*\
  !*** ./molecules/index.ts ***!
  \****************************/
/*! exports provided: IntersectingWrapper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IntersectingWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IntersectingWrapper */ "./molecules/IntersectingWrapper.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IntersectingWrapper", function() { return _IntersectingWrapper__WEBPACK_IMPORTED_MODULE_0__["IntersectingWrapper"]; });



/***/ }),

/***/ "./organisms/Head.tsx":
/*!****************************!*\
  !*** ./organisms/Head.tsx ***!
  \****************************/
/*! exports provided: HeadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeadComponent", function() { return HeadComponent; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ "next/head");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/organisms/Head.tsx";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

const HeadComponent = ({
  title
}) => __jsx(next_head__WEBPACK_IMPORTED_MODULE_1___default.a, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 8
  },
  __self: undefined
}, __jsx("title", {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 9
  },
  __self: undefined
}, title), __jsx("meta", {
  name: "viewport",
  content: "initial-scale=1.0, width=device-width",
  key: "viewport",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 10
  },
  __self: undefined
}), __jsx("meta", {
  name: "viewport",
  content: "initial-scale=1.2, width=device-width",
  key: "viewport",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 15
  },
  __self: undefined
}));

/***/ }),

/***/ "./organisms/Layout.tsx":
/*!******************************!*\
  !*** ./organisms/Layout.tsx ***!
  \******************************/
/*! exports provided: Layout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return Layout; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ "./organisms/index.ts");
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/organisms/Layout.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


const Layout = ({
  title,
  children
}) => __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 10
  },
  __self: undefined
}, __jsx(___WEBPACK_IMPORTED_MODULE_1__["Head"], {
  title: title,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 11
  },
  __self: undefined
}), __jsx("div", {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 12
  },
  __self: undefined
}, children));

/***/ }),

/***/ "./organisms/Login.tsx":
/*!*****************************!*\
  !*** ./organisms/Login.tsx ***!
  \*****************************/
/*! exports provided: Login */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Login", function() { return Login; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _atoms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../atoms */ "./atoms/index.ts");
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/organisms/Login.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


const Login = () => {
  const {
    0: loginOpen,
    1: setLoginOpen
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const {
    0: username,
    1: setUsername
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const {
    0: password,
    1: setPassword
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');

  const handleUsername = e => {
    const target = e.target;
    setUsername(target.value);
    console.log(target.value);
  };

  const handlePassword = e => {
    const target = e.target;
    setPassword(target.value);
    console.log(target.value);
  };

  const handleLogin = e => {
    e.preventDefault(); //do magic

    setUsername('');
    setPassword('');
    console.log(e);
  };

  return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, !loginOpen && __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    onClick: () => setLoginOpen(true),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: undefined
  }, "Sign in"), loginOpen && __jsx("form", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: undefined
  }, __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Input"], {
    value: username,
    onChange: username => handleUsername(username),
    placeholder: "Username",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: undefined
  }), __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Input"], {
    value: password,
    onChange: password => handlePassword(password),
    placeholder: "Password",
    type: "password",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: undefined
  }), __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    onClick: e => {
      handleLogin(e);
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: undefined
  }, "Log in")));
};

/***/ }),

/***/ "./organisms/index.ts":
/*!****************************!*\
  !*** ./organisms/index.ts ***!
  \****************************/
/*! exports provided: Head, Layout, Login */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Head__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Head */ "./organisms/Head.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Head", function() { return _Head__WEBPACK_IMPORTED_MODULE_0__["HeadComponent"]; });

/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Layout */ "./organisms/Layout.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Layout", function() { return _Layout__WEBPACK_IMPORTED_MODULE_1__["Layout"]; });

/* harmony import */ var _Login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Login */ "./organisms/Login.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Login", function() { return _Login__WEBPACK_IMPORTED_MODULE_2__["Login"]; });





/***/ }),

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _organisms_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../organisms/Layout */ "./organisms/Layout.tsx");
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../templates */ "./templates/index.ts");
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/pages/index.tsx";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


/* harmony default export */ __webpack_exports__["default"] = (() => __jsx(_organisms_Layout__WEBPACK_IMPORTED_MODULE_1__["Layout"], {
  title: "skole | ebin oppimisalusta",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 5
  },
  __self: undefined
}, __jsx(_templates__WEBPACK_IMPORTED_MODULE_2__["LandingPage"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 6
  },
  __self: undefined
})));

/***/ }),

/***/ "./templates/LandingPage.tsx":
/*!***********************************!*\
  !*** ./templates/LandingPage.tsx ***!
  \***********************************/
/*! exports provided: LandingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandingPage", function() { return LandingPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _atoms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../atoms */ "./atoms/index.ts");
/* harmony import */ var _organisms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../organisms */ "./organisms/index.ts");
/* harmony import */ var _molecules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../molecules */ "./molecules/index.ts");
/* harmony import */ var flexbox_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flexbox-react */ "flexbox-react");
/* harmony import */ var flexbox_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flexbox_react__WEBPACK_IMPORTED_MODULE_4__);
var _jsxFileName = "/Users/blomqma/projects/skole/frontend/templates/LandingPage.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;





const LandingPage = () => {
  return __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Wrapper"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: undefined
  }, __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Header"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: undefined
  }, __jsx(flexbox_react__WEBPACK_IMPORTED_MODULE_4___default.a, {
    justifyContent: "flex-end",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: undefined
  }, __jsx(_organisms__WEBPACK_IMPORTED_MODULE_2__["Login"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }))), __jsx(_molecules__WEBPACK_IMPORTED_MODULE_3__["IntersectingWrapper"], {
    time: 1,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }, __jsx(_atoms__WEBPACK_IMPORTED_MODULE_1__["Title"], {
    font: "cursive",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: undefined
  }, "Skole!")));
};

/***/ }),

/***/ "./templates/index.ts":
/*!****************************!*\
  !*** ./templates/index.ts ***!
  \****************************/
/*! exports provided: LandingPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LandingPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LandingPage */ "./templates/LandingPage.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LandingPage", function() { return _LandingPage__WEBPACK_IMPORTED_MODULE_0__["LandingPage"]; });



/***/ }),

/***/ 3:
/*!*******************************!*\
  !*** multi ./pages/index.tsx ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/blomqma/projects/skole/frontend/pages/index.tsx */"./pages/index.tsx");


/***/ }),

/***/ "flexbox-react":
/*!********************************!*\
  !*** external "flexbox-react" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("flexbox-react");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("styled-components");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map