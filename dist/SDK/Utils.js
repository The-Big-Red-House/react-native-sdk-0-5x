var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _cryptoJs=_interopRequireDefault(require("crypto-js"));function base64URLEncode(str){return str.toString(_cryptoJs["default"].enc.Base64).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');}function sha256(buffer){return _cryptoJs["default"].SHA256(buffer).toString(_cryptoJs["default"].enc.Base64);}function generateRandomString(){var byteLength=arguments.length>0&&arguments[0]!==undefined?arguments[0]:32;return base64URLEncode(_cryptoJs["default"].lib.WordArray.random(byteLength));}function generateChallenge(){var state=generateRandomString();var codeVerifier=generateRandomString();var codeChallenge=base64URLEncode(sha256(codeVerifier));return{state:state,codeVerifier:codeVerifier,codeChallenge:codeChallenge};}function checkNotNull(reference,name){if(reference===null||reference===undefined){throw new Error(name+" cannot be empty");}return reference;}module.exports={generateRandomString:generateRandomString,generateChallenge:generateChallenge,checkNotNull:checkNotNull};