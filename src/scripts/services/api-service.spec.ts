import { expect } from 'chai';
import * as fetchMock from 'fetch-mock';
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { IAuthenticationService } from '.';
import { IConfig } from '../infrastructure';
import { ApiService, CommandType } from './api-service';

const config: TypeMoq.IMock<IConfig> = TypeMoq.Mock.ofType<IConfig>();
config.setup((x) => x.api).returns(() => {
    return {
        url: 'http://example.com/api',
    };
});
describe('Api service', () => {
    afterEach(fetchMock.restore);

    describe('execute', () => {
        it('request should be via post', async () => {
            fetchMock.post('http://example.com/api/v1alpha1/graphql', {
                body: '{}',
                status: 200,
            });

            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();

            const apiService = new ApiService(config.object, authenticationService.object);
            await apiService.execute(CommandType.QueryTreksForUser);
            expect(fetchMock.lastOptions().method).to.equal('POST');

        });
        it('request should be json content type', async () => {
            fetchMock.post('http://example.com/api/v1alpha1/graphql', {
                body: '{}',
                status: 200,
            });
            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();

            const apiService = new ApiService(config.object, authenticationService.object);
            await apiService.execute(CommandType.QueryTreksForUser);

            expect(fetchMock.lastOptions().headers['Content-Type']).to.equal('application/json');
        });
        it('request should be have auth header when user authenticated', async () => {
            fetchMock.post('http://example.com/api/v1alpha1/graphql', {
                body: '{}',
                status: 200,
            });

            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();
            authenticationService.setup((x) => x.isAuthenticated()).returns(() => Promise.resolve(true));
            authenticationService.setup((x) => x.getToken()).returns(() => Promise.resolve('some-token'));

            const apiService = new ApiService(config.object, authenticationService.object);
            await apiService.execute(CommandType.QueryTreksForUser);
            const AUTH_HEADER = 'Authorization';
            expect(fetchMock.lastOptions().headers[AUTH_HEADER]).to.equal(`Bearer some-token`);
        });
        it('query in body only when no data is passed in', async () => {
            fetchMock.post('http://example.com/api/v1alpha1/graphql', {
                body: '{}',
                status: 200,
            });

            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();

            const apiService = new ApiService(config.object, authenticationService.object);
            await apiService.execute(CommandType.QueryTreksForUser);
            const bodyJson = fetchMock.lastCall()[1].body.toString();
            const body = JSON.parse(bodyJson);
            expect(body.query).to.not.equal(undefined);
        });
        it('query and variables in body when data is passed in', async () => {
            fetchMock.post('http://example.com/api/v1alpha1/graphql', {
                body: '{}',
                status: 200,
            });

            const authenticationService: TypeMoq.IMock<IAuthenticationService> =
                TypeMoq.Mock.ofType<IAuthenticationService>();

            const apiService = new ApiService(config.object, authenticationService.object);
            await apiService.execute(CommandType.QueryTreksForUser, {foo: 'bar'});
            const bodyJson = fetchMock.lastCall()[1].body.toString();
            const body = JSON.parse(bodyJson);
            expect(body.query).to.not.equal(undefined);
            expect(body.variables).to.not.equal(undefined);
         });
    });
});
