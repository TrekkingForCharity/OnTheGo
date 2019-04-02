import { injectable } from 'inversify';

export interface IStorageProvider {
    readonly length: number;
    setItem(key: string, value: string);
    clear();
    getItem(key: string): string;
    key(index: number): string;
    removeItem(key: string);
}

@injectable()
export class SessionStorageProvider implements IStorageProvider {
    public setItem(key: string, value: string) {
        sessionStorage.setItem(key, value);
    }
    public clear() {
        sessionStorage.clear();
    }
    public getItem(key: string): string {
        return sessionStorage.getItem(key);
    }
    public key(index: number): string {
        return sessionStorage.key(index);
    }
    public removeItem(key: string) {
        sessionStorage.removeItem(key);
    }
    public get length(): number {
        return sessionStorage.length;
    }
}
