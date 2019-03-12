import * as validate from 'validate.js';

export class ValidationHelper {
    private formSubmitted: boolean;
    private elements: HTMLElement[];
    private hasValidated: boolean = false;

    constructor(private form: HTMLFormElement, private constraints: any) {
        if (this.form.dataset.noValidate) {
            return;
        }

        this.formSubmitted = false;

        this.elements = [];

        for (const constraint in constraints) {
            if (constraints.hasOwnProperty(constraint)) {
                this.elements.push(this.form.querySelector(`[name='${constraint}']`));
            }
        }
    }

    public validate(): Promise<void> {
        if (this.form.dataset.noValidate) {
           return Promise.resolve();
        } else {
            this.hasValidated = true;
            return this.gatherValidationResults();
        }
    }

    private gatherValidationResults(): Promise<void> {
        const formValues = validate.collectFormValues(this.form);
        return validate.async(formValues, this.constraints).then((attributes: any) => {
            for (const element of this.elements) {
                this.decorateElement(element, attributes);
            }
            return Promise.resolve();
        });
    }

    private decorateElement(element: HTMLElement, validationResult: any) {
        const group = element.closest('.field');
        group.classList.remove('has-success');
        group.classList.remove('has-error');
        const name = element.attributes.getNamedItem('name').value;
        const helpblock = group.querySelector(`span[data-valmsg-for="${name}"]`);
        helpblock.innerHTML = '&nbsp;';
        if (validationResult) {
            const item = validationResult[name];
            if (item) {
                group.classList.add('has-error');
                helpblock.innerHTML = item[0];
            } else {
                group.classList.add('has-success');
            }
        } else {
            group.classList.add('has-success');
        }
    }
}
