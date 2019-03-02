import { injectable } from 'inversify';
import { IRouter, IRouterRequest } from '../infrastructure';
import { IPageContentService } from '../services/page-content-service';

@injectable()
export abstract class BasePage {

    protected abstract viewName: string;
    protected abstract bodyClasses: string[];
    protected pageContent: HTMLElement;

    constructor(private pageContentService: IPageContentService, private router: IRouter) {

    }

    public init(req: IRouterRequest): Promise<void> {
        return this.loadAndSetPageContent()
        .then(() => this.loadAndProcessPageData(req))
        .then(() => this.processLinks())
        .then(() => this.renderPage());
    }

    protected loadAndSetPageContent(): Promise<void> {
        return this.pageContentService.loadPage(this.viewName)
            .then((content: HTMLElement) => {
                this.pageContent = content;
                return Promise.resolve();
            });
    }

    protected loadAndProcessPageData(req: IRouterRequest): Promise<void> {
        return Promise.resolve();
    }

    protected processLinks(): Promise<void> {
        const self = this;
        const $navigationLinks = this.pageContent.querySelectorAll<HTMLAnchorElement>('a[data-navigation]');
        if ($navigationLinks.length > 0) {
            for (let navigationLinkCount = 0; navigationLinkCount < $navigationLinks.length; navigationLinkCount++) {
                $navigationLinks[navigationLinkCount]
                    .addEventListener('click', (ev: MouseEvent) => { self.linkClick(ev); });
            }
        }
        return Promise.resolve();
    }

    protected renderPage(): Promise<void> {
        const container: HTMLElement = document.querySelector('main.container');
        container.innerHTML = '';
        container.appendChild(this.pageContent);
        const classList = document.body.classList;
        while (classList.length > 0) {
            classList.remove(classList.item(0));
        }
        if (this.bodyClasses) {
            for (const bodyClass of this.bodyClasses) {
                classList.add(bodyClass);
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
