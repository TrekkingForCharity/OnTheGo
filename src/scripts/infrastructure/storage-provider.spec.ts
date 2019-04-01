import { expect } from 'chai';
import { SessionStorageProvider } from '.';

class MockStorageProvider {
    private storage: any = {};
    public setItem(key: string, value: string) {
        this.storage[key] = value;
    }
    public getItem(key: string): string {
        const item = this.storage[key];
        return item === undefined ? null : item;
    }
    public clear() {
        this.storage = {};
    }
    public get length() {
        return Object.keys(this.storage).length;
    }
    public key(index: number): string {
        const item = Object.keys(this.storage)[index];
        return item === undefined ? null : item;
    }
    public removeItem(key: string) {
        delete this.storage[key];
    }
}

describe('Storage Provider', () => {
    beforeEach(() => {
        const sessionStorageProvider = new MockStorageProvider();
        Object.defineProperty(window, 'sessionStorage', {
            configurable: true,
            enumerable: true,
            value: sessionStorageProvider,
            writable: true,
        });
        Object.defineProperty(global, 'sessionStorage', {
            configurable: true,
            enumerable: true,
            value: sessionStorageProvider,
            writable: true,
        });
    });
    describe('setItem', () => {
        it('expect item to be stored in sessionStorage', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorageProvider.setItem('test-item', 'test-value');
            expect('test-value').to.be.equal(sessionStorage.getItem('test-item'));
        });
    });
    describe('clear', () => {
        it('expect sessionStorage to be empty', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorage.setItem('foo', 'bar');
            sessionStorageProvider.clear();
            expect(0).to.be.equal(sessionStorage.length);
        });
    });
    describe('getItem', () => {
        it('expert item when item is stored', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorage.setItem('foo', 'bar');
            expect('bar').to.be.equal(sessionStorageProvider.getItem('foo'));
        });
        it('expert null when item is not stored', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            expect(null).to.be.equal(sessionStorageProvider.getItem('foo'));
        });
    });
    describe('key', () => {
        it('expect index when item is in the store', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorage.setItem('foo', 'bar');
            sessionStorage.setItem('bar', 'foo');
            expect('bar').to.be.equal(sessionStorageProvider.key(1));
        });
        it('expect null when item is not in the store', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            expect(null).to.be.equal(sessionStorageProvider.key(1));
        });
    });
    describe('removeItem', () => {
        it('expect item to be remove from store when item is in store', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorage.setItem('foo', 'bar');
            sessionStorageProvider.removeItem('foo');
            expect(0).to.be.equal(sessionStorage.length);
        });
    });
    describe('length', () => {
        it('expect count of items in storage', () => {
            const sessionStorageProvider = new SessionStorageProvider();
            sessionStorage.setItem('foo', 'bar');
            expect(1).to.be.equal(sessionStorageProvider.length);
        });
    });
});
