import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { IRouter } from '../infrastructure';
import { IAuthenticationService } from '../services';
import { HeaderComponent } from './';

interface IHeaderItem {
    attachTo: HTMLElement;
    navSignUp: HTMLAnchorElement;
    navSignIn: HTMLAnchorElement;
    navSignOut: HTMLAnchorElement;
    burger: HTMLAnchorElement;
    burgerTarget: HTMLDivElement;
}
class Helpers {
    public static setupComponentDom(): IHeaderItem {
        const attachTo = document.createElement('div');
        const navSignUp = document.createElement('a');
        navSignUp.id = 'nav-sign-up';
        navSignUp.dataset.navigation = '';
        const navSignIn = document.createElement('a');
        navSignIn.id = 'nav-sign-in';
        const navSignOut = document.createElement('a');
        navSignOut.id = 'nav-sign-out';
        const burger = document.createElement('a');
        burger.classList.add('navbar-burger');
        burger.dataset.target = 'burger-target';
        const burgerTarget = document.createElement('div');
        burgerTarget.id = 'burger-target';
        burgerTarget.classList.add('is-active');

        attachTo.appendChild(navSignUp);
        attachTo.appendChild(navSignIn);
        attachTo.appendChild(navSignOut);
        attachTo.appendChild(burger);
        attachTo.appendChild(burgerTarget);

        return {
            attachTo,
            burger,
            burgerTarget,
            navSignIn,
            navSignOut,
            navSignUp,
        };
    }
}

describe('Header Component', () => {
    it('when sign in clicked a sign in should be attempted', async () => {
        const headerItem = Helpers.setupComponentDom();
        let called: boolean = false;
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.signIn()).callback(() => {
            called = true;
        });
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(true));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        headerItem.navSignIn.click();
        expect(true).to.be.equal(called);
    });

    it('when sign out clicked a sign out should be attempted', async () => {
        const headerItem = Helpers.setupComponentDom();
        let called: boolean = false;
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.signOut()).callback(() => {
            called = true;
        });
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(true));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        headerItem.navSignOut.click();
        expect(true).to.be.equal(called);
    });
    it('when user is present correct navigation is shown', async () => {
        const headerItem = Helpers.setupComponentDom();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(true));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        expect(false).to.be.equal(headerItem.navSignOut.classList.contains('is-hidden'));
        expect(true).to.be.equal(headerItem.navSignIn.classList.contains('is-hidden'));
        expect(true).to.be.equal(headerItem.navSignUp.classList.contains('is-hidden'));
    });
    it('when user is not present correct navigation is shown', async () => {
        const headerItem = Helpers.setupComponentDom();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(false));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        expect(true).to.be.equal(headerItem.navSignOut.classList.contains('is-hidden'));
        expect(false).to.be.equal(headerItem.navSignIn.classList.contains('is-hidden'));
        expect(false).to.be.equal(headerItem.navSignUp.classList.contains('is-hidden'));
    });
    it('when sign up click navigation is attempted', async () => {
        const headerItem = Helpers.setupComponentDom();
        let called: boolean = false;
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        router.setup((x) => x.attemptToNavigate(TypeMoq.It.isAny())).callback(() => {
            called = true;
        });
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(false));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        headerItem.navSignUp.click();
        expect(true).to.be.equal(called);
    });
    it('when burger is clicked target is toggled', async () => {
        const headerItem = Helpers.setupComponentDom();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const authenticationService: TypeMoq.IMock<IAuthenticationService> =
            TypeMoq.Mock.ofType<IAuthenticationService>();
        authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(false));
        authenticationService.setup((x: any) => x.then).returns(() => undefined);
        const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);
        component.attachedTo = headerItem.attachTo;
        await component.init();
        headerItem.burger.click();
        expect(false).to.be.equal(headerItem.burgerTarget.classList.contains('is-active'));
        expect(true).to.be.equal(headerItem.burger.classList.contains('is-active'));
    });
});
