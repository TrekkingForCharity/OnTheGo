import { expect } from 'chai';
import * as TypeMoq from 'typemoq';
import { ValidationHelper, ValidationStatus } from '.';
import { Validate } from '../infrastructure';

describe('Validation Helper', () => {
    describe('constructor', () => {
        it('when form has "noValidate" then elements are not decorated', () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();

            const form = document.createElement('form');
            form.dataset.noValidate = '';
            const textInput = document.createElement('input');
            textInput.type = 'text';
            const emailInput = document.createElement('input');
            emailInput.type = 'email';

            form.appendChild(textInput);
            form.appendChild(emailInput);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, undefined);
            expect(0).to.be.equal(form.querySelectorAll('[data-has-validation]').length);
        });
        it('ensure that form elemants are decorated', () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();

            const form = document.createElement('form');
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.name = 'name';
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.name = 'email';

            form.appendChild(textInput);
            form.appendChild(emailInput);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                email: {
                    presence: true,
                },
                name: {
                    presence: true,
                },
            });
            expect(2).to.be.equal(form.querySelectorAll('[data-has-validation]').length);
        });
    });
    describe('validate', () => {
        it('ensure promise resolves when form has "noValidate"', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();

            const form = document.createElement('form');
            form.dataset.noValidate = '';

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, undefined);
            const result = await validationHelper.validate();
            expect(undefined).to.be.equal(result);
        });
        it('ensure validation has passed when form has "noValidate"', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();

            const form = document.createElement('form');
            form.dataset.noValidate = '';

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, undefined);
            await validationHelper.validate();
            expect(ValidationStatus.validationPassed).to.be.equal(validationHelper.validationStatus);
        });
        it('ensure promise resolves when from is validated', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();
            validator.setup((x: any) => x.then).returns(() => undefined);
            validator.setup((x) => x.async(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());
            const form = document.createElement('form');

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                email: {
                    presence: true,
                },
                name: {
                    presence: true,
                },
            });
            const result = await validationHelper.validate();
            expect(undefined).to.be.equal(result);
        });
        it('ensure elements are decorated when form is validated', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();
            validator.setup((x: any) => x.then).returns(() => undefined);
            validator.setup((x) => x.async(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve({
                name: ['error message'],
            }));
            const form = document.createElement('form');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('field');
            const nameHelpBlock = document.createElement('span');
            nameHelpBlock.dataset.valmsgFor = 'name';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = 'name';
            nameContainer.appendChild(nameInput);
            nameContainer.appendChild(nameHelpBlock);

            const emailContainer = document.createElement('div');
            emailContainer.classList.add('field');
            const emailHelpBlock = document.createElement('span');
            emailHelpBlock.dataset.valmsgFor = 'email';
            const emailInput = document.createElement('input');
            emailInput.type = 'text';
            emailInput.name = 'email';
            emailInput.value = 'something';
            emailContainer.appendChild(emailInput);
            emailContainer.appendChild(emailHelpBlock);

            form.appendChild(nameContainer);
            form.appendChild(emailContainer);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                email: {
                    presence: true,
                },
                name: {
                    presence: true,
                },
            });

            await validationHelper.validate();
            expect(true).to.be.equal(nameContainer.classList.contains('has-error'));
            expect('error message').to.be.equal(nameHelpBlock.innerHTML);
            expect(true).to.be.equal(emailContainer.classList.contains('has-success'));
            expect('&nbsp;').to.be.equal(emailHelpBlock.innerHTML);
        });
        it('ensure validation has passed when form is valid', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();
            validator.setup((x: any) => x.then).returns(() => undefined);
            validator.setup((x) => x.async(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());
            const form = document.createElement('form');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('field');
            const nameHelpBlock = document.createElement('span');
            nameHelpBlock.dataset.valmsgFor = 'name';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = 'name';
            nameContainer.appendChild(nameInput);
            nameContainer.appendChild(nameHelpBlock);

            form.appendChild(nameContainer);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                name: {
                    presence: true,
                },
            });

            await validationHelper.validate();
            expect(ValidationStatus.validationPassed).to.be.equal(validationHelper.validationStatus);
        });

        it('ensure validation has failed when form is invalid', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();
            validator.setup((x: any) => x.then).returns(() => undefined);
            validator.setup((x) => x.async(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.reject({
                name: ['error message'],
            }));
            const form = document.createElement('form');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('field');
            const nameHelpBlock = document.createElement('span');
            nameHelpBlock.dataset.valmsgFor = 'name';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = 'name';
            nameContainer.appendChild(nameInput);
            nameContainer.appendChild(nameHelpBlock);

            form.appendChild(nameContainer);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                name: {
                    presence: true,
                },
            });

            await validationHelper.validate();
            expect(ValidationStatus.validationFailed).to.be.equal(validationHelper.validationStatus);
        });
        it('ensure reject it cascaded if validator fails', async () => {
            const validator: TypeMoq.IMock<Validate> =
            TypeMoq.Mock.ofType<Validate>();
            validator.setup((x: any) => x.then).returns(() => undefined);
            validator.setup((x) => x.async(TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => Promise.reject(new Error('some error')));
            const form = document.createElement('form');

            const nameContainer = document.createElement('div');
            nameContainer.classList.add('field');
            const nameHelpBlock = document.createElement('span');
            nameHelpBlock.dataset.valmsgFor = 'name';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.name = 'name';
            nameContainer.appendChild(nameInput);
            nameContainer.appendChild(nameHelpBlock);

            form.appendChild(nameContainer);

            const validationHelper: ValidationHelper = new ValidationHelper(validator.object, form, {
                name: {
                    presence: true,
                },
            });

            await validationHelper.validate().catch((error: Error) => {
                expect('some error').to.be.equal(error.message);
            });
        });


    });
});
