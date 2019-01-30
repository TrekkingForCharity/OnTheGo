import { Container } from 'inversify';
import { browserRouter, ProuterBrowserRouter } from 'prouter';
import { ErrorPage } from '../pages';
import { AuthenticationService, IAuthenticationService, IPageProcessingService,
    PageProcessingService } from '../services';
import { IRouter, Router } from './';
import { INFRASTRUCTURE_TYPES, PAGE_TYPES, SERVICE_TYPES } from '../constructs'

export class AppStart {
    public static setup(): void {
        const container = this.setupContainer();

        this.setupPages(container);
        this.setupRoutes(container);
    }

    private static setupPages(container: Container): void {
        container.bind<ErrorPage>(PAGE_TYPES.ErrorPage).to(ErrorPage);
    }

    private static setupRoutes(container: Container): void {
        const router: IRouter = container.get<IRouter>(INFRASTRUCTURE_TYPES.Router);
        router.registerRoute('error-page', '');

        router.start();
    }

    private static setupContainer(): Container {
        const container = new Container();

        container.bind<IPageProcessingService>(SERVICE_TYPES.PageProcessingService).to(PageProcessingService);
        container.bind<IAuthenticationService>(SERVICE_TYPES.PageProcessingService).to(AuthenticationService);
        container.bind<IRouter>(INFRASTRUCTURE_TYPES.Router).to(Router);

        const prouterBrowserRouter = browserRouter();
        container.bind<ProuterBrowserRouter>(INFRASTRUCTURE_TYPES.ProuterBrowserRouter)
            .toConstantValue(prouterBrowserRouter);

        container.bind<Container>(INFRASTRUCTURE_TYPES.Container).toConstantValue(container);

        return container;
    }
}
