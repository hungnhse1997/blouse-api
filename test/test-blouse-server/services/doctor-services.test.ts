import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test doctor-service', () => {
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

    it('Get all doctor with authen, Role Admin', () => {
        return request
            .get('/doctor/')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor with authen, Role Admin', () => {
        return request
            .get('/doctor/search')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor with authen and txtSearch, Role Admin', () => {
        return request
            .get('/doctor/search?txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by departmentId with authen, Role Admin', () => {
        return request
            .get('/doctor/search?departmentId=1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by departmentId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/doctor/search?departmentId=1&txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by hospitalId with authen, Role Admin', () => {
        return request
            .get('/doctor/search?hospitalId=1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by hospitalId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/doctor/search?hospitalId=1&txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one doctor by ID with authen,  Role Admin', () => {
        return request
            .get('/doctor/1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create doctor with authen, Role Admin', () => {
        return request
            .post('/doctor/')
            .send({email: 'hungnhse1997@gmail.com', username: 'hungnhse1997', departmentId: 1 })
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update doctor with authen, Role Admin', () => {
        return request
            .put('/doctor/')
            .send({id: '1', fullName: 'Nguyen Huy Hung'})
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one doctor with authen, Role Admin', () => {
        return request
            .put('/doctor/setActive/1')
            .set('Cookie', 'access_token='+ access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE STAFF
    it('Get all doctor with authen, Role Staff', () => {
        return request
            .get('/doctor/')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor with authen, , Role Staff', () => {
        return request
            .get('/doctor/search')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor with authen and txtSearch,Role Staff', () => {
        return request
            .get('/doctor/search?txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by departmentId with authen, Role Staff', () => {
        return request
            .get('/doctor/search?departmentId=1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by departmentId and txtSearch with authen,Role Staff', () => {
        return request
            .get('/doctor/search?departmentId=1&txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by hospitalId with authen, Role Staff', () => {
        return request
            .get('/doctor/search?hospitalId=1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search doctor by hospitalId and txtSearch with authen, Role Staff', () => {
        return request
            .get('/doctor/search?hospitalId=1&txtSearch=doctor')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get one doctor by ID with authen, Role Staff', () => {
        return request
            .get('/doctor/1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create doctor with authen,Role Staff', () => {
        return request
            .post('/doctor/')
            .send({email: 'hungnhse1997@gmail.com', username: 'hungnhse1997', departmentId: 1 })
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update doctor with authen, Role Staff', () => {
        return request
            .put('/doctor/')
            .send({id: '1', fullName: 'Nguyen Huy Hung'})
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active one doctor with authen, Role Staff', () => {
        return request
            .put('/doctor/setActive/1')
            .set('Cookie', 'access_token='+ access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});