import { inject, injectable } from 'inversify';
import { COMPONENT_TYPES, INFRASTRUCTURE_TYPES, IPage, SERVICE_TYPES } from '../constructs';
import { PullOut } from '../helpers/pull-out';
import { IRouter, IRouterRequest } from '../infrastructure';
import { IComponentService, IHelperService, IPageContentService, ITemplateService  } from '../services';
import { BasePage } from './base-page';

@injectable()
export class HomePage extends BasePage implements IPage {
    public requiresAuthentication: boolean = true;

    protected viewName: string = 'home.partial';
    protected bodyClasses: string[];

    private createTrekFlipOut: PullOut;
    private trekDetails: HTMLFormElement;
    private trekImage: HTMLFormElement;

    constructor(
        @inject(SERVICE_TYPES.PageContentService) pageContentService: IPageContentService,
        @inject(INFRASTRUCTURE_TYPES.Router) router: IRouter,
        @inject(SERVICE_TYPES.TemplateService) private templateService: ITemplateService,
        @inject(SERVICE_TYPES.ComponentService) private componentService: IComponentService,
        @inject(SERVICE_TYPES.HelperService) private helperService: IHelperService,
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

            self.templateService.createTemplate('trek-item',
                self.pageContent.querySelector('#trek-item').innerHTML);

            const myTreks = self.pageContent.querySelector('#my-treks');

            // for (let trekCount = 0; trekCount < self.data.length; trekCount++) {
            //     const compliedTemplate = self.templateService.createElementFromTemplate('trek-item', {
            //         bannerImage: self.data[trekCount].imageUri,
            //         description: '',
            //         editDetailsUrl: `/trek/${self.data[trekCount].trekId}/edit-details`,
            //         editLocationsUrl: `/trek/${self.data[trekCount].trekId}/plan`,
            //         title: self.data[trekCount].name,
            //         viewUrl: `/trek/${self.data[trekCount].trekId}`,
            //     });
            //     self.componentService.loadComponentAndAttach(COMPONENT_TYPES.TrekItemComponent, compliedTemplate);
            //     myTreks.appendChild(compliedTemplate);
            // }
        });
    }

    protected postRender(): Promise<void> {
        this.setupNewTrekProcess();
        return Promise.resolve();
    }

    private setupNewTrekProcess(): void {
        const newTrek: HTMLAnchorElement = this.pageContent.querySelector('#new-trek');
        newTrek.onclick = (event: Event) => {
            this.createTrekFlipOut.show();
        };
        this.setupBasicDetails();
        this.setupImage();

        this.createTrekFlipOut = new PullOut({
            attachTo: document.body,
            colWidth: 'is-8',
            content: this.pageContent.querySelector('#create-trek'),
        });
    }

    private setupBasicDetails(): void {
        const self = this;
        this.trekDetails = this.pageContent.querySelector('#trek-details');

        this.helperService.generateValidationHelper(this.trekDetails, {
            name: {
            }
        })

        this.trekDetails.onsubmit = (event: Event) => {
            event.preventDefault();
            self.setActiveStep('trek-image');
        };
    }
    private setupImage(): void {
        const self = this;
        this.trekImage = this.pageContent.querySelector('#trek-image');
        this.trekImage.onsubmit = (event: Event) => {
            event.preventDefault();
            self.setActiveStep('trek-location');
        };
    }

    private setActiveStep(formId: string): void {
        let activeStep = this.createTrekFlipOut.contentContainer.querySelector('.steps-segment.is-active');
        activeStep.classList.remove('is-active');
        activeStep = this.createTrekFlipOut.contentContainer.querySelector(`.steps-segment[data-step="${formId}"]`);
        activeStep.classList.add('is-active');

        let activeForm = this.createTrekFlipOut.contentContainer.querySelector('#create-trek form:not(.is-hidden)');
        activeForm.classList.add('is-hidden');
        activeForm = this.createTrekFlipOut.contentContainer.querySelector(`#create-trek form#${formId}`);
        activeForm.classList.remove('is-hidden');
    }
}
