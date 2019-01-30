import { Container } from 'inversify';
import { browserRouter, ProuterBrowserRouter } from 'prouter';
import { ErrorPage, TYPES as PageTypes } from '../pages';
import { AuthenticationService, IAuthenticationService, IPageProcessingService,
    PageProcessingService, TYPES as ServiceTypes } from '../services';
import { IRouter, Router, TYPES as InfrastructureTypes } from './';

export class AppStart {
    public static setup(): void {
        const container = this.setupContainer();

        this.setupPages(container);
        this.setupRoutes(container);
    }

    private static setupPages(container: Container): void {
        container.bind<ErrorPage>(PageTypes.ErrorPage).to(ErrorPage);
    }

    private static setupRoutes(container: Container): void {
        const router: IRouter = container.get<IRouter>(InfrastructureTypes.Router);
        router.registerRoute('error-page', '');

        router.start();
    }

    private static setupContainer(): Container {
        const container = new Container();

        container.bind<IPageProcessingService>(ServiceTypes.PageProcessingService).to(PageProcessingService);
        container.bind<IAuthenticationService>(ServiceTypes.PageProcessingService).to(AuthenticationService);
        container.bind<IRouter>(InfrastructureTypes.Router).to(Router);

        const prouterBrowserRouter = browserRouter();
        container.bind<ProuterBrowserRouter>(InfrastructureTypes.ProuterBrowserRouter)
            .toConstantValue(prouterBrowserRouter);

        container.bind<Container>(InfrastructureTypes.Container).toConstantValue(container);

        return container;
    }
}
