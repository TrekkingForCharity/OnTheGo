import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { UserManager, User, SigninResponse } from 'oidc-client';
import { IStorageProvider } from '../../src/scripts/infrastructure';
import { EventBus } from 'eventbus-ts';
import { AuthenticationService } from '../../src/scripts/services';

describe('Authentication Service', () => {
    it('when signing in, url is stored and user manager is called', async () => {
        let userManagerCallback: boolean = false;
        const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
        userManager.setup((x) => x.signinRedirect(TypeMoq.It.isAny())).callback(() => {
            userManagerCallback = true;
        });
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
        let storageProviderCallback: boolean = false;
        storageProvider.setup((x) => x.setItem(TypeMoq.It.isAny(), TypeMoq.It.isAny())).callback(() => {
            storageProviderCallback = true;
        });
        const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

        const authenticationService = new AuthenticationService(
            userManager.object,
            storageProvider.object,
            eventBus.object);

        const result = await authenticationService.signIn();
        expect(undefined).to.be.equal(result);
        expect(true).to.be.equal(storageProviderCallback);
        expect(true).to.be.equal(userManagerCallback);
    });
    it('when signing out, event is raised and user is removed from the manager', async () => {
        let userManagerCallback: boolean = false;
        const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
        userManager.setup((x) => x.removeUser()).callback(() => {
            userManagerCallback = true;
        });
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

        let eventBusCallback: boolean = false;
        const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();
        eventBus.setup((x) => x.post(TypeMoq.It.isAny())).callback(() => {
            eventBusCallback = true;
        });

        const authenticationService = new AuthenticationService(
            userManager.object,
            storageProvider.object,
            eventBus.object);

        const result = await authenticationService.signOut();
        expect(undefined).to.be.equal(result);
        expect(true).to.be.equal(eventBusCallback);
        expect(true).to.be.equal(userManagerCallback);
    });
    it('when call back is fired, event is fired and uri is returned', async () => {
        const signinResponse: TypeMoq.IMock<SigninResponse> = TypeMoq.Mock.ofType<SigninResponse>()
        const user: User = new User(signinResponse.object);
        const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
        userManager.setup((x: any) => x.then).returns(() => undefined);
        userManager.setup((x) => x.signinRedirectCallback(TypeMoq.It.isAny()))
            .returns(() => Promise.resolve(user));
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();
        storageProvider.setup((x) => x.getItem(TypeMoq.It.isAny())).returns(() => 'some-url');
        let eventBusCallback: boolean = false;
        const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();
        eventBus.setup((x) => x.post(TypeMoq.It.isAny())).callback(() => {
            eventBusCallback = true;
        });
        const authenticationService = new AuthenticationService(
            userManager.object,
            storageProvider.object,
            eventBus.object);
        const result = await authenticationService.handleSignInCallback();
        expect('some-url').to.be.equal(result);
        expect(true).to.be.equal(eventBusCallback);
    });
    it('when user is authenticated, promise is resolved and user is returned', async () => {
        const signinResponse: TypeMoq.IMock<SigninResponse> = TypeMoq.Mock.ofType<SigninResponse>()
        const user: User = new User(signinResponse.object);
        const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
        userManager.setup((x: any) => x.then).returns(() => undefined);
        userManager.setup((x) => x.getUser()).returns(() => Promise.resolve(user));
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

        const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

        const authenticationService = new AuthenticationService(
            userManager.object,
            storageProvider.object,
            eventBus.object);

        const result = await authenticationService.isAuthenticated();
        expect(undefined).to.be.equal(result);
    });
    it('when user is not authenticated, promise is rejected', async () => {
        const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
        userManager.setup((x: any) => x.then).returns(() => undefined);
        userManager.setup((x) => x.getUser()).returns(() => Promise.resolve(undefined));
        const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

        const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

        const authenticationService = new AuthenticationService(
            userManager.object,
            storageProvider.object,
            eventBus.object);

        await authenticationService.isAuthenticated().catch((err: any) => {
            expect(undefined).to.be.equal(err);
        });        
    });
});
