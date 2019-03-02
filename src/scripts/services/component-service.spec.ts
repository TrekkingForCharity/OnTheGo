import { expect } from 'chai';
import { Container } from 'inversify';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { HeaderComponent } from '../components';
import { IRouter } from '../infrastructure';
import { ComponentService, IAuthenticationService } from './';

describe('Component Service', () => {
    const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
    const authenticationService: TypeMoq.IMock<IAuthenticationService> =
        TypeMoq.Mock.ofType<IAuthenticationService>();
    const component: HeaderComponent = new HeaderComponent(router.object, authenticationService.object);

    it('when component is found component is returned with element attached', async () => {
        const sym = Symbol('test');
        const element: TypeMoq.IMock<HTMLElement> = TypeMoq.Mock.ofType<HTMLElement>();
        const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
        container.setup((x) => x.get(TypeMoq.It.isAny())).returns(() => component);
        const componentService: ComponentService = new ComponentService(container.object);
        const result = await componentService.loadComponentAndAttach(sym, element.object);
        expect(component).to.be.equal(result);
        expect(element.object).to.be.equal(result.attachedTo);
    });
    it('when component is not found expect rejection', async () => {
        const sym = Symbol('test');
        const element: TypeMoq.IMock<HTMLElement> = TypeMoq.Mock.ofType<HTMLElement>();
        const container: TypeMoq.IMock<Container> = TypeMoq.Mock.ofType(Container);
        container.setup((x) => x.get(TypeMoq.It.isAny())).returns(() => null);
        const componentService: ComponentService = new ComponentService(container.object);
        try {
            await await componentService.loadComponentAndAttach(sym, element.object);
        } catch (err) {
            expect(err).to.equal(undefined);
        }
    });
});
