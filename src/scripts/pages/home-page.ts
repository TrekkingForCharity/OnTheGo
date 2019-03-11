import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES, IPage, SERVICE_TYPES, COMPONENT_TYPES } from '../constructs';
import { PullOut } from '../helpers/pull-out';
import { IRouter, IRouterRequest } from '../infrastructure';
import { IPageContentService, IComponentService } from '../services';
import { BasePage } from './base-page';
import { ITemplateService } from '../services/template-service';

@injectable()
export class HomePage extends BasePage implements IPage {
    public requiresAuthentication: boolean = true;

    protected viewName: string = 'home.partial';
    protected bodyClasses: string[];

    private readonly data: IBasicTrek[] = [{
        imageUri: 'http://lorempixel.com/400/200',
        name: 'trek 1',
        trekId: '6e539062-f470-434f-a20b-453da582e3fd',
        userId: 'auth0|59d3d45e02b12d4a9da1c7a3',
        whenToStart: 1542754102,
    }, {
        imageUri: '',
        name: 'trek 2',
        trekId: '64d766aa-2356-434b-9eb3-8af1a82911cb',
        userId: 'user1',
        whenToStart: 1542754102,
    }, {
        imageUri: '',
        name: 'trek 3',
        trekId: '3629365e-8c8b-4bdc-ad9c-274a11671bda',
        userId: 'user1',
        whenToStart: 1542754102,
    }, {
        imageUri: '',
        name: 'trek 4',
        trekId: '6a0eb8ab-401e-478d-b240-13a3ebbbee67',
        userId: 'user1',
        whenToStart: 1542754102,
    }, {
        imageUri: '',
        name: 'trek 5',
        trekId: '7ae7d842-70b1-4503-835b-e3e452f5cb23',
        userId: 'user1',
        whenToStart: 1542754102,
    }];

    private createTrekFlipOut: PullOut;
    private createTrekForm: HTMLFormElement;

    constructor(
        @inject(SERVICE_TYPES.PageContentService) pageContentService: IPageContentService,
        @inject(INFRASTRUCTURE_TYPES.Router) router: IRouter,
        @inject(SERVICE_TYPES.TemplateService) private templateService: ITemplateService,
        @inject(SERVICE_TYPES.ComponentService) private componentService: IComponentService,
    ) {
        super(pageContentService, router);
    }

    public canNavigateTo(): Promise<void> {
        return Promise.resolve();
    }

    public canNavigateFrom(): Promise<void> {
        return Promise.resolve();
    }

    protected loadAndProcessPageData(req: IRouterRequest): Promise<void> {
        const self = this;
        return super.loadAndProcessPageData(req)
        .then(() => {
            self.createTrekForm = self.pageContent.querySelector('form#create-trek');
            self.createTrekFlipOut = new PullOut({
                attachTo: document.body,
                content: self.createTrekForm,
            });

            const newTrek: HTMLAnchorElement = self.pageContent.querySelector('#new-trek');
            newTrek.onclick = (event: Event) => {
                self.createTrekFlipOut.show();
            };

            self.createTrekForm.onsubmit = (event: Event) => {
                event.preventDefault();
                self.createTrekFlipOut.close();
            };
            self.templateService.createTemplate('trek-item',
                self.pageContent.querySelector('#trek-item').innerHTML);

            const myTreks = self.pageContent.querySelector('#my-treks');

            for (let trekCount = 0; trekCount < self.data.length; trekCount++) {
                const compliedTemplate = self.templateService.createElementFromTemplate('trek-item', {
                    bannerImage: self.data[trekCount].imageUri,
                    description: '',
                    editDetailsUrl: `/trek/${self.data[trekCount].trekId}/edit-details`,
                    editLocationsUrl: `/trek/${self.data[trekCount].trekId}/plan`,
                    title: self.data[trekCount].name,
                    viewUrl: `/trek/${self.data[trekCount].trekId}`,
                });
                self.componentService.loadComponentAndAttach(COMPONENT_TYPES.TrekItemComponent, compliedTemplate);
                myTreks.appendChild(compliedTemplate);
            }

        });
    }
}

interface IBasicTrek {
    trekId: string;
    userId: string;
    whenToStart: number|null;
    name: string;
    imageUri: string|null;
}
