import * as validate from 'validate.js';

export class Validation {
    private $elements: NodeListOf<HTMLInputElement|HTMLTextAreaElement>;

    constructor(private $form: HTMLFormElement, private constraints: any) {
        this.$elements = this.$form.querySelectorAll('input, textarea');
    }

    public validate(): Promise<void> {
        if (this.$form.dataset.noValidate) {
            return Promise.resolve();
        } else {
            if (this.performValidation()) {
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        }
    }

    private performValidation(): any {
        const formValues = validate.collectFormValues(this.$form);
        const validationResult = validate.validate(formValues, this.constraints);
        const self = this;
        Array.prototype.forEach.call(this.$elements,
            (element: HTMLElement) => {
                self.decorateElement(element, validationResult);
            });
        return validationResult;
    }

    private decorateElement(element: HTMLElement, validationResult: any) {
        const NAME: string = 'name';
        const group = element.closest('.field');
        group.classList.remove('has-success');
        group.classList.remove('has-error');
        const name = element.attributes[NAME].value;
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
