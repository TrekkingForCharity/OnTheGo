import { inject, injectable } from 'inversify';
import { IAuthenticationService } from '.';
import { INFRASTRUCTURE_TYPES, SERVICE_TYPES } from '../constructs';
import { IConfig } from '../infrastructure';

export enum CommandType  {
    QueryTreksForUser = 1,
    CreateTrek = 2,
}

export interface IApiService {
    execute<TResult>(queryType: CommandType): Promise<TResult>;
    executeWithParameters<TResult, TData>(queryType: CommandType, data: TData): Promise<TResult>;
}

@injectable()
export class ApiService implements IApiService {

    constructor(
        @inject(INFRASTRUCTURE_TYPES.Config) private config: IConfig,
        @inject(SERVICE_TYPES.AuthenticationService) private authenticationService: IAuthenticationService) {

    }

    public async execute<TResult>(queryType: CommandType): Promise<TResult> {
        const headers = await this.generateHeaders();
        const body = JSON.stringify({
            query: queries[queryType],
        });

        return this.performFetch(body, headers);
    }

    public async executeWithParameters<TResult, TData>(queryType: CommandType, data: TData): Promise<TResult> {
        const headers = await this.generateHeaders();
        const body = JSON.stringify({
            query: queries[queryType],
            variables: data,
        });
        return this.performFetch(body, headers);
    }

    private performFetch<TResult>(body: BodyInit, headers: HeadersInit): Promise<TResult> {
        return fetch(`${this.config.api.url}/v1alpha1/graphql`, {
            body,
            headers,
            method: 'POST',
        })
        .then((response) => response.json());
    }

    private async generateHeaders(): Promise<HeadersInit> {
        const headers = {};
        headers['Content-Type'] = 'application/json';
        const isAuthenticated = await this.authenticationService.isAuthenticated();
        if (isAuthenticated) {
            const token = await this.authenticationService.getToken();
            const AUTH_HEADER = 'Authorization';
            headers[AUTH_HEADER] = `Bearer ${token}`;
        }
        return Promise.resolve(headers);
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
queries[CommandType.CreateTrek] = `mutation CreateTrekForUser() {
    insert_trek(objects: $objects) {
        returning {
        }
      }
    }`;
