import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import { ErrorPage } from "../../src/scripts/pages";
import { IPageContentService } from '../../src/scripts/services';
import { IRouter } from '../../src/scripts/infrastructure';

describe('Error Page', () => {
    it('page does not require authentication', () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object);
        expect(false).to.be.equal(page.requiresAuthentication);
    });
    it('page can be navigated to', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object);
        const result = await page.canNavigateTo();
        expect(undefined).to.be.equal(result);
    });

    it('page can be navigated from', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: ErrorPage = new ErrorPage(pageContentService.object, router.object);
        const result = await page.canNavigateFrom();
        expect(undefined).to.be.equal(result);
    });
});
