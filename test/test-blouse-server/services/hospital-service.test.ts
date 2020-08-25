import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test hospital-service', () => {
    let request = null;
    let access_token = null;

    beforeEach(async () => {
        await DatabaseManager.init();
        await DatabaseManager.clearData();
        await DatabaseManager.insertData();
        request = supertest(server);
        access_token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
    });

    afterAll(async (done) => {
        await DatabaseManager.close();
        done();
    });


    it('Get all hospital with authen, URL: /hospital/, method: GET', () => {
        return request
            .get('/hospital/')
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get all hospital without authen, URL: /hospital/, method: GET', () => {
        return request
            .get('/hospital/')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search hospital without authen, URL: /hospital/search, method: GET', () => {
        return request
            .get('/hospital/search')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

    it('Search hospital with authen, URL: /hospital/search, method: GET', () => {
        return request
            .get('/hospital/search')
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get hospital by id with authen, URL: /hospital/:id, method: GET', () => {
        return request
            .get('/hospital/1')
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.body.id).toBe(1);
                expect(response.status).toBe(200);
            });
    });

    it('Get hospital by id without authen, URL: /hospital/:id, method: GET', () => {
        return request
            .get('/hospital/1')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

    it('Create hospital with authen, URL: /hospital/, method: POST', () => {
        return request
            .post('/hospital/')
            .send({ name: 'Đại Học Y Hà Nội' })
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create hospital without authen, URL: /hospital/, method: POST', () => {
        return request
            .post('/hospital/')
            .send({ name: 'Đại Học Y Hà Nội' })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

    it('Update hospital with authen, URL: /hospital/, method: PUT', () => {
        return request
            .put('/hospital/')
            .send({id: 1, name: 'Bạch Mai 2' })
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update hospital without authen, URL: /hospital/, method: PUT', () => {
        return request
            .put('/hospital/')
            .send({id: 1, name: 'Bạch Mai 2' })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

    it('Set Active hospital with authen, URL: /hospital/, method: PUT', () => {
        return request
            .put('/hospital/setActive/1')
            .set('Cookie', 'access_token='+ access_token)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set Active hospital without authen, URL: /hospital/, method: PUT', () => {
        return request
            .put('/hospital/setActive/1')
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(400);
            });
    });

});