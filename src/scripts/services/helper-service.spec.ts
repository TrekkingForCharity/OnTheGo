import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import { Validate } from '../infrastructure';
import { HelperService } from './helper-service';

describe('Helper Service', () => {
    it('can generate a "ValidationHelper" instance', () => {
        const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();

        const form = document.createElement('form');

        const helperService = new HelperService(validator.object);
        const validationHelper =  helperService.generateValidationHelper(form, null);
        expect(validationHelper).to.be.not.equal(undefined);
    });
});
