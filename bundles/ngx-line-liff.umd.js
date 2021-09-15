(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common'), require('@line/liff')) :
    typeof define === 'function' && define.amd ? define('ngx-line-liff', ['exports', '@angular/core', 'rxjs', '@angular/common', '@line/liff'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-line-liff'] = {}, global.ng.core, global.rxjs, global.ng.common, global.liff));
}(this, (function (exports, i0, rxjs, common, liff) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var liff__default = /*#__PURE__*/_interopDefaultLegacy(liff);

    var NgxLineLiffService = /** @class */ (function () {
        function NgxLineLiffService(config) {
            var _this = this;
            this.providers = new Map();
            this.autoLogin = false;
            this._user = null;
            this._authState = new rxjs.ReplaySubject(1);
            /* Consider making this an enum comprising LOADING, LOADED, FAILED etc. */
            this.initialized = false;
            this._initState = new rxjs.AsyncSubject();
            if (config instanceof Promise) {
                config.then(function (config) { return _this.initialize(config); });
            }
            else {
                this.initialize(config);
            }
        }
        Object.defineProperty(NgxLineLiffService.prototype, "authState", {
            /** An `Observable` that one can subscribe to get the current logged in user information */
            get: function () {
                return this._authState.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgxLineLiffService.prototype, "initState", {
            /** An `Observable` to communicate the readiness of the service and associated login providers */
            get: function () {
                return this._initState.asObservable();
            },
            enumerable: false,
            configurable: true
        });
        NgxLineLiffService.prototype.initialize = function (config) {
            var _this = this;
            this.autoLogin = (config.autoLogin !== undefined) ? config.autoLogin : false;
            var _a = config.onError, onError = _a === void 0 ? console.error : _a;
            config.providers.forEach(function (item) { return _this.providers.set(item.id, item.provider); });
            Promise.all(Array.from(this.providers.values()).map(function (provider) { return provider.initialize(); })).then(function (provide) {
                if (_this.autoLogin) {
                    var loginStatusPromises_1 = new Array();
                    var loggedIn_1 = false;
                    _this.providers.forEach(function (provider, key) {
                        var promise = provider.getLoginStatus();
                        loginStatusPromises_1.push(promise);
                        promise.then(function (user) {
                            _this._user = user;
                            _this._authState.next(user);
                            loggedIn_1 = true;
                        }).catch(console.debug);
                    });
                    Promise.all(loginStatusPromises_1).catch(function () {
                        if (!loggedIn_1) {
                            _this._user = null;
                            _this._authState.next(null);
                        }
                    });
                }
            }).catch(function (err) {
                onError(err);
            }).finally(function () {
                _this.initialized = true;
                _this._initState.next(_this.initialized);
                _this._initState.complete();
            });
        };
        NgxLineLiffService.prototype.getLoginStatus = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.initialized) {
                    reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
                }
                else {
                    var providerObj = _this.providers.get('LINE');
                    if (providerObj) {
                        providerObj.getLoginStatus().then(function (user) {
                            _this._user = user;
                            _this._authState.next(user);
                            resolve(user);
                        }, function (err) { return reject(err); }).catch(function (err) { return reject(err); });
                    }
                    else {
                        reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            });
        };
        /**
         * A method used to sign in a user with a specific `LoginProvider`.
         * @param signInOption Optional `LoginProvider` specific arguments
         * @returns A `Promise` that resolves to the authenticated user information
         */
        NgxLineLiffService.prototype.signIn = function (signInOption) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.initialized) {
                    reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
                }
                else {
                    var providerObj = _this.providers.get('LINE');
                    if (providerObj) {
                        providerObj.signIn(signInOption).then(function (user) {
                            _this._user = user;
                            _this._authState.next(user);
                            resolve(user);
                        }).catch(function (err) { return reject(err); });
                    }
                    else {
                        reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            });
        };
        /**
         * A method used to sign out the currently loggen in user.
         * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
         */
        NgxLineLiffService.prototype.signOut = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.initialized) {
                    reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
                }
                else if (!_this._user) {
                    reject(NgxLineLiffService.ERR_NOT_LOGGED_IN);
                }
                else {
                    var providerObj = _this.providers.get('LINE');
                    if (providerObj) {
                        providerObj.signOut().then(function () {
                            resolve();
                            _this._user = null;
                            _this._authState.next(null);
                        }).catch(function (err) { return reject(err); });
                    }
                    else {
                        reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            });
        };
        /**
         * A method used to get provider core.
         * @returns A `Promise` that resolves to the provider core
         */
        NgxLineLiffService.prototype.providerCore = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!_this.initialized) {
                    reject(NgxLineLiffService.ERR_NOT_INITIALIZED);
                }
                else if (!_this._user) {
                    reject(NgxLineLiffService.ERR_NOT_LOGGED_IN);
                }
                else {
                    var providerObj = _this.providers.get('LINE');
                    if (providerObj) {
                        providerObj.providerCore().then(function (providerCore) { return resolve(providerCore); }).catch(function (err) { return reject(err); });
                    }
                    else {
                        reject(NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            });
        };
        return NgxLineLiffService;
    }());
    NgxLineLiffService.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
    NgxLineLiffService.ERR_NOT_LOGGED_IN = 'Not logged in';
    NgxLineLiffService.ERR_NOT_INITIALIZED = 'Login providers not ready yet. Are there errors on your console?';
    NgxLineLiffService.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN = 'Chosen login provider is not supported for refreshing a token';
    NgxLineLiffService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffService, deps: [{ token: 'LineLiffServiceConfig' }], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    NgxLineLiffService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffService });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffService, decorators: [{
                type: i0.Injectable
            }], ctorParameters: function () {
            return [{ type: undefined, decorators: [{
                            type: i0.Inject,
                            args: ['LineLiffServiceConfig']
                        }] }];
        } });

    var NgxLineLiffModule = /** @class */ (function () {
        function NgxLineLiffModule(parentModule) {
            if (parentModule)
                throw new Error('NgxLineLiffModule is already loaded. Import it in the AppModule only');
        }
        NgxLineLiffModule.initialize = function (config) {
            return {
                ngModule: NgxLineLiffModule,
                providers: [
                    NgxLineLiffService,
                    { provide: 'LineLiffServiceConfig', useValue: config }
                ]
            };
        };
        return NgxLineLiffModule;
    }());
    NgxLineLiffModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffModule, deps: [{ token: NgxLineLiffModule, optional: true, skipSelf: true }], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    NgxLineLiffModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffModule, imports: [common.CommonModule] });
    NgxLineLiffModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffModule, providers: [
            NgxLineLiffService
        ], imports: [[
                common.CommonModule,
            ]] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0__namespace, type: NgxLineLiffModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        imports: [
                            common.CommonModule,
                        ],
                        providers: [
                            NgxLineLiffService
                        ]
                    }]
            }], ctorParameters: function () {
            return [{ type: NgxLineLiffModule, decorators: [{
                            type: i0.Optional
                        }, {
                            type: i0.SkipSelf
                        }] }];
        } });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var BaseLoginProvider = /** @class */ (function () {
        function BaseLoginProvider() {
        }
        BaseLoginProvider.prototype.loadScript = function (id, src, onload, parentElement) {
            // get document if platform is only browser
            if (typeof document !== 'undefined' && !document.getElementById(id)) {
                var signInJs = document.createElement('script');
                signInJs.async = true;
                signInJs.src = src;
                signInJs.onload = onload;
                if (!parentElement)
                    parentElement = document.head;
                parentElement.appendChild(signInJs);
            }
        };
        return BaseLoginProvider;
    }());

    var LineLiffLoginProvider = /** @class */ (function (_super) {
        __extends(LineLiffLoginProvider, _super);
        function LineLiffLoginProvider(channelId, initIptions) {
            if (initIptions === void 0) { initIptions = {}; }
            var _this = _super.call(this) || this;
            _this.channelId = channelId;
            _this.initIptions = initIptions;
            return _this;
        }
        LineLiffLoginProvider.prototype.initialize = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var _a;
                try {
                    if (!((_a = _this.initIptions) === null || _a === void 0 ? void 0 : _a.liffId)) {
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
                        liff__default['default'].init({ liffId: _this.initIptions.liffId }).then(function () {
                            _this.OS = liff__default['default'].getOS();
                            if (liff__default['default'].isLoggedIn())
                                liff__default['default'].getProfile().then(function (profile) { return _this.profile = profile; }).catch(console.error);
                            resolve(liff__default['default']);
                        }).catch(console.error);
                    }
                }
                catch (err) {
                    reject(err);
                }
            });
        };
        LineLiffLoginProvider.prototype.getLoginStatus = function (loginStatusOption) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (liff__default['default'].isLoggedIn()) {
                    liff__default['default'].init({ liffId: String(_this.initIptions.liffId) }).then(function () {
                        liff__default['default'].getProfile().then(function (profile) {
                            _this.profile = profile;
                            resolve(profile);
                        }, function (err) { return reject(err); }).catch(console.error);
                    }).catch(console.error);
                }
                else {
                    reject(null);
                }
            });
        };
        LineLiffLoginProvider.prototype.signIn = function (signInOption) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    if (liff__default['default'].isLoggedIn()) {
                        liff__default['default'].getProfile().then(function (profile) {
                            _this.profile = profile;
                            resolve(profile);
                        }, function (err) { return reject(err); }).catch(console.error);
                    }
                    else if (signInOption === null || signInOption === void 0 ? void 0 : signInOption.redirectUri) {
                        liff__default['default'].init({ liffId: String(_this.initIptions.liffId) }).then(function () {
                            liff__default['default'].login({ redirectUri: signInOption.redirectUri });
                        }).catch(console.error);
                    }
                    else {
                        liff__default['default'].init({ liffId: String(_this.initIptions.liffId) }).then(function () {
                            liff__default['default'].login();
                        }).catch(console.error);
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        LineLiffLoginProvider.prototype.signOut = function (revoke) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    if (liff__default['default'].isLoggedIn()) {
                        liff__default['default'].init({ liffId: String(_this.initIptions.liffId) }).then(function () {
                            resolve();
                            liff__default['default'].logout();
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
        };
        /** Running in LIFF browser only. */
        LineLiffLoginProvider.prototype.providerCore = function () {
            return new Promise(function (resolve, reject) {
                try {
                    if (liff__default['default'].isInClient()) {
                        resolve(liff__default['default']);
                    }
                    else {
                        reject('Running in LIFF browser only.');
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        return LineLiffLoginProvider;
    }(BaseLoginProvider));
    LineLiffLoginProvider.PROVIDER_ID = 'LINE';
    LineLiffLoginProvider.ERR_LIFF_ID_NOT_FOUND = 'LIFF ID is not found.';

    /*
     * Public API Surface of ngx-line-liff
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.LineLiffLoginProvider = LineLiffLoginProvider;
    exports.NgxLineLiffModule = NgxLineLiffModule;
    exports.NgxLineLiffService = NgxLineLiffService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-line-liff.umd.js.map
