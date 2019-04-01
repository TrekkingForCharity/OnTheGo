import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { FooterComponent } from '.';
import { IRouter } from '../infrastructure';

describe('Footer Component', () => {
    it('when contact click navigation is attempted', () => {
        const footer = document.createElement('footer');
        const contactLink = document.createElement('a');
        contactLink.href = '/contact';
        contactLink.dataset.navigation = '';
        footer.appendChild(contactLink);

        let called: boolean = false;
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();

        router.setup((x) => x.attemptToNavigate(TypeMoq.It.isAny())).callback(() => {
            called = true;
        });

        const component: FooterComponent = new FooterComponent(router.object);
        component.attachedTo = footer;
        component.init();

        contactLink.click();
        expect(true).to.be.equal(called);
    });
});
