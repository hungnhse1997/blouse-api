import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test staff-service', () => {
    let request = null;
    let access_token_admin = null;

    beforeEach(async () => {
        await DatabaseManager.init();
        await DatabaseManager.clearData();
        await DatabaseManager.insertData();
        request = supertest(server);
        access_token_admin = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
    });

    afterAll(async (done) => {
        await DatabaseManager.close();
        done();
    });

    it('Get all staff with authen, Role Admin', () => {
        return request
            .get('/staff/')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search staff with authen, Role Admin', () => {
        return request
            .get('/staff/search')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search staff with authen and txtSearch, Role Admin', () => {
        return request
            .get('/staff/search?txtSearch=staff')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    it('Search staff by hospitalId with authen, Role Admin', () => {
        return request
            .get('/staff/search?hospitalId=1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search staff by hospitalId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/staff/search?hospitalId=1&txtSearch=staff')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one staff by ID with authen,  Role Admin', () => {
        return request
            .get('/staff/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create staff with authen, Role Admin', () => {
        return request
            .post('/staff/')
            .send({ email: 'hungnhse1997@gmail.com', username: 'hungnhse1997', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update staff with authen, Role Admin', () => {
        return request
            .put('/staff/')
            .send({ id: '1', fullName: 'Nguyen Huy Hung', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one staff with authen, Role Admin', () => {
        return request
            .put('/staff/setActive/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});