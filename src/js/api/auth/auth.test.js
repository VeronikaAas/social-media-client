import { login } from './login';
import { logout } from './logout';
import * as storage from '../../storage/index.js';

jest.mock('../../storage/index.js');

describe('Auth Functions', () => {
    beforeEach(() => {
        localStorage.clear();
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
        // checking for a successful login
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ accessToken: 'mockToken' }),
            })
        );

        const credentials = { email: 'user@example.com', password: 'pass' };
        await login(credentials.email, credentials.password); // first login
        logout();
        expect(localStorage.getItem('token')).toBeNull(); // check if token is removed
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