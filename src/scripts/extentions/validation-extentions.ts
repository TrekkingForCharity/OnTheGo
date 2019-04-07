import { Validate } from '../infrastructure';

export class ValidationExtentions {
    constructor(private validator: Validate) {
        this.validator.validators.uniqueTrekName = this.uniqueTrekName;
    }

    private uniqueTrekName(value: any): Promise<any> {
        return Promise.resolve();
    }
}
