import { injectable } from 'inversify';
import { IComponent } from '../constructs';

@injectable()
export class TrekItemComponent implements IComponent {
    public attachedTo: HTMLElement;
    public init(params?: any): Promise<void> {
        return Promise.resolve();
    }
}
