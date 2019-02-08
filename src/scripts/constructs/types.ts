export const INFRASTRUCTURE_TYPES = {
    Container: Symbol('container'),
    ProuterBrowserRouter: Symbol('prouter-browser-router'),
    Router: Symbol('router'),
};

export const SERVICE_TYPES = {
    AuthenticationService: Symbol('authentication-service'),
    PageContentService: Symbol('page-content-service'),
    PageProcessingService: Symbol('page-processing-service'),
};

export const PAGE_TYPES = {
    ErrorPage: 'error-page',
    SplashPage: 'splash-page',
};
