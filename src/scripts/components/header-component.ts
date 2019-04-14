import { EventBus, Subscribe } from 'eventbus-ts';
import { inject, injectable } from 'inversify';
import { IComponent, INFRASTRUCTURE_TYPES, SERVICE_TYPES } from '../constructs';
import { IRouter } from '../infrastructure';
import { IAuthenticationService } from '../services';

@injectable()
export class HeaderComponent implements IComponent {
    public attachedTo: HTMLElement;
    private $signUp: HTMLAnchorElement;
    private $signOut: HTMLAnchorElement;
    private $signIn: HTMLAnchorElement;

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Router) private router: IRouter,
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService) {
        EventBus.getDefault().register(this);
    }

    @Subscribe('AuthEvent')
    public onAuthEvent(data: boolean): void {
        this.processAuthenticationStatus();
    }

    public async init(params?: any|null): Promise<void> {
        const self = this;

        this.$signUp = this.attachedTo.querySelector('#nav-sign-up');
        this.$signIn = this.attachedTo.querySelector('#nav-sign-in');
        this.$signOut = this.attachedTo.querySelector('#nav-sign-out');

        const $navbarBurgers = this.attachedTo.querySelectorAll('.navbar-burger');
        if ($navbarBurgers.length > 0) {
            for (let navbarBurgerCount = 0; navbarBurgerCount < $navbarBurgers.length; navbarBurgerCount++) {
                $navbarBurgers[navbarBurgerCount].addEventListener('click', (event: MouseEvent) => {
                    self.navbarBurgerClick(event);
                });
            }
        }

        this.$signIn.addEventListener('click', (event: MouseEvent) => {
            self.signInClick(event);
        });
        this.$signOut.addEventListener('click', (event: MouseEvent) => {
            self.signOutClick(event);
        });

        const $navigationLinks = this.attachedTo.querySelectorAll<HTMLAnchorElement>('a[data-navigation]');
        if ($navigationLinks.length > 0) {
            for (let navigationLinkCount = 0; navigationLinkCount < $navigationLinks.length; navigationLinkCount++) {
                $navigationLinks[navigationLinkCount]
                    .addEventListener('click', (ev: MouseEvent) => { self.linkClick(ev); });
            }
        }

        return await this.processAuthenticationStatus();
    }

    private async processAuthenticationStatus(): Promise<void> {
        const self = this;
        const isAuthenticated = await this.authenticationService.isAuthenticated();
        if (isAuthenticated) {
            self.$signOut.classList.remove('is-hidden');
            self.$signUp.classList.add('is-hidden');
            self.$signIn.classList.add('is-hidden');
        } else {
            self.$signUp.classList.remove('is-hidden');
            self.$signIn.classList.remove('is-hidden');
            self.$signOut.classList.add('is-hidden');
        }
        return Promise.resolve();
    }

    private navbarBurgerClick(ev: MouseEvent) {
        ev.preventDefault();
        const el = (ev.target as HTMLAnchorElement);
        const target = el.dataset.target;
        const $target = this.attachedTo.querySelector(`#${target}`);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
    }

    private linkClick(ev: MouseEvent): void {
        ev.preventDefault();
        const element: HTMLAnchorElement = ev.target as HTMLAnchorElement;
        this.router.attemptToNavigate(element.href);
    }

    private signInClick(event: MouseEvent): void {
        event.preventDefault();
        this.authenticationService.signIn();
    }

    private signOutClick(event: MouseEvent): void {
        event.preventDefault();
        this.authenticationService.signOut();
    }
}
