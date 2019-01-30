import 'reflect-metadata';
import { AppStart } from './infrastructure/app-start';

export class App {
    constructor() {
        const self = this;
        if (document.readyState !== 'loading') {
            this.init();
        } else {
            document.addEventListener('DOMContentLoaded', (e: Event) => self.init());
        }
    }

    private init() {
        AppStart.setup();
    }
}
