
import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES } from '../constructs';
import { IValidationHelper, ValidationHelper } from '../helpers';
import { Validate } from '../infrastructure';

export interface IHelperService {
    generateValidationHelper(form: HTMLFormElement, constraints: any): IValidationHelper;
}

@injectable()
export class HelperService implements IHelperService {
    constructor(
        @inject(INFRASTRUCTURE_TYPES.Validator) private validator: Validate,
    ) {
    }

    public generateValidationHelper(form: HTMLFormElement, constraints: any): IValidationHelper {
        return new ValidationHelper(this.validator, form, constraints);
    }
}
