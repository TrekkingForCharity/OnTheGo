import { expect } from 'chai';
import { EventBus } from 'eventbus-ts';
import { SigninResponse, User, UserManager } from 'oidc-client';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { IStorageProvider } from '../infrastructure';
import { AuthenticationService } from './';

describe('Authentication Service', () => {
    describe('signIn', () => {
        it('url is stored and user manager is called', async () => {
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
    });
    describe('signOut', () => {
        it('event is raised and user is removed from the manager', async () => {
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
    });
    describe('handleSignInCallback', () => {
        it('when call back is fired, event is fired and uri is returned', async () => {
            const signinResponse: TypeMoq.IMock<SigninResponse> = TypeMoq.Mock.ofType<SigninResponse>();
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
    });
    describe('isAuthenticated', () => {
        it('when user is authenticated, a true promise is returned', async () => {
            const signinResponse: TypeMoq.IMock<SigninResponse> = TypeMoq.Mock.ofType<SigninResponse>();
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
            expect(true).to.be.equal(result);
        });
        it('when user is not authenticated, a false promise is returned', async () => {
            const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
            userManager.setup((x: any) => x.then).returns(() => undefined);
            userManager.setup((x) => x.getUser()).returns(() => Promise.resolve(undefined));
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

            const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

            const authenticationService = new AuthenticationService(
                userManager.object,
                storageProvider.object,
                eventBus.object);

            const result = await authenticationService.isAuthenticated();
            expect(false).to.be.equal(result);
        });
        it('when user manager fails, a false promise is returned', async () => {
            const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
            userManager.setup((x: any) => x.then).returns(() => undefined);
            userManager.setup((x) => x.getUser()).returns(() => Promise.reject());
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

            const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

            const authenticationService = new AuthenticationService(
                userManager.object,
                storageProvider.object,
                eventBus.object);

            const result = await authenticationService.isAuthenticated();
            expect(false).to.be.equal(result);
        });
    });
    describe('getToken', () => {
        it('when user is authenticated, a token promise is returned', async () => {
            const signinResponse: TypeMoq.IMock<SigninResponse> = TypeMoq.Mock.ofType<SigninResponse>();
            signinResponse.setup((x) => x.access_token).returns(() => 'access_token');
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

            const result = await authenticationService.getToken();
            expect('access_token').to.be.equal(result);
        });
        it('when user is not authenticated, a rejection is returned', async () => {
            const userManager: TypeMoq.IMock<UserManager> = TypeMoq.Mock.ofType<UserManager>();
            userManager.setup((x: any) => x.then).returns(() => undefined);
            userManager.setup((x) => x.getUser()).returns(() => Promise.resolve(undefined));
            const storageProvider: TypeMoq.IMock<IStorageProvider> = TypeMoq.Mock.ofType<IStorageProvider>();

            const eventBus: TypeMoq.IMock<EventBus> = TypeMoq.Mock.ofType<EventBus>();

            const authenticationService = new AuthenticationService(
                userManager.object,
                storageProvider.object,
                eventBus.object);

            try {
                await authenticationService.getToken();
            } catch (err) {
                expect(err).to.equal(undefined);
            }
        });
    });
});
