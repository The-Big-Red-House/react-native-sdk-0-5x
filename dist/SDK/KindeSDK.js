var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _Utils=require("./Utils");var _urlParse=_interopRequireDefault(require("url-parse"));var _reactNative=require("react-native");var _AuthorizationCode=_interopRequireDefault(require("./OAuth/AuthorizationCode"));var _Storage=_interopRequireDefault(require("./Storage"));var _authStatus2=_interopRequireDefault(require("./constants/auth-status.constants"));var _unauthenticated=require("../common/exceptions/unauthenticated.exception");var _jwtDecode=_interopRequireDefault(require("jwt-decode"));var _unexpected=require("../common/exceptions/unexpected.exception");var KindeSDK=function(){function KindeSDK(issuer,redirectUri,clientId,logoutRedirectUri){var scope=arguments.length>4&&arguments[4]!==undefined?arguments[4]:'openid profile email offline';var additionalParameters=arguments.length>5&&arguments[5]!==undefined?arguments[5]:{};(0,_classCallCheck2["default"])(this,KindeSDK);this.issuer=issuer;(0,_Utils.checkNotNull)(this.issuer,'Issuer');this.redirectUri=redirectUri;(0,_Utils.checkNotNull)(this.redirectUri,'Redirect URI');this.clientId=clientId;(0,_Utils.checkNotNull)(this.clientId,'Client Id');this.logoutRedirectUri=logoutRedirectUri;(0,_Utils.checkNotNull)(this.logoutRedirectUri,'Logout Redirect URI');this.additionalParameters=(0,_Utils.checkAdditionalParameters)(additionalParameters);this.scope=scope;this.clientSecret='';this.authStatus=_authStatus2["default"].UNAUTHENTICATED;}(0,_createClass2["default"])(KindeSDK,[{key:"login",value:function login(){var additionalParameters=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};(0,_Utils.checkAdditionalParameters)(additionalParameters);this.cleanUp();var auth=new _AuthorizationCode["default"]();this.updateAuthStatus(_authStatus2["default"].AUTHENTICATING);var additionalParametersMerged=Object.assign({},this.additionalParameters,additionalParameters);return auth.login(this,true,'login',additionalParametersMerged);}},{key:"getToken",value:function(){var _getToken=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(){var url,token,_formData,URLParsed,_URLParsed$query,code,error,error_description,msg,formData,state,codeVerifier,_args=arguments;return _regenerator["default"].wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:url=_args.length>0&&_args[0]!==undefined?_args[0]:null;_context.next=3;return _Storage["default"].getToken();case 3:token=_context.sent;if(!(token&&!url)){_context.next=13;break;}if(!this.isAuthenticated){_context.next=7;break;}return _context.abrupt("return",token);case 7:_formData=new FormData();_formData.append('client_id',this.clientId);_formData.append('client_secret',this.clientSecret);_formData.append('grant_type','refresh_token');_formData.append('refresh_token',token.refresh_token);return _context.abrupt("return",this.fetchToken(_formData));case 13:if(!this.checkIsUnAuthenticated()){_context.next=15;break;}throw new _unauthenticated.UnAuthenticatedException();case 15:(0,_Utils.checkNotNull)(url,'URL');URLParsed=(0,_urlParse["default"])(url,true);_URLParsed$query=URLParsed.query,code=_URLParsed$query.code,error=_URLParsed$query.error,error_description=_URLParsed$query.error_description;if(!error){_context.next=21;break;}msg=error_description?error_description:error;throw new _unauthenticated.UnAuthenticatedException(msg);case 21:(0,_Utils.checkNotNull)(code,'code');formData=new FormData();formData.append('code',code);formData.append('client_id',this.clientId);formData.append('client_secret',this.clientSecret);formData.append('grant_type','authorization_code');formData.append('redirect_uri',this.redirectUri);state=_Storage["default"].getState();if(state){formData.append('state',state);}codeVerifier=_Storage["default"].getCodeVerifier();if(codeVerifier){formData.append('code_verifier',codeVerifier);}return _context.abrupt("return",this.fetchToken(formData));case 33:case"end":return _context.stop();}}},_callee,this);}));function getToken(){return _getToken.apply(this,arguments);}return getToken;}()},{key:"fetchToken",value:function fetchToken(formData){var _this=this;return new Promise(function(){var _ref=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2(resolve,reject){var response,dataResponse;return _regenerator["default"].wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return fetch(_this.tokenEndpoint,{method:'POST',headers:{'Content-Type':'multipart/form-data'},body:formData});case 2:response=_context2.sent;_context2.next=5;return response.json();case 5:dataResponse=_context2.sent;if(!dataResponse.error){_context2.next=9;break;}reject(dataResponse);return _context2.abrupt("return");case 9:_context2.next=11;return _Storage["default"].setToken(dataResponse);case 11:_this.updateAuthStatus(_authStatus2["default"].AUTHENTICATED);resolve(dataResponse);case 13:case"end":return _context2.stop();}}},_callee2);}));return function(_x,_x2){return _ref.apply(this,arguments);};}());}},{key:"register",value:function register(){var additionalParameters=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};(0,_Utils.checkAdditionalParameters)(additionalParameters);var auth=new _AuthorizationCode["default"]();this.updateAuthStatus(_authStatus2["default"].AUTHENTICATING);return auth.login(this,true,'registration',additionalParameters);}},{key:"createOrg",value:function createOrg(){var additionalParameters=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return this.register(Object.assign({is_create_org:true},additionalParameters));}},{key:"logout",value:function logout(){this.cleanUp();var URLParsed=(0,_urlParse["default"])(this.logoutEndpoint,true);URLParsed.query['redirect']=this.logoutRedirectUri;return _reactNative.Linking.openURL(URLParsed.toString());}},{key:"cleanUp",value:function(){var _cleanUp=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(){return _regenerator["default"].wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:this.updateAuthStatus(_authStatus2["default"].UNAUTHENTICATED);return _context3.abrupt("return",_Storage["default"].clearAll());case 2:case"end":return _context3.stop();}}},_callee3,this);}));function cleanUp(){return _cleanUp.apply(this,arguments);}return cleanUp;}()},{key:"updateAuthStatus",value:function updateAuthStatus(_authStatus){this.authStatus=_authStatus;_Storage["default"].setAuthStatus(this.authStatus);}},{key:"checkIsUnAuthenticated",value:function checkIsUnAuthenticated(){var authStatusStorage=_Storage["default"].getAuthStatus();if((!this.authStatus||this.authStatus===_authStatus2["default"].UNAUTHENTICATED)&&(!authStatusStorage||authStatusStorage===_authStatus2["default"].UNAUTHENTICATED)){return true;}return false;}},{key:"getUserDetails",value:function(){var _getUserDetails=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(){return _regenerator["default"].wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:return _context4.abrupt("return",_Storage["default"].getUserProfile());case 1:case"end":return _context4.stop();}}},_callee4);}));function getUserDetails(){return _getUserDetails.apply(this,arguments);}return getUserDetails;}()},{key:"getClaims",value:function(){var _getClaims=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee5(){var tokenType,token,_args5=arguments;return _regenerator["default"].wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:tokenType=_args5.length>0&&_args5[0]!==undefined?_args5[0]:'accessToken';if(['accessToken','id_token'].includes(tokenType)){_context5.next=3;break;}throw new _unexpected.UnexpectedException('tokenType');case 3:_context5.next=5;return _Storage["default"].getTokenType(tokenType);case 5:token=_context5.sent;if(token){_context5.next=8;break;}throw new _unauthenticated.UnAuthenticatedException();case 8:return _context5.abrupt("return",(0,_jwtDecode["default"])(token));case 9:case"end":return _context5.stop();}}},_callee5);}));function getClaims(){return _getClaims.apply(this,arguments);}return getClaims;}()},{key:"getClaim",value:function(){var _getClaim=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee6(keyName){var tokenType,_args6=arguments;return _regenerator["default"].wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:tokenType=_args6.length>1&&_args6[1]!==undefined?_args6[1]:'accessToken';return _context6.abrupt("return",this.getClaims(tokenType)[keyName]);case 2:case"end":return _context6.stop();}}},_callee6,this);}));function getClaim(_x3){return _getClaim.apply(this,arguments);}return getClaim;}()},{key:"getPermissions",value:function(){var _getPermissions=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee7(){var claims;return _regenerator["default"].wrap(function _callee7$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:_context7.next=2;return this.getClaims();case 2:claims=_context7.sent;return _context7.abrupt("return",{orgCode:claims['org_code'],permissions:claims['permissions']});case 4:case"end":return _context7.stop();}}},_callee7,this);}));function getPermissions(){return _getPermissions.apply(this,arguments);}return getPermissions;}()},{key:"getPermission",value:function(){var _getPermission=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee8(permission){var allClaims,permissions;return _regenerator["default"].wrap(function _callee8$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:_context8.next=2;return this.getClaims();case 2:allClaims=_context8.sent;permissions=allClaims['permissions'];return _context8.abrupt("return",{orgCode:allClaims['org_code'],isGranted:permissions===null||permissions===void 0?void 0:permissions.includes(permission)});case 5:case"end":return _context8.stop();}}},_callee8,this);}));function getPermission(_x4){return _getPermission.apply(this,arguments);}return getPermission;}()},{key:"getOrganization",value:function(){var _getOrganization=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee9(){var orgCode;return _regenerator["default"].wrap(function _callee9$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:_context9.next=2;return this.getClaim('org_code');case 2:orgCode=_context9.sent;return _context9.abrupt("return",{orgCode:orgCode});case 4:case"end":return _context9.stop();}}},_callee9,this);}));function getOrganization(){return _getOrganization.apply(this,arguments);}return getOrganization;}()},{key:"getUserOrganizations",value:function(){var _getUserOrganizations=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee10(){var orgCodes;return _regenerator["default"].wrap(function _callee10$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:_context10.next=2;return this.getClaim('org_codes','id_token');case 2:orgCodes=_context10.sent;return _context10.abrupt("return",{orgCodes:orgCodes});case 4:case"end":return _context10.stop();}}},_callee10,this);}));function getUserOrganizations(){return _getUserOrganizations.apply(this,arguments);}return getUserOrganizations;}()},{key:"isAuthenticated",get:function get(){return(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee11(){var timeExpired,now;return _regenerator["default"].wrap(function _callee11$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:_context11.next=2;return _Storage["default"].getExpiredAt();case 2:timeExpired=_context11.sent;now=new Date().getTime();return _context11.abrupt("return",timeExpired*1000>now);case 5:case"end":return _context11.stop();}}},_callee11);}))();}},{key:"authorizationEndpoint",get:function get(){return this.issuer+"/oauth2/auth";}},{key:"tokenEndpoint",get:function get(){return this.issuer+"/oauth2/token";}},{key:"logoutEndpoint",get:function get(){return this.issuer+"/logout";}}]);return KindeSDK;}();exports["default"]=KindeSDK;