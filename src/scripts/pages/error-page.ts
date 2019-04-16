import { inject, injectable } from 'inversify';
import { INavigationRejection, INFRASTRUCTURE_TYPES, IPage,
    NavigationRejectionReason, SERVICE_TYPES  } from '../constructs';
import { IRouter, IRouterRequest, IStorageProvider } from '../infrastructure';
import { IAuthenticationService, IPageContentService } from '../services';
import { BasePage } from './base-page';

@injectable()
export class ErrorPage extends BasePage implements IPage {
    public readonly requiresAuthentication: boolean = false;

    protected viewName: string = 'error.partial';
    protected bodyClasses: string[];

    private navigationRejection: INavigationRejection;

    constructor(
        @inject(SERVICE_TYPES.PageContentService) pageContentService: IPageContentService,
        @inject(INFRASTRUCTURE_TYPES.Router) router: IRouter,
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService,
        @inject(INFRASTRUCTURE_TYPES.SessionStorageProvider) private storageProvider: IStorageProvider,
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
            this.navigationRejection = req.navigationRejection;
            if (req.navigationRejection.navigationRejectionReason === NavigationRejectionReason.loginBack) {
                if (this.storageProvider.getItem('sign-in-attempted')) {
                    this.storageProvider.removeItem('sign-in-attempted');
                }
            }
            if (req.navigationRejection.navigationRejectionReason === NavigationRejectionReason.notAuthenticated) {
                this.authenticationService.signIn(req.path);
            }
        }

        return Promise.resolve();
    }

    protected postRender(): Promise<void> {
        const self = this;
        if (this.navigationRejection) {
            if (this.navigationRejection.navigationRejectionReason === NavigationRejectionReason.notFound) {
                this.pageContent.querySelector('.not-found').classList.remove('is-hidden');
                this.pageContent.querySelector<HTMLAnchorElement>('#back').addEventListener('click', (event: Event) => {
                    self.navigateBack(event);
                });
            }
        }
        return Promise.resolve();
    }

    private navigateBack(event: Event) {
        event.preventDefault();
        this.router.traverseBack();
    }
}
