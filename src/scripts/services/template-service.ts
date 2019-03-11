import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES } from '../constructs';

export interface ITemplateService {
    createTemplate(identifier: string, htmlContent: string): void;
    createElementFromTemplate(identifier: string, context?: any): HTMLElement;
}

interface ITemplateItem {
    [key: string]: Handlebars.TemplateDelegate;
}

@injectable()
export class TemplateService implements ITemplateService {
    private templates: ITemplateItem = {};

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Handlebars) private compile:
            (input: any, options?: CompileOptions) => HandlebarsTemplateDelegate,
    ) {
    }

    public createTemplate(identifier: string, htmlContent: string): void {
        let compliedTemplate = this.templates[identifier];
        if (!compliedTemplate) {
            compliedTemplate = this.compile(htmlContent, null);
            this.templates[identifier] = compliedTemplate;
        }
    }

    public createElementFromTemplate(identifier: string, context?: any): HTMLElement {
        const compliedTemplate = this.templates[identifier];
        const html = compliedTemplate(context);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const element = doc.body.firstChild;
        return element as HTMLElement;
    }
}
