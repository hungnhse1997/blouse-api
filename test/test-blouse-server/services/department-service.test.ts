import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test department-service', () => {
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

    it('Get all department with authen, Role Admin', () => {
        return request
            .get('/department/')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department with authen, Role Admin', () => {
        return request
            .get('/department/search')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department with authen and txtSearch, Role Admin', () => {
        return request
            .get('/department/search?txtSearch=Tim')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    it('Search department by hospitalId with authen, Role Admin', () => {
        return request
            .get('/department/search?hospitalId=1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department by hospitalId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/department/search?hospitalId=1&txtSearch=Tim')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one department by ID with authen,  Role Admin', () => {
        return request
            .get('/department/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get all department by hospital ID with authen,  Role Admin', () => {
        return request
            .get('/department/department-by-hospital/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create department with authen, Role Admin', () => {
        return request
            .post('/department/')
            .send({ name: 'Tim Mach', address: 'hanoi', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update department with authen, Role Admin', () => {
        return request
            .put('/department/')
            .send({ id: 1, name: 'Tim Mach 2', address: 'hanoi 2', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one department with authen, Role Admin', () => {
        return request
            .put('/department/setActive/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE STAFF
    it('Get all department with authen, Role Admin', () => {
        return request
            .get('/department/')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department with authen, Role Admin', () => {
        return request
            .get('/department/search')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department with authen and txtSearch, Role Admin', () => {
        return request
            .get('/department/search?txtSearch=Tim')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    it('Search department by hospitalId with authen, Role Admin', () => {
        return request
            .get('/department/search?hospitalId=1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search department by hospitalId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/department/search?hospitalId=1&txtSearch=Tim')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one department by ID with authen,  Role Admin', () => {
        return request
            .get('/department/1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get all department by hospital ID with authen,  Role Admin', () => {
        return request
            .get('/department/department-by-hospital/1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create department with authen, Role Admin', () => {
        return request
            .post('/department/')
            .send({ name: 'Tim Mach', address: 'hanoi', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update department with authen, Role Admin', () => {
        return request
            .put('/department/')
            .send({ id: 1, name: 'Tim Mach 2', address: 'hanoi 2', hospitalId: 1 })
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one department with authen, Role Admin', () => {
        return request
            .put('/department/setActive/1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});