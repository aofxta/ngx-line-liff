import { LineProfile } from "./line-profile";
export interface LoginProvider {
    initialize(): Promise<void>;
    getLoginStatus(loginStatusOption?: any): Promise<LineProfile>;
    signIn(signInOption?: any): Promise<LineProfile>;
    signOut(revoke?: boolean): Promise<void>;
    providerCore(): Promise<any>;
}
