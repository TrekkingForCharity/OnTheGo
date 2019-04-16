import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { NavigationRejectionReason } from '../constructs';
import { IRouter, IRouterRequest, IStorageProvider } from '../infrastructure';
import { IAuthenticationService, IPageContentService } from '../services';
import { ErrorPage } from './';

function SetupPage(): any {
    const mainContainer = document.createElement('main');
    mainContainer.classList.add('container');
    document.body.appendChild(mainContainer);
    document.body.classList.add('some-class');

    const pageContainer = document.createElement('div');
    const notFound = document.createElement('div');
    notFound.classList.add('not-found');
    notFound.classList.add('is-hidden');
    const link = document.createElement('a');
    link.id = 'back';
    notFound.appendChild(link);
    pageContainer.appendChild(notFound);
    return {
        link,
        notFound,
        pageContainer,
    };
}
describe('Error Page', () => {
    it('page does not require authentication', () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object, authenticationService.object,
            storageProvider.object);
        expect(false).to.be.equal(page.requiresAuthentication);
    });
    it('page can be navigated to', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object, authenticationService.object,
            storageProvider.object);
        const result = await page.canNavigateTo();
        expect(undefined).to.be.equal(result);
    });

    it('page can be navigated from', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object, authenticationService.object,
            storageProvider.object);
        const result = await page.canNavigateFrom();
        expect(undefined).to.be.equal(result);
    });
    describe('loadAndProcessPageData', () => {
        it('when notAuthenticated auth service is called', async () => {
            const pageSetupResult = SetupPage();

            const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
            pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAny()))
                .returns(() => Promise.resolve(pageSetupResult.pageContainer));
            const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();
            let authenticationServiceCalled: boolean = false;
            authenticationService.setup((x) => x.signIn(TypeMoq.It.isAny())).callback(() => {
                authenticationServiceCalled = true;
            });
            const request: TypeMoq.IMock<IRouterRequest> = TypeMoq.Mock.ofType<IRouterRequest>();
            request.setup((x) => x.navigationRejection).returns(() => {
                return {
                    navigationRejectionReason: NavigationRejectionReason.notAuthenticated,
                };
            });
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
            const page: ErrorPage = new ErrorPage(pageContentService.object, router.object,
                authenticationService.object, storageProvider.object);
            await page.init(request.object);
            expect(true).to.be.equal(authenticationServiceCalled);
        });
        it('when loginBack item is removed from storage', async () => {
            const pageSetupResult = SetupPage();

            const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
            pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAny()))
                .returns(() => Promise.resolve(pageSetupResult.pageContainer));
            const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();
            const request: TypeMoq.IMock<IRouterRequest> = TypeMoq.Mock.ofType<IRouterRequest>();
            request.setup((x) => x.navigationRejection).returns(() => {
                return {
                    navigationRejectionReason: NavigationRejectionReason.loginBack,
                };
            });
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
            storageProvider.setup((x) => x.getItem(TypeMoq.It.isAny())).returns(() => 'foobar');
            let storageProviderCalled: boolean = false;
            storageProvider.setup((x) => x.removeItem(TypeMoq.It.isAny())).callback(() => {
                storageProviderCalled = true;
            });
            const page: ErrorPage = new ErrorPage(pageContentService.object, router.object,
                authenticationService.object, storageProvider.object);
            await page.init(request.object);
            expect(true).to.be.equal(storageProviderCalled);
        });
    });
    describe('postRender', () => {
        it('when notFound correct element is shown', async () => {
            const pageSetupResult = SetupPage();

            const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
            pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAny()))
                .returns(() => Promise.resolve(pageSetupResult.pageContainer));
            const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();
            const request: TypeMoq.IMock<IRouterRequest> = TypeMoq.Mock.ofType<IRouterRequest>();
            request.setup((x) => x.navigationRejection).returns(() => {
                return {
                    navigationRejectionReason: NavigationRejectionReason.notFound,
                };
            });
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
            const page: ErrorPage = new ErrorPage(pageContentService.object, router.object,
                authenticationService.object, storageProvider.object);
            await page.init(request.object);

            expect(false).to.be.equal(pageSetupResult.notFound.classList.contains('is-hidden'));
        });
    });
    describe('navigateBack', () => {
        it('router is called', async () => {
            const pageSetupResult = SetupPage();

            const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
            pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAny()))
                .returns(() => Promise.resolve(pageSetupResult.pageContainer));
            let routerCalled: boolean = false;
            const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
            router.setup((x) => x.traverseBack()).callback(() => {
                routerCalled = true;
            });
            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
            const page: ErrorPage = new ErrorPage(pageContentService.object, router.object,
                authenticationService.object, storageProvider.object);

            const request: TypeMoq.IMock<IRouterRequest> = TypeMoq.Mock.ofType<IRouterRequest>();
            request.setup((x) => x.navigationRejection).returns(() => ({
                navigationRejectionReason: NavigationRejectionReason.notFound,
            }));
            await page.init(request.object);

            pageSetupResult.link.click();
            expect(true).to.be.equal(routerCalled);
        });
    });
});
