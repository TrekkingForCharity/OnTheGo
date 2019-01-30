import { expect } from 'chai';
import { ProuterBrowserRouter } from 'prouter';
import * as TypeMoq from 'typemoq';
import { Router } from '../../src/scripts/infrastucture/router';
import { IAuthenticationService } from '../../src/scripts/services/authentication-service';
import { IPageProcessingService } from '../../src/scripts/services/page-processing-service';

describe('Router', () => {
    it('Should push into the component when attempting to navigate', () => {
        const pageProcessingService: TypeMoq.IMock<IPageProcessingService> =
            TypeMoq.Mock.ofType<IPageProcessingService>();
        const prouterBrowserRouter: TypeMoq.IMock<ProuterBrowserRouter> = TypeMoq.Mock.ofType<ProuterBrowserRouter>();
        const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();
        let callback: boolean = false;
        prouterBrowserRouter.setup((x) => x.push(TypeMoq.It.isAnyString())).callback(() => {
            callback = true;
        });

        const router = new Router(pageProcessingService.object, prouterBrowserRouter.object, authService.object);
        router.attemptToNavigate('some-route');
        expect(callback).to.be.equal(true);
    });
    it('Should make the component listen when when starting', () => {
        const pageProcessingService: TypeMoq.IMock<IPageProcessingService> =
            TypeMoq.Mock.ofType<IPageProcessingService>();
        const prouterBrowserRouter: TypeMoq.IMock<ProuterBrowserRouter> = TypeMoq.Mock.ofType<ProuterBrowserRouter>();
        const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();
        let callback: boolean = false;
        prouterBrowserRouter.setup((x) => x.listen()).callback(() => {
            callback = true;
        });

        const router = new Router(pageProcessingService.object, prouterBrowserRouter.object, authService.object);
        router.start();
        expect(callback).to.be.equal(true);
    });
    it('Should use the component when registering a route', () => {
        const pageProcessingService: TypeMoq.IMock<IPageProcessingService> =
            TypeMoq.Mock.ofType<IPageProcessingService>();
        const prouterBrowserRouter: TypeMoq.IMock<ProuterBrowserRouter> = TypeMoq.Mock.ofType<ProuterBrowserRouter>();
        const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();
        let callback: boolean = false;
        prouterBrowserRouter.setup((x) => x.use(TypeMoq.It.isAny(), TypeMoq.It.isAny())).callback(() => {
            callback = true;
        });

        const router = new Router(pageProcessingService.object, prouterBrowserRouter.object, authService.object);
        router.registerRoute('page-name', 'path');
        expect(callback).to.be.equal(true);
    });
});
