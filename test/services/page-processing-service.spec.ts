import { expect } from 'chai';
import { Container } from 'inversify';
import { ProuterRequest, ProuterResponse, ProuterStringMap } from 'prouter';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { NavigationRejectionReason } from '../../src/scripts/constructs/navigation-rejection';
import { IPage } from '../../src/scripts/constructs/page';
import { IRouterRequest } from '../../src/scripts/infrastucture/router';
import { IAuthenticationService } from '../../src/scripts/services/authentication-service';
import { PageProcessingService } from '../../src/scripts/services/page-processing-service';

class Helper {
    public static generateRequest(): IRouterRequest  {
        const request: IRouterRequest = {
            listening: TypeMoq.Mock.ofType<boolean>().object,
            originalUrl: TypeMoq.Mock.ofType<string>().object,
            params: TypeMoq.Mock.ofType<ProuterStringMap>().object,
            path: TypeMoq.Mock.ofType<string>().object,
            query: TypeMoq.Mock.ofType<ProuterStringMap>().object,
            queryString: TypeMoq.Mock.ofType<string>().object,
        };
        return request;
    }
}

describe('Page Processing Service', () => {
    const response: TypeMoq.IMock<ProuterResponse> = TypeMoq.Mock.ofType<ProuterResponse>();
    describe('Rejected scenarios', () => {
        it('when error page is not found', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();
            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => null);
            const service = new PageProcessingService(container.object, authService.object);
            try {
                await service.loadPage('new-page', Helper.generateRequest(), response.object);
            } catch (err) {
                expect(err).to.equal(undefined);
            }
        });
        it('when page is not found', async () => {
            let routerRequest: IRouterRequest;

            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const errorPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            errorPage.setup((p) => p.requiresAuthentication).returns(() => false);
            errorPage.setup((x: any) => x.then).returns(() => undefined);
            errorPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            errorPage.setup((p) => p.init(TypeMoq.It.isAny())).callback((req: IRouterRequest) => {
                routerRequest = req;
            }).returns(() => Promise.resolve());
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();
            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => null);
            container.setup((c) => c.get(TypeMoq.It.isValue('error-page'))).returns(() => errorPage.object);

            const service = new PageProcessingService(container.object, authService.object);
            const outPage: IPage = await service.loadPage('new-page', Helper.generateRequest(), response.object);
            expect(errorPage.object).to.be.equal(outPage);
            expect(routerRequest.navigationRejection.navigationRejectionReason)
                .to.be.equal(NavigationRejectionReason.notFound);
        });
        it('when page requires auth and no user', async () => {
            let routerRequest: IRouterRequest;

            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const errorPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((x: any) => x.then).returns(() => undefined);

            errorPage.setup((p) => p.requiresAuthentication).returns(() => false);
            errorPage.setup((x: any) => x.then).returns(() => undefined);
            errorPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            errorPage.setup((p) => p.init(TypeMoq.It.isAny())).callback((req: IRouterRequest) => {
                routerRequest = req;
            }).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('error-page'))).returns(() => errorPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => false);

            const service = new PageProcessingService(container.object, authService.object);

            const outPage: IPage = await service.loadPage('new-page', Helper.generateRequest(), response.object);
            expect(errorPage.object).to.be.equal(outPage);
            expect(routerRequest.navigationRejection.navigationRejectionReason)
                .to.be.equal(NavigationRejectionReason.notAuthenticated);
        });
        it('when page requires auth, no user present and page cannot be navigated to', async () => {
            let routerRequest: IRouterRequest;

            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const errorPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((x: any) => x.then).returns(() => undefined);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.reject());

            errorPage.setup((p) => p.requiresAuthentication).returns(() => false);
            errorPage.setup((x: any) => x.then).returns(() => undefined);
            errorPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            errorPage.setup((p) => p.init(TypeMoq.It.isAny())).callback((req: IRouterRequest) => {
                routerRequest = req;
            }).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('error-page'))).returns(() => errorPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => false);

            const service = new PageProcessingService(container.object, authService.object);

            const outPage: IPage = await service.loadPage('new-page', Helper.generateRequest(), response.object);
            expect(errorPage.object).to.be.equal(outPage);
            expect(routerRequest.navigationRejection.navigationRejectionReason)
                .to.be.equal(NavigationRejectionReason.notAuthenticated);
        });
        it('when page requires auth, no user present and current page cannot be navigated from', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const currentPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((x: any) => x.then).returns(() => undefined);

            currentPage.setup((p) => p.requiresAuthentication).returns(() => false);
            currentPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            currentPage.setup((p) => p.canNavigateFrom()).returns(() => Promise.reject());
            currentPage.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());
            currentPage.setup((x: any) => x.then).returns(() => undefined);

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('current-page'))).returns(() => currentPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => false);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('current-page', Helper.generateRequest(), response.object);
            await service.loadPage('new-page', Helper.generateRequest(), response.object)
                .catch((reason: any) => {
                    expect(reason.navigationRejectionReason).to.be.equal(NavigationRejectionReason.locked);
                });
        });
        it('when page requires auth, user present and page cannot be navigated to', async () => {
            let routerRequest: IRouterRequest;

            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const errorPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.reject());
            page.setup((x: any) => x.then).returns(() => undefined);

            errorPage.setup((p) => p.requiresAuthentication).returns(() => false);
            errorPage.setup((x: any) => x.then).returns(() => undefined);
            errorPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            errorPage.setup((p) => p.init(TypeMoq.It.isAny())).callback((req: IRouterRequest) => {
                routerRequest = req;
            }).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('error-page'))).returns(() => errorPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            const outPage: IPage = await service.loadPage('new-page', Helper.generateRequest(), response.object);
            expect(errorPage.object).to.be.equal(outPage);
            expect(routerRequest.navigationRejection.navigationRejectionReason)
                .to.be.equal(NavigationRejectionReason.notSafe);
        });
        it('when page requires auth, user present and current page cannot be navigated from', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const currentPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((x: any) => x.then).returns(() => undefined);

            currentPage.setup((p) => p.requiresAuthentication).returns(() => false);
            currentPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            currentPage.setup((p) => p.canNavigateFrom()).returns(() => Promise.reject());
            currentPage.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());
            currentPage.setup((x: any) => x.then).returns(() => undefined);

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('current-page'))).returns(() => currentPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('current-page', Helper.generateRequest(), response.object);
            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .catch((reason: any) => {
                expect(reason.navigationRejectionReason).to.be.equal(NavigationRejectionReason.locked);
            });
        });
        it('when page does not requires auth and page cannot be navigated to', async () => {
            let routerRequest: IRouterRequest;

            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const errorPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => false);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.reject());
            page.setup((x: any) => x.then).returns(() => undefined);

            errorPage.setup((p) => p.requiresAuthentication).returns(() => false);
            errorPage.setup((x: any) => x.then).returns(() => undefined);
            errorPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            errorPage.setup((p) => p.init(TypeMoq.It.isAny())).callback((req: IRouterRequest) => {
                routerRequest = req;
            }).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('error-page'))).returns(() => errorPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            const outPage: IPage = await service.loadPage('new-page', Helper.generateRequest(), response.object);
            expect(errorPage.object).to.be.equal(outPage);
            expect(routerRequest.navigationRejection.navigationRejectionReason)
                .to.be.equal(NavigationRejectionReason.notSafe);
        });
        it('when page does not requires auth and current page cannot be navigated from', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const currentPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => false);
            page.setup((x: any) => x.then).returns(() => undefined);

            currentPage.setup((p) => p.requiresAuthentication).returns(() => false);
            currentPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            currentPage.setup((p) => p.canNavigateFrom()).returns(() => Promise.reject());
            currentPage.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());
            currentPage.setup((x: any) => x.then).returns(() => undefined);

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('current-page'))).returns(() => currentPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => false);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('current-page', Helper.generateRequest(), response.object);
            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .catch((reason: any) => {
                expect(NavigationRejectionReason.locked).to.be.equal(reason.navigationRejectionReason);
            });
        });
    });

    describe('Resolved scenarios', () => {
        it('when page requires auth, user present and page can be navigated to', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            page.setup((x: any) => x.then).returns(() => undefined);
            page.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .then((p: IPage) => {
                 expect(p).to.be.equal(page.object);
            });
        });
        it('when page requires auth, user present and current page can be navigated from', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const currentPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => true);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            page.setup((x: any) => x.then).returns(() => undefined);
            page.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            currentPage.setup((p) => p.requiresAuthentication).returns(() => false);
            currentPage.setup((p) => p.canNavigateFrom()).returns(() => Promise.resolve());
            currentPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            currentPage.setup((x: any) => x.then).returns(() => undefined);
            currentPage.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('current-page'))).returns(() => currentPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('current-page', Helper.generateRequest(), response.object);
            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .then((p2: IPage) => {
                expect(p2).to.be.equal(page.object);
            });
        });
        it('when page does not require auth and page can be navigated to', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => false);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            page.setup((x: any) => x.then).returns(() => undefined);
            page.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .then((p: IPage) => {
                 expect(p).to.be.equal(page.object);
            });
        });
        it('when page does not require auth and current page can be navigated from', async () => {
            const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
            const page: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const currentPage: TypeMoq.IMock<IPage> = TypeMoq.Mock.ofType<IPage>();
            const authService: TypeMoq.IMock<IAuthenticationService> = TypeMoq.Mock.ofType<IAuthenticationService>();

            page.setup((p) => p.requiresAuthentication).returns(() => false);
            page.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            page.setup((x: any) => x.then).returns(() => undefined);
            page.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            currentPage.setup((p) => p.requiresAuthentication).returns(() => false);
            currentPage.setup((p) => p.canNavigateFrom()).returns(() => Promise.resolve());
            currentPage.setup((p) => p.canNavigateTo()).returns(() => Promise.resolve());
            currentPage.setup((x: any) => x.then).returns(() => undefined);
            currentPage.setup((p) => p.init(TypeMoq.It.isAny())).returns(() => Promise.resolve());

            container.setup((c) => c.get(TypeMoq.It.isValue('new-page'))).returns(() => page.object);
            container.setup((c) => c.get(TypeMoq.It.isValue('current-page'))).returns(() => currentPage.object);
            authService.setup((a) => a.isAuthenticated).returns(() => true);

            const service = new PageProcessingService(container.object, authService.object);

            await service.loadPage('current-page', Helper.generateRequest(), response.object);
            await service.loadPage('new-page', Helper.generateRequest(), response.object)
            .then((p2: IPage) => {
                expect(p2).to.be.equal(page.object);
            });
        });
    });
});
