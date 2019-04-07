import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES, IPage, NavigationRejectionReason, SERVICE_TYPES } from '../constructs';
import { IRouter, IRouterRequest } from '../infrastructure';
import { IAuthenticationService, IPageContentService } from '../services';
import { BasePage } from './base-page';

@injectable()
export class ErrorPage extends BasePage implements IPage {
    public readonly requiresAuthentication: boolean = false;

    protected viewName: string = 'error.partial';
    protected bodyClasses: string[];

    constructor(
        @inject(SERVICE_TYPES.PageContentService) pageContentService: IPageContentService,
        @inject(INFRASTRUCTURE_TYPES.Router) router: IRouter,
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService,
    ) {
        super(pageContentService, router);
    }

    public canNavigateTo(): Promise<void> {
        return Promise.resolve();
    }

    public canNavigateFrom(): Promise<void> {
        return Promise.resolve();
    }

    protected loadAndProcessPageData(req: IRouterRequest): Promise<void> {
        if (req.navigationRejection) {
            if (req.navigationRejection.navigationRejectionReason === NavigationRejectionReason.loginBack) {
                if (sessionStorage.getItem('sign-in-attempted')) {
                    sessionStorage.removeItem('sign-in-attempted');
                }
            }
            if (req.navigationRejection.navigationRejectionReason === NavigationRejectionReason.notAuthenticated) {
                this.authenticationService.signIn(req.path);
            }
        }
        return Promise.resolve();
    }
}
