export const INFRASTRUCTURE_TYPES = {
    Config: Symbol('config'),
    Container: Symbol('container'),
    EventBus: Symbol('event-bus'),
    ProuterBrowserRouter: Symbol('prouter-browser-router'),
    Router: Symbol('router'),
    SessionStorageProvider: Symbol('session-storage-provider'),
    UserManager: Symbol('user-manager'),
    Validator: Symbol('validator'),
};

export const SERVICE_TYPES = {
    AuthenticationService: Symbol('authentication-service'),
    ComponentService: Symbol('component-service'),
    HelperService: Symbol('helper-service'),
    PageContentService: Symbol('page-content-service'),
    PageProcessingService: Symbol('page-processing-service'),
};

export const PAGE_TYPES = {
    ContactPage: 'contact-page',
    ErrorPage: 'error-page',
    SignedInPage: 'signed-in-page',
    SplashPage: 'splash-page',
};

export const COMPONENT_TYPES = {
    FooterComponent: Symbol('footer-component'),
    HeaderComponent: Symbol('header-component'),
};
