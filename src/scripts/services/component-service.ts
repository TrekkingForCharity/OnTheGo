import { Container, inject, injectable } from 'inversify';
import { IComponent, INFRASTRUCTURE_TYPES } from '../constructs';

export interface IComponentService {
    loadComponentAndAttach<TComponent extends IComponent>(type: symbol, element: HTMLElement): Promise<TComponent>;
}

@injectable()
export class ComponentService implements IComponentService {
     constructor(@inject(INFRASTRUCTURE_TYPES.Container) private container: Container) {

    }

    public loadComponentAndAttach<TComponent extends IComponent>(type: symbol, element: HTMLElement):
        Promise<TComponent> {
        const component = this.container.get<TComponent>(type);
        if (!component) {
             return Promise.reject();
         }
        component.attachedTo = element;
        return Promise.resolve(component);
    }
}
