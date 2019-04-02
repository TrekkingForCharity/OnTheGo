import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { ContactPage } from '.';
import { IValidationHelper } from '../helpers';
import { IRouter, IRouterRequest } from '../infrastructure';
import { IHelperService, IPageContentService } from '../services';

describe('Contact Page', () => {
    it('page does not require authentication', () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);
        expect(false).to.be.equal(page.requiresAuthentication);
    });
    it('page can be navigated to', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);
        const result = await page.canNavigateTo();
        expect(undefined).to.be.equal(result);
    });
    it('page can be navigated from', async () => {
        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);
        const result = await page.canNavigateFrom();
        expect(undefined).to.be.equal(result);
    });
    it('ensure page initializes correctly', async () => {
        const mainContainer = document.createElement('main');
        mainContainer.classList.add('container');
        document.body.appendChild(mainContainer);
        document.body.classList.add('some-class');

        const element = document.createElement('div');
        const contactForm = document.createElement('form');
        contactForm.id = 'contact-form';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        contactForm.appendChild(submitButton);
        element.appendChild(contactForm);

        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(element));
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const validationHelper: TypeMoq.IMock<IValidationHelper> = TypeMoq.Mock.ofType<IValidationHelper>();
        helperService.setup((x) => x.generateValidationHelper(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => validationHelper.object);
        const routerRequest: TypeMoq.IMock<IRouterRequest> =
            TypeMoq.Mock.ofType<IRouterRequest>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);

        const result = await page.init(routerRequest.object);
        expect(undefined).to.be.equal(result);
    });
    it('ensure validation is called when form submits', async () => {
        const mainContainer = document.createElement('main');
        mainContainer.classList.add('container');
        document.body.appendChild(mainContainer);
        document.body.classList.add('some-class');

        const element = document.createElement('div');
        const contactForm = document.createElement('form');
        contactForm.id = 'contact-form';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        contactForm.appendChild(submitButton);
        element.appendChild(contactForm);

        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(element));
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const validationHelper: TypeMoq.IMock<IValidationHelper> = TypeMoq.Mock.ofType<IValidationHelper>();
        let validationCallback: boolean = false;
        validationHelper.setup((x) => x.validate())
            .callback(() => validationCallback = true )
            .returns(() => Promise.resolve());
        helperService.setup((x) => x.generateValidationHelper(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => validationHelper.object);
        const routerRequest: TypeMoq.IMock<IRouterRequest> =
            TypeMoq.Mock.ofType<IRouterRequest>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);

        await page.init(routerRequest.object);

        contactForm.submit();
        expect(true).to.be.equal(validationCallback);
    });
    it('ensure submit is enabled after a success', async () => {
        const mainContainer = document.createElement('main');
        mainContainer.classList.add('container');
        document.body.appendChild(mainContainer);
        document.body.classList.add('some-class');

        const element = document.createElement('div');
        const contactForm = document.createElement('form');
        contactForm.id = 'contact-form';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        contactForm.appendChild(submitButton);
        element.appendChild(contactForm);

        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(element));
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const validationHelper: TypeMoq.IMock<IValidationHelper> = TypeMoq.Mock.ofType<IValidationHelper>();
        validationHelper.setup((x) => x.validate())
            .returns(() => Promise.resolve());
        helperService.setup((x) => x.generateValidationHelper(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => validationHelper.object);
        const routerRequest: TypeMoq.IMock<IRouterRequest> =
            TypeMoq.Mock.ofType<IRouterRequest>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);

        await page.init(routerRequest.object);

        contactForm.submit();
        await delay(500);
        expect(false).to.be.equal(submitButton.hasAttribute('disabled'));
    });
    it('ensure submit is enabled after a failure', async () => {
        const mainContainer = document.createElement('main');
        mainContainer.classList.add('container');
        document.body.appendChild(mainContainer);
        document.body.classList.add('some-class');

        const element = document.createElement('div');
        const contactForm = document.createElement('form');
        contactForm.id = 'contact-form';
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        contactForm.appendChild(submitButton);
        element.appendChild(contactForm);

        const pageContentService: TypeMoq.IMock<IPageContentService> = TypeMoq.Mock.ofType<IPageContentService>();
        pageContentService.setup((x) => x.loadPage(TypeMoq.It.isAnyString())).returns(() => Promise.resolve(element));
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        const helperService: TypeMoq.IMock<IHelperService> = TypeMoq.Mock.ofType<IHelperService>();
        const validationHelper: TypeMoq.IMock<IValidationHelper> = TypeMoq.Mock.ofType<IValidationHelper>();
        validationHelper.setup((x) => x.validate())
            .returns(() => Promise.reject());
        helperService.setup((x) => x.generateValidationHelper(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => validationHelper.object);
        const routerRequest: TypeMoq.IMock<IRouterRequest> =
            TypeMoq.Mock.ofType<IRouterRequest>();
        const page: ContactPage = new ContactPage(pageContentService.object, router.object, helperService.object);

        await page.init(routerRequest.object);

        contactForm.submit();
        await delay(500);
        expect(false).to.be.equal(submitButton.hasAttribute('disabled'));
    });
});

function delay(ms: number) {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
}
