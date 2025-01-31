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

import { checkNotNull, checkAdditionalParameters } from './Utils';
import Url from 'url-parse';
import { Linking } from 'react-native';
import AuthorizationCode from './OAuth/AuthorizationCode';
import Storage from './Storage';
import authStatusConstants from './constants/auth-status.constants';
import { UnAuthenticatedException } from '../common/exceptions/unauthenticated.exception';
import jwt_decode from 'jwt-decode';
import { UnexpectedException } from '../common/exceptions/unexpected.exception';

/**
 * The KindeSDK module.
 * @module SDK/KindeSDK
 * @version 1.1.0
 */

export default class KindeSDK {
    /**
     * The constructor function takes in a bunch of parameters and sets them to the class properties
     * @param issuer - The URL of the OpenID Connect provider.
     * @param redirectUri - The URI that the user will be redirected to after a successful login.
     * @param clientId - The client ID of your application.
     * @param logoutRedirectUri - The URL to redirect to after logout.
     * @param [scope=openid profile email offline] - The scope of the access request.
     * @param [additionalParameters] - Any additional parameters you want to pass to the authorization
     * server.
     */
    constructor(
        issuer,
        redirectUri,
        clientId,
        logoutRedirectUri,
        scope = 'openid profile email offline',
        additionalParameters = {}
    ) {
        this.issuer = issuer;
        checkNotNull(this.issuer, 'Issuer');

        this.redirectUri = redirectUri;
        checkNotNull(this.redirectUri, 'Redirect URI');

        this.clientId = clientId;
        checkNotNull(this.clientId, 'Client Id');

        this.logoutRedirectUri = logoutRedirectUri;
        checkNotNull(this.logoutRedirectUri, 'Logout Redirect URI');

        this.additionalParameters =
            checkAdditionalParameters(additionalParameters);
        this.scope = scope;

        this.clientSecret = '';

        this.authStatus = authStatusConstants.UNAUTHENTICATED;
    }

    /**
     * It takes in an object, merges it with another object, and then passes it to another function
     * @param [additionalParameters] - This is an object that contains additional parameters that you
     * want to pass to the login page.
     * @returns A promise.
     */
    login(additionalParameters = {}) {
        checkAdditionalParameters(additionalParameters);
        this.cleanUp();

        const auth = new AuthorizationCode();
        this.updateAuthStatus(authStatusConstants.AUTHENTICATING);

        const additionalParametersMerged = {
            ...this.additionalParameters,
            ...additionalParameters
        };
        return auth.login(this, true, 'login', additionalParametersMerged);
    }

    /**
     * It takes a URL as an argument, parses it, and then sends a POST request to the token endpoint
     * with the code and other parameters
     * @param url - The URL that the user is redirected to after the authorization code is generated.
     * @returns A promise that resolves to a responseJson object.
     */
    getToken(url) {
        if (this.checkIsUnAuthenticated()) {
            throw new UnAuthenticatedException();
        }
        checkNotNull(url, 'URL');

        const URLParsed = Url(url, true);
        const { code, error, error_description } = URLParsed.query;
        if (error) {
            const msg = error_description ? error_description : error;
            throw new UnAuthenticatedException(msg);
        }
        checkNotNull(code, 'code');

        const formData = new FormData();
        formData.append('code', code);
        formData.append('client_id', this.clientId);
        formData.append('client_secret', this.clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', this.redirectUri);
        const state = Storage.getState();
        if (state) {
            formData.append('state', state);
        }
        const codeVerifier = Storage.getCodeVerifier();
        if (codeVerifier) {
            formData.append('code_verifier', codeVerifier);
        }

        return new Promise(async (resolve, reject) => {
            const response = await fetch(this.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            });

            const dataResponse = await response.json();
            if (dataResponse.error) {
                reject(dataResponse);
                return;
            }

            this.saveUserDetails(dataResponse.id_token);
            Storage.setAccessToken(dataResponse.access_token);
            Storage.setIdToken(dataResponse.id_token);
            this.updateAuthStatus(authStatusConstants.AUTHENTICATED);

            const now = new Date().getTime();
            const expiredAt = now + dataResponse.expires_in * 1000;
            Storage.setExpiredAt(expiredAt);

            resolve(dataResponse);
        });
    }

    /**
     * The function takes in an object of additional parameters, checks to make sure the object is
     * valid, creates a new instance of the AuthorizationCode class, updates the auth status to
     * authenticating, and then calls the login function on the AuthorizationCode class
     * @param [additionalParameters] - This is an object that contains additional parameters that you
     * want to pass to the login page.
     * @returns A promise.
     */
    register(additionalParameters = {}) {
        checkAdditionalParameters(additionalParameters);
        const auth = new AuthorizationCode();
        this.updateAuthStatus(authStatusConstants.AUTHENTICATING);
        return auth.login(this, true, 'registration', additionalParameters);
    }

    createOrg(additionalParameters = {}) {
        return this.register({ is_create_org: true, ...additionalParameters });
    }

    /**
     * It cleans up the local storage, and then opens a URL that will log the user out of the server
     */
    logout() {
        this.cleanUp();
        const URLParsed = Url(this.logoutEndpoint, true);
        URLParsed.query['redirect'] = this.logoutRedirectUri;
        return Linking.openURL(URLParsed.toString());
    }

    cleanUp() {
        this.updateAuthStatus(authStatusConstants.UNAUTHENTICATED);
        return Storage.clear();
    }

    updateAuthStatus(_authStatus) {
        this.authStatus = _authStatus;
        Storage.setAuthStatus(this.authStatus);
    }

    checkIsUnAuthenticated() {
        const authStatusStorage = Storage.getAuthStatus();
        if (
            (!this.authStatus ||
                this.authStatus === authStatusConstants.UNAUTHENTICATED) &&
            (!authStatusStorage ||
                authStatusStorage === authStatusConstants.UNAUTHENTICATED)
        ) {
            return true;
        }
        return false;
    }

    getUserDetails() {
        return Storage.getUserProfile();
    }

    saveUserDetails(idToken) {
        if (!idToken || typeof idToken !== 'string') {
            Storage.removeItem('userProfile');
            return;
        }

        const token = jwt_decode(idToken);
        Storage.setUserProfile({
            id: token.sub,
            given_name: token.given_name,
            family_name: token.family_name,
            email: token.email
        });
    }

    getClaims(tokenType = 'accessToken') {
        if (!['accessToken', 'id_token'].includes(tokenType)) {
            throw new UnexpectedException('tokenType');
        }

        const token = Storage.getItem(tokenType);
        if (!token) {
            throw new UnAuthenticatedException();
        }

        return jwt_decode(token);
    }

    getClaim(keyName, tokenType = 'accessToken') {
        return this.getClaims(tokenType)[keyName];
    }

    getPermissions() {
        const claims = this.getClaims();
        return {
            orgCode: claims['org_code'],
            permissions: claims['permissions']
        };
    }

    getPermission(permission) {
        const allClaims = this.getClaims();
        const permissions = allClaims['permissions'];
        return {
            orgCode: allClaims['org_code'],
            isGranted: permissions?.includes(permission)
        };
    }

    getOrganization() {
        return {
            orgCode: this.getClaim('org_code')
        };
    }

    getUserOrganizations() {
        return {
            orgCodes: this.getClaim('org_codes', 'id_token')
        };
    }

    get isAuthenticated() {
        if (this.checkIsUnAuthenticated()) {
            return false;
        }

        const timeExpired = Number(Storage.getExpiredAt());
        const now = new Date().getTime();
        return timeExpired > now;
    }

    get authorizationEndpoint() {
        return `${this.issuer}/oauth2/auth`;
    }

    get tokenEndpoint() {
        return `${this.issuer}/oauth2/token`;
    }

    get logoutEndpoint() {
        return `${this.issuer}/logout`;
    }
}
