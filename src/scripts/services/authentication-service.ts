import { injectable } from 'inversify';

export interface IAuthenticationService {
    isAuthenticated: boolean;
    signIn(originalUrl: string): Promise<void>;
}

@injectable()
export class AuthenticationService implements IAuthenticationService {
    public isAuthenticated: boolean = false;
    public signIn(originalUrl: string): Promise<void> {
        return Promise.reject();
    }
}
