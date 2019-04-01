import { Validate } from '../infrastructure';

export enum ValidationStatus {
    notValidated,
    validationPassed,
    validationFailed,
}

export interface IValidationHelper {
    readonly validationStatus: ValidationStatus;
    validate(): Promise<void>;
}
export class ValidationHelper implements IValidationHelper {
    private elements: HTMLElement[];
    private validationStatusValue: ValidationStatus = ValidationStatus.notValidated;

    public get validationStatus(): ValidationStatus {
        return this.validationStatusValue;
    }

    constructor(private validator: Validate, private form: HTMLFormElement, private constraints: any) {
        if (this.form.dataset.noValidate !== undefined) {
            return;
        }

        this.elements = [];

        for (const constraint in constraints) {
            if (constraints.hasOwnProperty(constraint)) {
                const element = this.form.querySelector<HTMLElement>(`[name='${constraint}']`);
                if (element) {
                    element.dataset.hasValidation = 'true';
                    this.elements.push(element);
                }
            }
        }
    }

    public validate(): Promise<void> {
        if (this.form.dataset !== undefined && this.form.dataset.noValidate !== undefined) {
            this.validationStatusValue = ValidationStatus.validationPassed;
            return Promise.resolve();
        } else {
            return this.gatherValidationResults();
        }
    }

    private gatherValidationResults(): Promise<void> {
        const formValues = this.validator.collectFormValues(this.form);
        return this.validator.async(formValues, this.constraints).then((attributes: any) => {
            for (const element of this.elements) {
                this.decorateElement(element, attributes);
            }
            return Promise.resolve();
        }).catch((errors: any) => {
            if (errors instanceof Error) {
                return Promise.reject(errors);
            } else {
                for (const element of this.elements) {
                    this.decorateElement(element, errors);
                }
                return Promise.resolve();
            }
        });
    }

    private decorateElement(element: HTMLElement, validationResult: any) {
        const group = element.closest('.field');
        group.classList.remove('has-success');
        group.classList.remove('has-error');
        const name = element.attributes.getNamedItem('name').value;
        const helpblock = group.querySelector(`span[data-valmsg-for="${name}"]`);
        helpblock.innerHTML = '&nbsp;';
        this.validationStatusValue = ValidationStatus.validationPassed;
        if (validationResult) {
            const item = validationResult[name];
            if (item) {
                group.classList.add('has-error');
                helpblock.innerHTML = item[0];
                this.validationStatusValue = ValidationStatus.validationFailed;
            } else {
                group.classList.add('has-success');
            }
        } else {
            group.classList.add('has-success');
        }
    }
}
