import { inject, injectable } from 'inversify';
import { INavigationRejection, INFRASTRUCTURE_TYPES,
    IPage, NavigationRejectionReason, SERVICE_TYPES } from '../constructs';
import { IRouter, IRouterRequest, IStorageProvider } from '../infrastructure';
import { IAuthenticationService } from '../services';

@injectable()
export class SignedInPage implements IPage {
    public requiresAuthentication: boolean = false;

    protected viewName: string = 'signed-in.partial';
    protected bodyClasses: string[];

    constructor(
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService,
        @inject(INFRASTRUCTURE_TYPES.SessionStorageProvider) private sessionStorageProvider: IStorageProvider,
        @inject(INFRASTRUCTURE_TYPES.Router) private router: IRouter) {
    }

     public canNavigateTo(): Promise<void> {
        if (this.sessionStorageProvider.getItem('sign-in-attempted')) {
            const reason: INavigationRejection = {
                navigationRejectionReason: NavigationRejectionReason.loginBack,
            };
            return Promise.reject(reason);
        }

        return Promise.resolve();
    }
    public canNavigateFrom(): Promise<void> {
        return Promise.resolve();
    }

    public init(req: IRouterRequest): Promise<void> {
        const self = this;
        this.sessionStorageProvider.setItem('sign-in-attempted', '1');
        return this.authenticationService.handleSignInCallback().then((url: string) => {
            self.router.externalRedirct(url);
            return Promise.resolve();
        });
    }
}
