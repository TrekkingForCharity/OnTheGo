import { EventBus } from 'eventbus-ts';
import { inject, injectable } from 'inversify';
import { User, UserManager } from 'oidc-client';
import { INFRASTRUCTURE_TYPES } from '../constructs';
import { AuthEvent } from '../events';
import { IStorageProvider } from '../infrastructure';

export interface IAuthenticationService {
    isAuthenticated(): Promise<void>;
    handleSignInCallback(): Promise<string>;
    signIn(originalUrl?: string): Promise<any>;
    signOut(): Promise<void>;
}

@injectable()
export class AuthenticationService implements IAuthenticationService {
    constructor(
        @inject(INFRASTRUCTURE_TYPES.UserManager) private userManager: UserManager,
        @inject(INFRASTRUCTURE_TYPES.SessionStorageProvider) private sessionStorageProvider: IStorageProvider,
        @inject(INFRASTRUCTURE_TYPES.EventBus) private eventBus: EventBus,
    ) {
    }

    public signIn(originalUrl: string = '/home'): Promise<any> {
        this.sessionStorageProvider.setItem('pre-login-url', originalUrl);
        return this.userManager.signinRedirect({state: 'some data'});
    }

    public signOut(): Promise<void> {
        this.eventBus.post(new AuthEvent(false));
        return this.userManager.removeUser();
    }

    public handleSignInCallback(): Promise<string> {
        return this.userManager.signinRedirectCallback().then((user) => {
            const preLogonUrl = this.sessionStorageProvider.getItem('pre-login-url');
            this.sessionStorageProvider.removeItem('pre-login-url');
            this.eventBus.post(new AuthEvent(true));
            return preLogonUrl;
        });
    }

    public isAuthenticated(): Promise<void> {
        return this.userManager.getUser().then((user: User) => {
            if (user) {
                return Promise.resolve();
            }
            return Promise.reject();
        });
    }
}
