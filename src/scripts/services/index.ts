import {AuthenticationService, IAuthenticationService} from './authentication-service';
import {IPageProcessingService, PageProcessingService} from './page-processing-service';

const TYPES = {
    AuthenticationService: Symbol('authentication-service'),
    PageProcessingService: Symbol('page-processing-service'),
};

export {
    AuthenticationService,
    IAuthenticationService,
    IPageProcessingService,
    PageProcessingService,
    TYPES,
};
