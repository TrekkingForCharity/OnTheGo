import { inject, injectable } from 'inversify';
import { IComponent, INFRASTRUCTURE_TYPES } from '../constructs';
import { IRouter } from '../infrastructure';

@injectable()
export class FooterComponent implements IComponent {
    public attachedTo: HTMLElement;

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Router) private router: IRouter,
    ) {
    }

    public init(params?: any): Promise<void> {
        const self = this;

        const navigationLinks = this.attachedTo.querySelectorAll<HTMLAnchorElement>('a[data-navigation]');
        if (navigationLinks.length > 0) {
            for (let navigationLinkCount = 0; navigationLinkCount < navigationLinks.length; navigationLinkCount++) {
                navigationLinks[navigationLinkCount]
                    .addEventListener('click', (ev: MouseEvent) => { self.linkClick(ev); });
            }
        }

        return Promise.resolve();
    }

    private linkClick(ev: MouseEvent): void {
        ev.preventDefault();
        const element: HTMLAnchorElement = ev.target as HTMLAnchorElement;
        this.router.attemptToNavigate(element.href);
    }
}
