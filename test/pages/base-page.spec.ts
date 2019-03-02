import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { BasePage } from '../../src/scripts/pages/base-page';
import { IPage } from '../../src/scripts/constructs';
import { IPageContentService } from '../../src/scripts/services';
import { IRouter, IRouterRequest } from '../../src/scripts/infrastructure';

class TestPage extends BasePage {
    public requiresAuthentication: boolean = false;

    protected viewName: string = 'test.partial';
    protected bodyClasses: string[] = [
        'test',
    ];

    constructor(
        pageContentService: IPageContentService,
        router: IRouter,
    ) {
        super(pageContentService, router);
    }
}

describe('Base Page', () => {
    it('page life cycle completes', async () => {
        const mainContainer = document.createElement('main');
        mainContainer.classList.add('container');
        document.body.appendChild(mainContainer);
        document.body.classList.add('some-class');

        const element = document.createElement('div');
        const navigationLink = document.createElement('a');
        navigationLink.dataset.navigation = '';
        element.appendChild(navigationLink);

        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(element));
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        let routerCallback: boolean = false;
        router.setup((x) => x.attemptToNavigate(TypeMoq.It.isAnyString())).callback(() => {
            routerCallback = true;
        });
        const routerRequest: TypeMoq.IMock<IRouterRequest> = TypeMoq.Mock.ofType<IRouterRequest>();

        const testPage = new TestPage(pageContentService.object, router.object);

        const result = await testPage.init(routerRequest.object);
        navigationLink.click();
        expect(undefined).to.be.equal(result);
        expect(1).to.be.equal(document.body.classList.length);
        expect(true).to.be.equal(document.body.classList.contains('test'));
        expect(true).to.be.equal(routerCallback);
    });
});
