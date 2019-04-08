import { EventBus } from 'eventbus-ts';
import { Container } from 'inversify';
import { UserManager, UserManagerSettings } from 'oidc-client';
import { browserRouter, ProuterBrowserRouter } from 'prouter';
import * as validate from 'validate.js';
import { App } from '../app';
import { FooterComponent, HeaderComponent } from '../components';
import { COMPONENT_TYPES, INFRASTRUCTURE_TYPES, PAGE_TYPES, SERVICE_TYPES } from '../constructs';
import { ContactPage, ErrorPage, SignedInPage, SplashPage } from '../pages';
import { AuthenticationService, ComponentService, HelperService,
    IAuthenticationService, IComponentService, IHelperService, IPageContentService,
    IPageProcessingService, PageContentService, PageProcessingService } from '../services';
import { IConfig, IRouter, IStorageProvider, Router, Validate } from './';
import { SessionStorageProvider } from './storage-provider';

export class AppStart {
    public static setup(config: IConfig): Promise<App> {
        const container = this.setupContainer(config);
        container.bind<IConfig>(INFRASTRUCTURE_TYPES.Config).toConstantValue(config);
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
        container.bind<ContactPage>(PAGE_TYPES.ContactPage).to(ContactPage);
    }

    private static setupComponents(container: Container): void {
        container.bind<HeaderComponent>(COMPONENT_TYPES.HeaderComponent).to(HeaderComponent);
        container.bind<FooterComponent>(COMPONENT_TYPES.FooterComponent).to(FooterComponent);
    }

    private static setupRoutes(container: Container): void {
        const router: IRouter = container.get<IRouter>(INFRASTRUCTURE_TYPES.Router);
        router.registerRoute(PAGE_TYPES.SplashPage, '/');
        router.registerRoute(PAGE_TYPES.SignedInPage, '/signed-in');
        router.registerRoute(PAGE_TYPES.ContactPage, '/contact');

        router.registerRoute(PAGE_TYPES.ErrorPage, '*');
    }

    private static setupContainer(config: IConfig): Container {
        const container = new Container();

        container.bind<IPageProcessingService>(SERVICE_TYPES.PageProcessingService).to(PageProcessingService);
        container.bind<IAuthenticationService>(SERVICE_TYPES.AuthenticationService).to(AuthenticationService);
        container.bind<IPageContentService>(SERVICE_TYPES.PageContentService).to(PageContentService);
        container.bind<IComponentService>(SERVICE_TYPES.ComponentService).to(ComponentService);
        container.bind<IHelperService>(SERVICE_TYPES.HelperService).to(HelperService);
        container.bind<IRouter>(INFRASTRUCTURE_TYPES.Router).to(Router);
        container.bind<Validate>(INFRASTRUCTURE_TYPES.Validator).toConstantValue(validate);

        const prouterBrowserRouter = browserRouter();
        container.bind<ProuterBrowserRouter>(INFRASTRUCTURE_TYPES.ProuterBrowserRouter)
            .toConstantValue(prouterBrowserRouter);

        container.bind<IStorageProvider>(INFRASTRUCTURE_TYPES.SessionStorageProvider).to(SessionStorageProvider);

        const userManagerSettings: UserManagerSettings = {
            authority: config.auth.authority,
            automaticSilentRenew: config.auth.automaticSilentRenew,
            client_id: config.auth.clientId,
            loadUserInfo: config.auth.loadUserInfo,
            redirect_uri: config.auth.redirectUri,
            response_type: config.auth.responseType,
            silent_redirect_uri: config.auth.silentRedirectUri,
        };
        const userManager = new UserManager(userManagerSettings);
        container.bind<UserManager>(INFRASTRUCTURE_TYPES.UserManager)
        .toConstantValue(userManager);

        container.bind<EventBus>(INFRASTRUCTURE_TYPES.EventBus).toConstantValue(EventBus.getDefault());

        container.bind<Container>(INFRASTRUCTURE_TYPES.Container).toConstantValue(container);

        return container;
    }
}
