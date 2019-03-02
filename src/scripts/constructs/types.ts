export const INFRASTRUCTURE_TYPES = {
    Container: Symbol('container'),
    EventBus: Symbol('event-bus'),
    ProuterBrowserRouter: Symbol('prouter-browser-router'),
    Router: Symbol('router'),
    SessionStorageProvider: Symbol('session-storage-provider'),
    UserManager: Symbol('user-manager'),
};

export const SERVICE_TYPES = {
    AuthenticationService: Symbol('authentication-service'),
    ComponentService: Symbol('component-service'),
    PageContentService: Symbol('page-content-service'),
    PageProcessingService: Symbol('page-processing-service'),
};

export const PAGE_TYPES = {
    ErrorPage: 'error-page',
    SignedInPage: 'signed-in-page',
    SplashPage: 'splash-page',
};

export const COMPONENT_TYPES = {
    HeaderComponent: Symbol('header-component'),
};
