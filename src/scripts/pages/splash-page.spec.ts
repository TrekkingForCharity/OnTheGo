import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { IRouter } from '../infrastructure';
import { IPageContentService } from '../services';
import { SplashPage } from './';

describe('Splash Page', () => {
    it('page does not require authentication', () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: SplashPage = new SplashPage(pageContentService.object, router.object);
        expect(false).to.be.equal(page.requiresAuthentication);
    });
    it('page can be navigated to', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: SplashPage = new SplashPage(pageContentService.object, router.object);
        const result = await page.canNavigateTo();
        expect(undefined).to.be.equal(result);
    });

    it('page can be navigated from', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const page: SplashPage = new SplashPage(pageContentService.object, router.object);
        const result = await page.canNavigateFrom();
        expect(undefined).to.be.equal(result);
    });
});
