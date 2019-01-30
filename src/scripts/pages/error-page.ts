import { injectable } from 'inversify';
import { IPage } from '../constructs';
import { IRouterRequest } from '../infrastructure';

@injectable()
export class ErrorPage implements IPage {
    public readonly requiresAuthentication: boolean = false;

    public canNavigateTo(): Promise<void> {
        return Promise.resolve();
    }

    public canNavigateFrom(): Promise<void> {
        return Promise.resolve();
    }
    public init(req: IRouterRequest): Promise<void> {
        return Promise.resolve();
    }
}
