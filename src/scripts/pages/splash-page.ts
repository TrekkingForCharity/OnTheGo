import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES, IPage, SERVICE_TYPES } from '../constructs';
import { IRouter } from '../infrastructure';
import { IPageContentService } from '../services';
import { BasePage } from './base-page';

@injectable()
export class SplashPage extends BasePage implements IPage {
    public requiresAuthentication: boolean = false;

    protected viewName: string = 'splash.partial';
    protected bodyClasses: string[] = [
        'splash',
    ];

    constructor(
        @inject(SERVICE_TYPES.PageContentService) pageContentService: IPageContentService,
        @inject(INFRASTRUCTURE_TYPES.Router) router: IRouter,
    ) {
        super(pageContentService, router);
    }

    public canNavigateTo(): Promise<void> {
        return Promise.resolve();
    }
    public canNavigateFrom(): Promise<void> {
        return Promise.resolve();
    }

}
