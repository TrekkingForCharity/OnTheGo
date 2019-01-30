import { ProuterBrowserRouter, ProuterRequest } from 'prouter';
import { INavigationRejection } from '../constructs/navigation-rejection';
import { IAuthenticationService } from '../services/authentication-service';
import { IPageProcessingService } from '../services/page-processing-service';

export interface IRouter {
    attemptToNavigate(path: string);
    registerRoute(pageName: string, path: string): void;
    start(): void;
}

export interface IRouterRequest extends ProuterRequest {
    navigationRejection?: INavigationRejection;
}

export class Router implements IRouter {
    constructor(
        private pageProcessingService: IPageProcessingService,
        private prouterBrowserRouter: ProuterBrowserRouter,
        private authenticationService: IAuthenticationService) {
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
