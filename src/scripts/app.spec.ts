import { expect } from 'chai';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { App } from './app';
import { IComponent } from './constructs';
import { IRouter } from './infrastructure';
import { IComponentService } from './services';

describe('App', () => {
    it('when all components resolve then then router is started', async () => {
        let called: boolean = false;
        const router: TypeMoq.IMock<IRouter> = TypeMoq.Mock.ofType<IRouter>();
        router.setup((x) => x.start()).callback(() => {
            called = true;
        });
        router.setup((x: any) => x.then).returns(() => undefined);
        const componentService: TypeMoq.IMock<IComponentService> = TypeMoq.Mock.ofType<IComponentService>();
        const component: TypeMoq.IMock<IComponent> = TypeMoq.Mock.ofType<IComponent>();
        component.setup((x: any) => x.then).returns(() => undefined);
        component.setup((x) => x.init()).returns(() => Promise.resolve());
        componentService.setup((x: any) => x.then).returns(() => undefined);
        componentService.setup((x) => x.loadComponentAndAttach(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
            .returns(() => Promise.resolve(component.object));
        const app = new App(router.object, componentService.object);

        await app.start();

        expect(true).to.be.equal(called);
    });
});
