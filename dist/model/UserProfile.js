var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _ApiClient=_interopRequireDefault(require("../ApiClient"));var UserProfile=function(){function UserProfile(){(0,_classCallCheck2["default"])(this,UserProfile);UserProfile.initialize(this);}(0,_createClass2["default"])(UserProfile,null,[{key:"initialize",value:function initialize(obj){}},{key:"constructFromObject",value:function constructFromObject(data,obj){if(data){obj=obj||new UserProfile();if(data.hasOwnProperty('id')){obj['id']=_ApiClient["default"].convertToType(data['id'],'String');}if(data.hasOwnProperty('preferred_email')){obj['preferred_email']=_ApiClient["default"].convertToType(data['preferred_email'],'String');}if(data.hasOwnProperty('last_name')){obj['last_name']=_ApiClient["default"].convertToType(data['last_name'],'String');}if(data.hasOwnProperty('first_name')){obj['first_name']=_ApiClient["default"].convertToType(data['first_name'],'String');}}return obj;}}]);return UserProfile;}();UserProfile.prototype['id']=undefined;UserProfile.prototype['preferred_email']=undefined;UserProfile.prototype['last_name']=undefined;UserProfile.prototype['first_name']=undefined;var _default=UserProfile;exports["default"]=_default;