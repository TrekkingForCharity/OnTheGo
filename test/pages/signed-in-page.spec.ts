import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { IAuthenticationService } from '../../src/scripts/services';
import { SignedInPage } from '../../src/scripts/pages';
import { INavigationRejection, NavigationRejectionReason } from '../../src/scripts/constructs';
import { IStorageProvider, IRouterRequest, IRouter } from '../../src/scripts/infrastructure';

describe('Signed In Page', () => {
    it('when sign in already attempted promise should be rejected', async () => {
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> =
            TypeMoq.Mock.ofType<IStorageProvider>();
        const router: TypeMoq.IMock<IRouter> =
            TypeMoq.Mock.ofType<IRouter>();
        storageProvider.setup((x) => x.getItem(TypeMoq.It.isAny())).returns(() => '1');

        const signedInPage = new SignedInPage(authenticationService.object, storageProvider.object, router.object);

        await signedInPage.canNavigateTo()
            .catch((reason: any) => {
                expect(NavigationRejectionReason.loginBack).to.be.
                equal(reason.navigationRejectionReason);
            });
    });
    it('when sign in not already attempted promise should be resolved', async () => {
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> =
            TypeMoq.Mock.ofType<IStorageProvider>();
        const router: TypeMoq.IMock<IRouter> =
            TypeMoq.Mock.ofType<IRouter>();
        const signedInPage = new SignedInPage(authenticationService.object, storageProvider.object, router.object);

        const result = await signedInPage.canNavigateTo();
        expect(undefined).to.be.equal(result);
    });
    it('should be navigated from', async () => {
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        const storageProvider: TypeMoq.IMock<IStorageProvider> =
            TypeMoq.Mock.ofType<IStorageProvider>();
        const router: TypeMoq.IMock<IRouter> =
            TypeMoq.Mock.ofType<IRouter>();
        const signedInPage = new SignedInPage(authenticationService.object, storageProvider.object, router.object);
        const result = await signedInPage.canNavigateFrom();
        expect(undefined).to.be.equal(result);
    });
    it('when page is initialized attempt is flagged and promise is resolved', async () => {
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.handleSignInCallback())
            .returns(() => Promise.resolve('https://test.example.com'));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const storageProvider: TypeMoq.IMock<IStorageProvider> =
            TypeMoq.Mock.ofType<IStorageProvider>();
        const routerRequest: TypeMoq.IMock<IRouterRequest> =
            TypeMoq.Mock.ofType<IRouterRequest>();
        const router: TypeMoq.IMock<IRouter> =
            TypeMoq.Mock.ofType<IRouter>();

        const signedInPage = new SignedInPage(authenticationService.object, storageProvider.object, router.object);

        const result = await signedInPage.init(routerRequest.object);
        expect(undefined).to.be.equal(result);
    });
});
