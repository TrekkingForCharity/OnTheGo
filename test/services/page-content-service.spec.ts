import { expect } from 'chai';
import * as fetchMock from 'fetch-mock'
import { IPageContentService, PageContentService } from '../../src/scripts/services';
import { NavigationRejectionReason } from '../../src/scripts/constructs';

describe('Page Content Service', () => {
    afterEach(fetchMock.restore);
    it('when content not loaded and exists element is returned', async () => {
        fetchMock.mock('/load-check.partial.html', {
            status: 200,
            body: '<div>some content</div>',
        });
        const pageContentService: IPageContentService = new PageContentService();
        const element = await pageContentService.loadPage('load-check.partial');
        const calls = fetchMock.calls('/load-check.partial.html')
        expect('<div>some content</div>').to.be.equal(element.outerHTML);
        
        expect(1).to.be.equal(calls.length);
    })
    it('when content has loaded and exists element is returned from cache', async () => {
        fetchMock.mock('/reload-check.partial.html', {
            status: 200,
            body: '<div>some content</div>',
        });
        const pageContentService: IPageContentService = new PageContentService();
        const element = await pageContentService.loadPage('reload-check.partial');
        const cachedElement = await pageContentService.loadPage('reload-check.partial');
        const calls = fetchMock.calls('/reload-check.partial.html')
        expect(1).to.be.equal(calls.length);
        expect('<div>some content</div>').to.be.equal(element.outerHTML);
        expect('<div>some content</div>').to.be.equal(cachedElement.outerHTML);
    })
    it('when content is not available promise is rejected', async () => {
        fetchMock.mock('/not-found.partial.html', {
            status: 404
        });
        const pageContentService: IPageContentService = new PageContentService();
        await pageContentService.loadPage('not-found.partial')
        .catch((reason: any) => {
            expect(reason).to.be.equal(NavigationRejectionReason.notFound);
        });
    })
})