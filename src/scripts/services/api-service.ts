import { inject, injectable } from 'inversify';
import { IAuthenticationService } from '.';
import { IConfig } from '../infrastructure';
import { INFRASTRUCTURE_TYPES, SERVICE_TYPES } from '../constructs';

export enum CommandType  {
    QueryTreksForUser = 1,
}

export interface IApiService {
    execute<TResult>(queryType: CommandType, data?: any): Promise<TResult>;
}

@injectable()
export class ApiService implements IApiService {

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Config) private config: IConfig,
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService) {

    }

    public async execute<TResult>(queryType: CommandType, data?: any): Promise<TResult> {
        const headers = {};
        headers['Content-Type'] = 'application/json';
        const isAuthenticated = await this.authenticationService.isAuthenticated();
        if (isAuthenticated) {
            const token = await this.authenticationService.getToken();
            const AUTH_HEADER = 'Authorization';
            headers[AUTH_HEADER] = `Bearer ${token}`;
        }

        return fetch(`${this.config.api.url}/v1alpha1/graphql`, {
            body: JSON.stringify({
                query: queries[queryType],
                variables: data,
            }),
            headers,
            method: 'POST',
        })
        .then((response) => response.json());
    }
}

interface IHash {
    [indexer: number]: string;
}

const queries: IHash = {};
queries[CommandType.QueryTreksForUser] = `query treksForUser($userId: String) {
    trek(where: {createdBy: {_eq: $userId}}){
      id,
      name,
      slug,
      description,
      bannerImage,
      startLocation{
        name
      },
      finishLocation {
        name
      },
      whenStarting
    }
  }`;
