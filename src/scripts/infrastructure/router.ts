import { inject, injectable } from 'inversify';
import { ProuterBrowserRouter, ProuterRequest } from 'prouter';
import { INavigationRejection } from '../constructs';
import { IPageProcessingService, TYPES as ServiceTypes } from '../services';
import { TYPES as InfrastructureTypes } from './';

export interface IRouter {
    attemptToNavigate(path: string);
    registerRoute(pageName: string, path: string): void;
    start(): void;
}

export interface IRouterRequest extends ProuterRequest {
    navigationRejection?: INavigationRejection;
}

@injectable()
export class Router implements IRouter {
    constructor(
        @inject(ServiceTypes.PageProcessingService) private pageProcessingService: IPageProcessingService,
        @inject(InfrastructureTypes.ProuterBrowserRouter) private prouterBrowserRouter: ProuterBrowserRouter) {
    }

    public attemptToNavigate(path: string) {
        this.prouterBrowserRouter.push(path);
    }

    public registerRoute(pageName: string, path: string): void {
        const self = this;
        this.prouterBrowserRouter.use(path, (req, resp, next) => {
            self.pageProcessingService.loadPage(pageName, req, resp);
        });
    }

    public start(): void {
        this.prouterBrowserRouter.listen();
    }
}
