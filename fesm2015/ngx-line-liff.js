import * as i0 from '@angular/core';
import { Injectable, Inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { ReplaySubject, AsyncSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import liff from '@line/liff';

class NgxLineLiffService {
    constructor(config) {
        this.providers = new Map();
        this.autoLogin = false;
        this._user = null;
        this._authState = new ReplaySubject(1);
        /* Consider making this an enum comprising LOADING, LOADED, FAILED etc. */
        this.initialized = false;
        this._initState = new AsyncSubject();
        if (config instanceof Promise) {
            config.then(config => this.initialize(config));
        }
        else {
            this.initialize(config);
        }
    }
    /** An `Observable` that one can subscribe to get the current logged in user information */
    get authState() {
        return this._authState.asObservable();
    }
    /** An `Observable` to communicate the readiness of the service and associated login providers */
    get initState() {
        return this._initState.asObservable();
    }
    initialize(config) {
        this.autoLogin = (config.autoLogin !== undefined) ? config.autoLogin : false;
        const { onError = console.error } = config;
        config.providers.forEach(item => this.providers.set(item.id, item.provider));
        Promise.all(Array.from(this.providers.values()).map(provider => provider.initialize())).then((provide) => {
            if (this.autoLogin) {
                const loginStatusPromises = new Array();
                let loggedIn = false;
                this.providers.forEach((provider, key) => {
                    let promise = provider.getLoginStatus();
                    loginStatusPromises.push(promise);
                    promise.then((user) => {
                        this._user = user;
                        this._authState.next(user);
                        loggedIn = true;
                    }).catch(console.debug);
                });
                Promise.all(loginStatusPromises).catch(() => {
                    if (!loggedIn) {
                        this._user = null;
                        this._authState.next(null);
                    }
                });
            }
        }).catch(err => {
            onError(err);
        }).finally(() => {
            this.initialized = true;
            this._initState.next(this.initialized);
            this._initState.complete();
        });
    }
    getLoginStatus() {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
            }
            else {
                const providerObj = this.providers.get('LINE');
                if (providerObj) {
                    providerObj.getLoginStatus().then(user => {
                        this._user = user;
                        this._authState.next(user);
                        resolve(user);
                    }, err => reject(err)).catch(err => reject(err));
                }
                else {
                    reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    /**
     * A method used to sign in a user with a specific `LoginProvider`.
     * @param signInOption Optional `LoginProvider` specific arguments
     * @returns A `Promise` that resolves to the authenticated user information
     */
    signIn(signInOption) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
            }
            else {
                let providerObj = this.providers.get('LINE');
                if (providerObj) {
                    providerObj.signIn(signInOption).then((user) => {
                        this._user = user;
                        this._authState.next(user);
                        resolve(user);
                    }).catch(err => reject(err));
                }
                else {
                    reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    /**
     * A method used to sign out the currently loggen in user.
     * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
     */
    signOut() {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
            }
            else if (!this._user) {
                reject(NgxLineLiffService.ERR_NOT_LOGGED_IN);
            }
            else {
                const providerObj = this.providers.get('LINE');
                if (providerObj) {
                    providerObj.signOut().then(() => {
                        resolve();
                        this._user = null;
                        this._authState.next(null);
                    }).catch(err => reject(err));
                }
                else {
                    reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    /**
     * A method used to get provider core.
     * @returns A `Promise` that resolves to the provider core
     */
    providerCore() {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
            }
            else if (!this._user) {
                reject(NgxLineLiffService.ERR_NOT_LOGGED_IN);
            }
            else {
                const providerObj = this.providers.get('LINE');
                if (providerObj) {
                    providerObj.providerCore().then(providerCore => resolve(providerCore)).catch(err => reject(err));
                }
                else {
                    reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
}
NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
NgxLineLiffService.ERR_NOT_LOGGED_IN = 'Not logged in';
NgxLineLiffService.ERR_NOT_INITIALIZED = 'Login providers not ready yet. Are there errors on your console?';
NgxLineLiffService.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN = 'Chosen login provider is not supported for refreshing a token';
NgxLineLiffService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffService, deps: [{ token: 'LineLiffServiceConfig' }], target: i0.ɵɵFactoryTarget.Injectable });
NgxLineLiffService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['LineLiffServiceConfig']
                }] }]; } });

class NgxLineLiffModule {
    constructor(parentModule) {
        if (parentModule)
            throw new Error('NgxLineLiffModule is already loaded. Import it in the AppModule only');
    }
    static initialize(config) {
        return {
            ngModule: NgxLineLiffModule,
            providers: [
                NgxLineLiffService,
                { provide: 'LineLiffServiceConfig', useValue: config }
            ]
        };
    }
}
NgxLineLiffModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, deps: [{ token: NgxLineLiffModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
NgxLineLiffModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, imports: [CommonModule] });
NgxLineLiffModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, providers: [
        NgxLineLiffService
    ], imports: [[
            CommonModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                    ],
                    providers: [
                        NgxLineLiffService
                    ]
                }]
        }], ctorParameters: function () { return [{ type: NgxLineLiffModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });

class BaseLoginProvider {
    constructor() { }
    loadScript(id, src, onload, parentElement) {
        // get document if platform is only browser
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            const signInJs = document.createElement('script');
            signInJs.async = true;
            signInJs.src = src;
            signInJs.onload = onload;
            if (!parentElement)
                parentElement = document.head;
            parentElement.appendChild(signInJs);
        }
    }
}

class LineLiffLoginProvider extends BaseLoginProvider {
    constructor(channelId, initIptions = {}) {
        super();
        this.channelId = channelId;
        this.initIptions = initIptions;
    }
    initialize() {
        return new Promise((resolve, reject) => {
            var _a;
            try {
                if (!((_a = this.initIptions) === null || _a === void 0 ? void 0 : _a.liffId)) {
                    reject(LineLiffLoginProvider.ERR_LIFF_ID_NOT_FOUND);
                }
                else {
                    // this.loadScript(
                    //     LineLiffLoginProvider.PROVIDER_ID,
                    //     'https://static.line-scdn.net/liff/edge/versions/2.14.0/sdk.js',
                    //     () => {
                    //         liff.init({ liffId: String(this.initIptions.liffId) }).then(() => {
                    //             this.OS = liff.getOS();
                    //             if (liff.isLoggedIn()) liff.getProfile().then((profile: LineProfile) => this.profile = profile, (err: any) => reject(err)).catch(console.error);
                    //             resolve();
                    //         }).catch(console.error);
                    //     }
                    // );
                    liff.init({ liffId: this.initIptions.liffId }).then(() => {
                        this.OS = liff.getOS();
                        if (liff.isLoggedIn())
                            liff.getProfile().then(profile => this.profile = profile).catch(console.error);
                        resolve(liff);
                    }).catch(console.error);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getLoginStatus(loginStatusOption) {
        return new Promise((resolve, reject) => {
            if (liff.isLoggedIn()) {
                liff.init({ liffId: String(this.initIptions.liffId) }).then(() => {
                    liff.getProfile().then((profile) => {
                        this.profile = profile;
                        resolve(profile);
                    }, (err) => reject(err)).catch(console.error);
                }).catch(console.error);
            }
            else {
                reject(null);
            }
        });
    }
    signIn(signInOption) {
        return new Promise((resolve, reject) => {
            try {
                if (liff.isLoggedIn()) {
                    liff.getProfile().then((profile) => {
                        this.profile = profile;
                        resolve(profile);
                    }, (err) => reject(err)).catch(console.error);
                }
                else if (signInOption === null || signInOption === void 0 ? void 0 : signInOption.redirectUri) {
                    liff.init({ liffId: String(this.initIptions.liffId) }).then(() => {
                        liff.login({ redirectUri: signInOption.redirectUri });
                    }).catch(console.error);
                }
                else {
                    liff.init({ liffId: String(this.initIptions.liffId) }).then(() => {
                        liff.login();
                    }).catch(console.error);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    signOut(revoke) {
        return new Promise((resolve, reject) => {
            try {
                if (liff.isLoggedIn()) {
                    liff.init({ liffId: String(this.initIptions.liffId) }).then(() => {
                        resolve();
                        liff.logout();
                    }).catch(console.error);
                }
                else {
                    resolve();
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /** Running in LIFF browser only. */
    providerCore() {
        return new Promise((resolve, reject) => {
            try {
                if (liff.isInClient()) {
                    resolve(liff);
                }
                else {
                    reject('Running in LIFF browser only.');
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
LineLiffLoginProvider.PROVIDER_ID = 'LINE';
LineLiffLoginProvider.ERR_LIFF_ID_NOT_FOUND = 'LIFF ID is not found.';

/*
 * Public API Surface of ngx-line-liff
 */

/**
 * Generated bundle index. Do not edit.
 */

export { LineLiffLoginProvider, NgxLineLiffModule, NgxLineLiffService };
//# sourceMappingURL=ngx-line-liff.js.map
