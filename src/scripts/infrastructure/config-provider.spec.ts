import { expect } from 'chai';
import * as fetchMock from 'fetch-mock';
import 'reflect-metadata';
import { ConfigProvider, IConfig } from '.';

describe('Config Provider', () => {
    afterEach(fetchMock.restore);
    it('when loading config expect valid config', async () => {
        const config: IConfig = {
            auth: {
                authority: 'authority',
                automaticSilentRenew: true,
                clientId: 'clientId',
                loadUserInfo: true,
                redirectUri: 'redirectUri',
                responseType: 'responseType',
                silentRedirectUri: 'silentRedirectUri',
            },
        };
        fetchMock.mock('/config.json', {
            body: JSON.stringify(config),
            status: 200,
        });

        const configProvider = new ConfigProvider();
        const result = await configProvider.loadConfig();
        expect(JSON.stringify(config)).to.be.equal(JSON.stringify(result));
    });
    it('when config fails to load expect defaults', async () => {
        fetchMock.mock('/config.json', {
            status: 404,
        });
        const configProvider = new ConfigProvider();
        const result = await configProvider.loadConfig();
        expect('UNKNOWN_DEFAULT').to.be.equal(result.auth.authority);
    });
});
