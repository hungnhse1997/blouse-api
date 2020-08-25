import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';

const supertest = require('supertest');

describe('Test auth-service', () => {
    let request = null;

    beforeEach(async () => {
        await DatabaseManager.init();
        await DatabaseManager.clearData();
        await DatabaseManager.insertData();
        request = supertest(server);
    });

    afterAll(async (done) => {
        await DatabaseManager.close();
        done();
    });

    it('Login false, URL: /auth/login/, method: POST', () => {
        return request
            .post('/auth/login')
            .send({ username: '1', password: '1' })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

    it('Login true, URL: /auth/login/, method: POST', () => {
        return request
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin' })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});