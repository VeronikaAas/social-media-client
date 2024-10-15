import { login } from './login';
import { logout } from './logout';
import * as storage from '../../storage/index.js';

// Mock storage module
jest.mock('../../storage/index.js');

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
        removeItem(key) {
            delete store[key];
        },
    };
})();

describe('Auth Functions', () => {
    beforeAll(() => {
        // Replace global localStorage with our mock
        global.localStorage = localStorageMock;
    });

    beforeEach(() => {
        localStorage.clear(); // Clear mock storage before each test
        jest.clearAllMocks(); 
    });

    test('login stores a token with valid credentials', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ accessToken: 'mockToken' }),
            })
        );

        const credentials = { email: 'user@example.com', password: 'pass' };
        await login(credentials.email, credentials.password); 
        expect(storage.save).toHaveBeenCalledWith('token', 'mockToken');
    });

    test('logout clears the token from browser storage', async () => {
        // Checking for a successful login
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ accessToken: 'mockToken' }),
            })
        );

        const credentials = { email: 'user@example.com', password: 'pass' };
        await login(credentials.email, credentials.password); // First login
        logout();
        expect(localStorage.getItem('token')).toBeNull(); // Check if token is removed
    });

    test('login throws error on failed fetch', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Unauthorized',
            })
        );

        await expect(login('user@example.com', 'wrongPass')).rejects.toThrow('Unauthorized');
    });
});