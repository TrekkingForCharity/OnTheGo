import { ProuterStringMap } from 'prouter';
import { IRouterRequest } from '../infrastucture/router';

export interface IPage {
    readonly requiresAuthentication: boolean;
    canNavigateTo(): Promise<void>;
    canNavigateFrom(): Promise<void>;
    init(req: IRouterRequest): Promise<void>;
}
