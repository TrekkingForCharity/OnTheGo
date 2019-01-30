import { IRouterRequest } from '../infrastructure';

export interface IPage {
    readonly requiresAuthentication: boolean;
    canNavigateTo(): Promise<void>;
    canNavigateFrom(): Promise<void>;
    init(req: IRouterRequest): Promise<void>;
}
