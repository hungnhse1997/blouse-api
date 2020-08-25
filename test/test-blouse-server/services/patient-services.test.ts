import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test patient-service', () => {
    let request = null;
    let access_token_admin = null;
    let access_token_staff = null;

    beforeEach(async () => {
        await DatabaseManager.init();
        await DatabaseManager.clearData();
        await DatabaseManager.insertData();
        request = supertest(server);
        access_token_admin = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        access_token_staff = jwt.sign({ id: 2, role: 'STAFF' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
    });

    afterAll(async (done) => {
        await DatabaseManager.close();
        done();
    });

    it('Register patient with authen', () => {
        return request
            .post('/patient/register')
            .send({ email: 'hungnhse1997@gmail.com', password: 'Hung1997' })
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    //Role Admin
    it('Get all patient with authen, Role Admin', () => {
        return request
            .get('/patient/')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search patient with authen, Role Admin', () => {
        return request
            .get('/patient/search')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search patient with authen and txtSearch, Role Admin', () => {
        return request
            .get('/patient/search?txtSearch=patient')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one patient by ID with authen,  Role Admin', () => {
        return request
            .get('/patient/1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one patient with authen, Role Admin', () => {
        return request
            .put('/patient/setActive/1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE STAFF
    it('Get all patient with authen, Role Staff', () => {
        return request
            .get('/patient/')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search patient with authen, , Role Staff', () => {
        return request
            .get('/patient/search')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search patient with authen and txtSearch,Role Staff', () => {
        return request
            .get('/patient/search?txtSearch=patient')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one patient by ID with authen, Role Staff', () => {
        return request
            .get('/patient/1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one patient with authen, Role Staff', () => {
        return request
            .put('/patient/setActive/1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});