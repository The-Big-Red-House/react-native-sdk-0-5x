var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _Utils=require("./Utils");var _urlParse=_interopRequireDefault(require("url-parse"));var _reactNative=require("react-native");var _AuthorizationCode=_interopRequireDefault(require("./OAuth/AuthorizationCode"));var _Storage=_interopRequireDefault(require("./Storage"));var _authStatus2=_interopRequireDefault(require("./constants/auth-status.constants"));var _unauthenticated=require("../common/exceptions/unauthenticated.exception");var KindeSDK=function(){function KindeSDK(issuer,redirectUri,clientId,logoutRedirectUri){var scope=arguments.length>4&&arguments[4]!==undefined?arguments[4]:'openid offline';(0,_classCallCheck2["default"])(this,KindeSDK);this.issuer=issuer;(0,_Utils.checkNotNull)(this.issuer,'Issuer');this.redirectUri=redirectUri;(0,_Utils.checkNotNull)(this.redirectUri,'Redirect URI');this.clientId=clientId;(0,_Utils.checkNotNull)(this.clientId,'Client Id');this.logoutRedirectUri=logoutRedirectUri;(0,_Utils.checkNotNull)(this.logoutRedirectUri,'Logout Redirect URI');this.scope=scope;this.clientSecret='';this.authStatus=_authStatus2["default"].UNAUTHENTICATED;}(0,_createClass2["default"])(KindeSDK,[{key:"login",value:function login(){this.cleanUp();var auth=new _AuthorizationCode["default"]();this.updateAuthStatus(_authStatus2["default"].AUTHENTICATING);return auth.login(this,true);}},{key:"getToken",value:function getToken(url){var _this=this;return new Promise(function(){var _ref=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(resolve,reject){var URLParsed,_URLParsed$query,code,error,error_description,msg,formData,state,codeVerifier;return _regenerator["default"].wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:try{if(_this.checkIsUnAuthenticated()){reject(new _unauthenticated.UnAuthenticatedException());}(0,_Utils.checkNotNull)(url,'URL');URLParsed=(0,_urlParse["default"])(url,true);_URLParsed$query=URLParsed.query,code=_URLParsed$query.code,error=_URLParsed$query.error,error_description=_URLParsed$query.error_description;(0,_Utils.checkNotNull)(code,'code');if(error){msg=error_description?error_description:error;reject(msg);}formData=new FormData();formData.append('code',code);formData.append('client_id',_this.clientId);formData.append('client_secret',_this.clientSecret);formData.append('grant_type','authorization_code');formData.append('redirect_uri',_this.redirectUri);state=_Storage["default"].getState();if(state){formData.append('state',state);}codeVerifier=_Storage["default"].getCodeVerifier();if(codeVerifier){formData.append('code_verifier',codeVerifier);}fetch(_this.tokenEndpoint,{method:'POST',headers:{'Content-Type':'multipart/form-data'},body:formData}).then(function(response){return response.json();}).then(function(){var _ref2=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(responseJson){return _regenerator["default"].wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!responseJson.error){_context.next=2;break;}return _context.abrupt("return",reject(responseJson));case 2:_Storage["default"].setAccessToken(responseJson.access_token);_this.updateAuthStatus(_authStatus2["default"].AUTHENTICATED);resolve(responseJson);case 5:case"end":return _context.stop();}}},_callee);}));return function(_x3){return _ref2.apply(this,arguments);};}())["catch"](function(err){_this.updateAuthStatus(_authStatus2["default"].UNAUTHENTICATED);reject(err.response.data);});}catch(error){_this.updateAuthStatus(_authStatus2["default"].UNAUTHENTICATED);reject(error);}case 1:case"end":return _context2.stop();}}},_callee2);}));return function(_x,_x2){return _ref.apply(this,arguments);};}());}},{key:"register",value:function register(){var auth=new _AuthorizationCode["default"]();this.updateAuthStatus(_authStatus2["default"].AUTHENTICATING);return auth.login(this,true,'registration');}},{key:"logout",value:function logout(){this.cleanUp();var URLParsed=(0,_urlParse["default"])(this.logoutEndpoint,true);URLParsed.query['redirect']=this.logoutRedirectUri;_reactNative.Linking.openURL(URLParsed.toString());}},{key:"cleanUp",value:function cleanUp(){this.updateAuthStatus(_authStatus2["default"].UNAUTHENTICATED);return _Storage["default"].clear();}},{key:"updateAuthStatus",value:function updateAuthStatus(_authStatus){this.authStatus=_authStatus;_Storage["default"].setAuthStatus(this.authStatus);}},{key:"checkIsUnAuthenticated",value:function checkIsUnAuthenticated(){var authStatusStorage=_Storage["default"].getAuthStatus();if((!this.authStatus||this.authStatus===_authStatus2["default"].UNAUTHENTICATED)&&(!authStatusStorage||authStatusStorage===_authStatus2["default"].UNAUTHENTICATED)){return true;}return false;}},{key:"authorizationEndpoint",get:function get(){return this.issuer+"/oauth2/auth";}},{key:"tokenEndpoint",get:function get(){return this.issuer+"/oauth2/token";}},{key:"logoutEndpoint",get:function get(){return this.issuer+"/logout";}}]);return KindeSDK;}();exports["default"]=KindeSDK;