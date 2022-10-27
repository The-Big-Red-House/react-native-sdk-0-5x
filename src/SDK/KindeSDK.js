import { checkNotNull } from './Utils';
import Url from 'url-parse';
import { Linking } from 'react-native';
import Storage from './Storage';
import AuthorizationCode from './OAuth/AuthorizationCode';

export default class KindeSDK extends Storage {
    constructor(
        issuer,
        redirectUri,
        clientId,
        logoutRedirectUri,
        scope = 'openid offline'
    ) {
        super();
        this.issuer = issuer;
        checkNotNull(this.issuer, 'Issuer');

        this.redirectUri = redirectUri;
        checkNotNull(this.redirectUri, 'Redirect URI');

        this.clientId = clientId;
        checkNotNull(this.clientId, 'Client Id');

        this.logoutRedirectUri = logoutRedirectUri;
        checkNotNull(this.logoutRedirectUri, 'Logout Redirect URI');

        this.scope = scope;

        this.clientSecret = '';
    }

    async login() {
        await this.cleanUp();
        const auth = new AuthorizationCode();
        return auth.login(this, true);
    }

    getToken(url) {
        return new Promise(async (resolve, reject) => {
            try {
                checkNotNull(url, 'URL');
                const URLParsed = Url(url, true);
                const { code, error, error_description } = URLParsed.query;
                checkNotNull(code, 'code');
                if (error) {
                    const msg = error_description ? error_description : error;
                    reject(msg);
                }
                const formData = new FormData();
                formData.append('code', code);
                formData.append('client_id', this.clientId);
                formData.append('client_secret', this.clientSecret);
                formData.append('grant_type', 'authorization_code');
                formData.append('redirect_uri', this.redirectUri);
                const state = await this.getState();
                if (state) {
                    formData.append('state', state);
                }
                const codeVerifier = await this.getCodeVerifier();
                if (codeVerifier) {
                    formData.append('code_verifier', codeVerifier);
                }
                const that = this;
                fetch(this.tokenEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        if (responseJson.error) {
                            return reject(responseJson);
                        }
                        await that.setAccessToken(responseJson.access_token);
                        resolve(responseJson);
                    })
                    .catch((err) => {
                        reject(err.response.data);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    register() {
        const auth = new AuthorizationCode();
        return auth.login(this, true, 'registration');
    }

    logout() {
        this.cleanUp();
        const URLParsed = Url(this.logoutEndpoint, true);
        URLParsed.query['redirect'] = this.logoutRedirectUri;
        Linking.openURL(URLParsed.toString());
    }

    async cleanUp() {
        return Promise.all([
            this.setState(''),
            this.setAccessToken(''),
            this.setCodeVerifier('')
        ]);
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
