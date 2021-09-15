import { LineProfile } from "./line-profile";
import { LoginProvider } from "./login-provider";
export declare abstract class BaseLoginProvider implements LoginProvider {
    constructor();
    abstract initialize(): Promise<void | any>;
    abstract getLoginStatus(loginStatusOption?: any): Promise<LineProfile>;
    abstract signIn(signInOption?: any): Promise<LineProfile>;
    abstract signOut(revoke?: boolean): Promise<void>;
    abstract providerCore(): Promise<any>;
    protected loadScript(id: string, src: string, onload: any, parentElement?: any): void;
}
