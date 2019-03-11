describe('Validation', () => {
    it('when form is set as no-validate the promise should resolve', async () => {
        const form = document.createElement('form');
        form.dataset.noValidate = 'true';

        const validation = new Validation(form, null);
    })
})