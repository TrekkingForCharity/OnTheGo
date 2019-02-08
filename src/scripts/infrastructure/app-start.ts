import { Container } from 'inversify';
import { browserRouter, ProuterBrowserRouter } from 'prouter';
import { INFRASTRUCTURE_TYPES, PAGE_TYPES, SERVICE_TYPES } from '../constructs';
import { ErrorPage, SplashPage } from '../pages';
import { AuthenticationService, IAuthenticationService, IPageProcessingService,
    PageProcessingService } from '../services';
import { IRouter, Router } from './';
import { IPageContentService, PageContentService } from '../services/page-content-service';

export class AppStart {
    public static setup(): void {
        const container = this.setupContainer();

        this.setupPages(container);
        this.setupRoutes(container);
    }

    private static setupPages(container: Container): void {
        container.bind<ErrorPage>(PAGE_TYPES.ErrorPage).to(ErrorPage);
        container.bind<SplashPage>(PAGE_TYPES.SplashPage).to(SplashPage);
    }

    private static setupRoutes(container: Container): void {
        const router: IRouter = container.get<IRouter>(INFRASTRUCTURE_TYPES.Router);
        router.registerRoute('splash-page', '/');
        router.registerRoute('error-page', '*');
        router.start();
    }

    private static setupContainer(): Container {
        const container = new Container();

        container.bind<IPageProcessingService>(SERVICE_TYPES.PageProcessingService).to(PageProcessingService);
        container.bind<IAuthenticationService>(SERVICE_TYPES.AuthenticationService).to(AuthenticationService);
        container.bind<IPageContentService>(SERVICE_TYPES.PageContentService).to(PageContentService);
        container.bind<IRouter>(INFRASTRUCTURE_TYPES.Router).to(Router);

        const prouterBrowserRouter = browserRouter();
        container.bind<ProuterBrowserRouter>(INFRASTRUCTURE_TYPES.ProuterBrowserRouter)
            .toConstantValue(prouterBrowserRouter);

        container.bind<Container>(INFRASTRUCTURE_TYPES.Container).toConstantValue(container);

        return container;
    }
}
