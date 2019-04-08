export interface IConfig {
    auth: {
        authority: string;
        automaticSilentRenew: boolean;
        clientId: string;
        loadUserInfo: boolean;
        redirectUri: string;
        responseType: string;
        silentRedirectUri: string;
    };
}

export class ConfigProvider {
    private default: IConfig = {
        auth: {
            authority: 'UNKNOWN_DEFAULT',
            automaticSilentRenew: false,
            clientId: 'UNKNOWN_DEFAULT',
            loadUserInfo: false,
            redirectUri: 'UNKNOWN_DEFAULT',
            responseType: 'UNKNOWN_DEFAULT',
            silentRedirectUri: 'UNKNOWN_DEFAULT',
        },
    };

    public loadConfig(): Promise<IConfig> {
        return fetch('/config.json', {
            method: 'get',
        }).then((response) => {
            return response.json();
        })
        .catch((reason: any) => {
            return Promise.resolve(this.default);
        });
    }
}
