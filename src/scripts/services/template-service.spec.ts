import { expect } from 'chai';
import 'reflect-metadata';
import { TemplateService } from './template-service';

const domParserName: string = 'DOMParser';
describe('Template Service', () => {
    before(() => {
        global[domParserName] = window[domParserName];
    });
    describe('Create Template', () => {
        it('Compile is called when template does not exist', () => {
            let called: number = 0;
            function compileFunc(input: any, options?: CompileOptions): HandlebarsTemplateDelegate {
                called++;
                return ('template-data' as any);
            }
            const templateService: TemplateService = new TemplateService(compileFunc);
            templateService.createTemplate('test-template', '<div></div>');
            expect(1).to.be.equal(called);
        });
        it('Compile is not called when template exists', () => {
            let called: number = 0;
            function compileFunc(input: any, options?: CompileOptions): HandlebarsTemplateDelegate {
                called++;
                return ('template-data' as any);
            }
            const templateService: TemplateService = new TemplateService(compileFunc);
            templateService.createTemplate('test-template', '<div></div>');
            templateService.createTemplate('test-template', '<div></div>');
            expect(1).to.be.equal(called);
        });
    });
    describe('Create Element From Template', () => {
        it('templated element is returned', () => {
            function compileFunc(input: any, options?: CompileOptions): HandlebarsTemplateDelegate {
                return (context: any): string => {
                    return input;
                };
            }
            const templateService: TemplateService = new TemplateService(compileFunc);
            templateService.createTemplate('test-template', '<div>template-data</div>');
    
            const element = templateService.createElementFromTemplate('test-template', {});
            expect('<div>template-data</div>').to.be.equal(element.outerHTML);
        });
    });
});
