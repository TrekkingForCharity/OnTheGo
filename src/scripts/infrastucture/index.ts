import {IRouter, IRouterRequest, Router} from './router';

const TYPES = {
    Container: Symbol('container'),
    ProuterBrowserRouter: Symbol('prouter-browser-router'),
    Router: Symbol('router'),
};

export {
    IRouter,
    IRouterRequest,
    Router,
    TYPES,
};
