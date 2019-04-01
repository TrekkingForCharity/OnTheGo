import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { HeaderComponent } from './components';
import { COMPONENT_TYPES, INFRASTRUCTURE_TYPES, SERVICE_TYPES } from './constructs';
import { IRouter } from './infrastructure';
import { AppStart } from './infrastructure/app-start';
import { IComponentService } from './services/component-service';

@injectable()
export class App {
    public static create(): Promise<App> {
        if (document.readyState !== 'loading') {
            return AppStart.setup();
        }

        return new Promise((resolve, reject) => {
            function handleUpload(event) {
                document.removeEventListener('change', handleUpload);
                resolve(AppStart.setup());
            }
            document.addEventListener('DOMContentLoaded', handleUpload);
        });
    }

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Router) private router: IRouter,
        @inject(SERVICE_TYPES.ComponentService) private componetService: IComponentService) {
    }

    public start(): Promise<void> {
        const self = this;
        const headerElement: HTMLElement = document.querySelector('#main-nav');
        return this.componetService.loadComponentAndAttach(COMPONENT_TYPES.HeaderComponent, headerElement)
            .then((header) => {
                return header.init().then(() => {
                    self.router.start();
                    return Promise.resolve();
                });
            });
    }

}

App.create().then((app: App) => {
    app.start();
});
