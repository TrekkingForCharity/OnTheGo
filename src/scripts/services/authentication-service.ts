export interface IAuthenticationService {
    isAuthenticated: boolean;
    signIn(originalUrl: string): Promise<void>;
}
