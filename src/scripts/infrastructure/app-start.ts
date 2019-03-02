import { EventBus } from 'eventbus-ts';
import { Container } from 'inversify';
import { UserManager, UserManagerSettings } from 'oidc-client';
import { browserRouter, ProuterBrowserRouter } from 'prouter';
import { App } from '../app';
import { HeaderComponent } from '../components';
import { COMPONENT_TYPES, INFRASTRUCTURE_TYPES, PAGE_TYPES, SERVICE_TYPES } from '../constructs';
import { ErrorPage, SignedInPage, SplashPage } from '../pages';
import { AuthenticationService, ComponentService, IAuthenticationService, IComponentService, IPageContentService,
    IPageProcessingService, PageContentService, PageProcessingService } from '../services';
import { IRouter, IStorageProvider, Router } from './';
import { SessionStorageProvider } from './storage-provider';

export class AppStart {
    public static setup(): Promise<App> {
        const container = this.setupContainer();

        container.bind<App>('app').to(App);

        this.setupPages(container);
        this.setupComponents(container);
        this.setupRoutes(container);
        return Promise.resolve(container.get<App>('app'));
    }

    private static setupPages(container: Container): void {
        container.bind<ErrorPage>(PAGE_TYPES.ErrorPage).to(ErrorPage);
        container.bind<SplashPage>(PAGE_TYPES.SplashPage).to(SplashPage);
        container.bind<SignedInPage>(PAGE_TYPES.SignedInPage).to(SignedInPage);
    }

    private static setupComponents(container: Container): void {
        container.bind<HeaderComponent>(COMPONENT_TYPES.HeaderComponent).to(HeaderComponent);
    }

    private static setupRoutes(container: Container): void {
        const router: IRouter = container.get<IRouter>(INFRASTRUCTURE_TYPES.Router);
        router.registerRoute(PAGE_TYPES.SplashPage, '/');
        router.registerRoute(PAGE_TYPES.SignedInPage, '/signed-in');

        router.registerRoute(PAGE_TYPES.ErrorPage, '*');
    }

    private static setupContainer(): Container {
        const container = new Container();

        container.bind<IPageProcessingService>(SERVICE_TYPES.PageProcessingService).to(PageProcessingService);
        container.bind<IAuthenticationService>(SERVICE_TYPES.AuthenticationService).to(AuthenticationService);
        container.bind<IPageContentService>(SERVICE_TYPES.PageContentService).to(PageContentService);
        container.bind<IComponentService>(SERVICE_TYPES.ComponentService).to(ComponentService);
        container.bind<IRouter>(INFRASTRUCTURE_TYPES.Router).to(Router);

        const prouterBrowserRouter = browserRouter();
        container.bind<ProuterBrowserRouter>(INFRASTRUCTURE_TYPES.ProuterBrowserRouter)
            .toConstantValue(prouterBrowserRouter);

        container.bind<IStorageProvider>(INFRASTRUCTURE_TYPES.SessionStorageProvider).to(SessionStorageProvider);

        const userManagerSettings: UserManagerSettings = {
            authority: 'https://trekkingforcharity.eu.auth0.com/',
            automaticSilentRenew: true,
            client_id: 'EXQEYsS2Joah48AFyb6KbnmME2h9lXoc',
            loadUserInfo: true,
            redirect_uri: 'http://localhost:1234/signed-in',
            response_type: 'id_token token',
            silent_redirect_uri: 'http://localhost:1234/silent-renew',
        };
        const userManager = new UserManager(userManagerSettings);
        container.bind<UserManager>(INFRASTRUCTURE_TYPES.UserManager)
        .toConstantValue(userManager);

        container.bind<EventBus>(INFRASTRUCTURE_TYPES.EventBus).toConstantValue(EventBus.getDefault());

        container.bind<Container>(INFRASTRUCTURE_TYPES.Container).toConstantValue(container);

        return container;
    }
}
