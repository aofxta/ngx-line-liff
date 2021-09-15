import { Observable } from 'rxjs';
import { LineProfile } from './entities/line-profile';
import { LoginProvider } from './entities/login-provider';
import * as i0 from "@angular/core";
/**
 * An interface to define the shape of the service configuration options.
 */
export interface LineLiffServiceConfig {
    autoLogin?: boolean;
    providers: {
        id: string;
        provider: LoginProvider;
    }[];
    onError?: (error: any) => any;
}
export declare class NgxLineLiffService {
    private static readonly ERR_LOGIN_PROVIDER_NOT_FOUND;
    private static readonly ERR_NOT_LOGGED_IN;
    private static readonly ERR_NOT_INITIALIZED;
    private static readonly ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN;
    private providers;
    private autoLogin;
    private _user;
    private _authState;
    private initialized;
    private _initState;
    /** An `Observable` that one can subscribe to get the current logged in user information */
    get authState(): Observable<LineProfile | null>;
    /** An `Observable` to communicate the readiness of the service and associated login providers */
    get initState(): Observable<boolean>;
    constructor(config: LineLiffServiceConfig | Promise<LineLiffServiceConfig>);
    private initialize;
    getLoginStatus(): Promise<LineProfile>;
    /**
     * A method used to sign in a user with a specific `LoginProvider`.
     * @param signInOption Optional `LoginProvider` specific arguments
     * @returns A `Promise` that resolves to the authenticated user information
     */
    signIn(signInOption?: {
        redirectUri?: string;
    }): Promise<LineProfile>;
    /**
     * A method used to sign out the currently loggen in user.
     * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
     */
    signOut(): Promise<void>;
    /**
     * A method used to get provider core.
     * @returns A `Promise` that resolves to the provider core
     */
    providerCore(): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxLineLiffService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxLineLiffService>;
}
