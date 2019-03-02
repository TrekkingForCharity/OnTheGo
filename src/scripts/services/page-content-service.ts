import { injectable } from 'inversify';
import { NavigationRejectionReason } from '../constructs';

export interface IPageContentService {
    loadPage(viewName: string): Promise<HTMLElement>;
}

interface IPageContentItem {
    [key: string]: HTMLElement;
}
@injectable()
export class PageContentService implements IPageContentService {
    private pageContentItem: IPageContentItem = {};
    public loadPage(viewName: string): Promise<HTMLElement> {
        if (this.pageContentItem[viewName]) {
            return Promise.resolve(this.pageContentItem[viewName].cloneNode(true) as HTMLElement);
        }
        return fetch(`/${viewName}.html`, {
            method: 'get',
        })
        .then(this.processResponse)
        .then((content: string) => {
            return this.generateAndStoreElement(content, viewName);
        })
        .catch((reason: any) => {
            return Promise.reject(NavigationRejectionReason.notFound);
        });
    }

    private processResponse(res: Response): Promise<string> {
        return res.text();
    }

    private generateAndStoreElement(content: string, viewName: string): Promise<HTMLElement> {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/xml');
        const element = doc.firstChild;
        this.pageContentItem[viewName] = element.cloneNode(true) as HTMLElement;
        return Promise.resolve(element as HTMLElement);
    }
}
