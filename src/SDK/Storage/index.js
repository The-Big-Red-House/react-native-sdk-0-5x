/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1.1.0
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import BaseStore from './base';

/**
 * The Storage SDK module.
 * @module SDK/Storage
 * @version 1.1.0
 */

class Storage extends BaseStore {
    constructor() {
        super();
    }

    getAccessToken() {
        return this.getItem('accessToken');
    }

    setAccessToken(newAccessToken) {
        return this.setItem('accessToken', this.convertString(newAccessToken));
    }

    getIdToken() {
        return this.getItem('id_token');
    }

    setIdToken(newIdToken) {
        return this.setItem('id_token', this.convertString(newIdToken));
    }

    getExpiredAt() {
        return this.getItem('expired_at');
    }

    setExpiredAt(expiredAt) {
        return this.setItem('expired_at', expiredAt || 0);
    }

    getState() {
        return this.getItem('state');
    }

    setState(newState) {
        return this.setItem('state', this.convertString(newState));
    }

    getCodeVerifier() {
        return this.getItem('codeVerifier');
    }

    setCodeVerifier(newCodeVerifier) {
        return this.setItem(
            'codeVerifier',
            this.convertString(newCodeVerifier)
        );
    }

    getAuthStatus() {
        return this.getItem('authStatus');
    }

    setAuthStatus(newAuthStatus) {
        return this.setItem('authStatus', this.convertString(newAuthStatus));
    }

    getUserProfile() {
        const userProfile = this.getItem('userProfile');
        return userProfile && !['undefined', 'null'].includes(userProfile)
            ? JSON.parse(userProfile)
            : null;
    }

    setUserProfile(newUserProfile) {
        return this.setItem('userProfile', this.convertString(newUserProfile));
    }

    convertString(str) {
        return typeof str === 'string' ? str : JSON.stringify(str);
    }
}
const sessionStorage = (global.sessionStorage =
    global.sessionStorage ?? new Storage());

export default sessionStorage;
