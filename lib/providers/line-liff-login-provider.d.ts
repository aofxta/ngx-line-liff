import { BaseLoginProvider } from '../entities/base-login-provider';
import { LineProfile } from '../entities/line-profile';
interface InitOptions {
    liffId?: string;
}
export declare class LineLiffLoginProvider extends BaseLoginProvider {
    private channelId;
    private initIptions;
    static readonly PROVIDER_ID: string;
    static readonly ERR_LIFF_ID_NOT_FOUND: string;
    private OS?;
    private profile?;
    protected authLiff: any;
    constructor(channelId: string, initIptions?: InitOptions);
    initialize(): Promise<void | any>;
    getLoginStatus(loginStatusOption?: any): Promise<LineProfile>;
    signIn(signInOption?: any): Promise<LineProfile>;
    signOut(revoke?: boolean): Promise<void>;
    /** Running in LIFF browser only. */
    providerCore(): Promise<any>;
}
export {};
