var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var BaseStore=function(){function BaseStore(){(0,_classCallCheck2["default"])(this,BaseStore);this.data=new Map();}(0,_createClass2["default"])(BaseStore,[{key:"getItem",value:function getItem(key){return this.data.get(key);}},{key:"length",get:function get(){return this.data.size;}},{key:"setItem",value:function setItem(key,value){this.data.set(key,value);}},{key:"removeItem",value:function removeItem(key){this.data["delete"](key);}},{key:"clear",value:function clear(){this.data=new Map();}}]);return BaseStore;}();var _default=BaseStore;exports["default"]=_default;