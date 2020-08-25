import server from '../../../src/server-test';
import { DatabaseManager } from '../../database-test-manager';
import * as jwt from "jsonwebtoken";

const supertest = require('supertest');

describe('Test appointment-service', () => {
    let request = null;
    let access_token_admin = null;
    let access_token_staff = null;
    let access_token_doctor = null;
    let access_token_patient = null;

    beforeEach(async () => {
        await DatabaseManager.init();
        await DatabaseManager.clearData();
        await DatabaseManager.insertData();
        request = supertest(server);
        access_token_admin = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        access_token_staff = jwt.sign({ id: 2, role: 'STAFF' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        access_token_doctor = jwt.sign({ id: 3, role: 'DOCTOR' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
        access_token_patient = jwt.sign({ id: 4, role: 'PATIENTf' }, process.env.JWT_SECRET || '@Hung123', { expiresIn: "1h" });
    });

    afterAll(async (done) => {
        await DatabaseManager.close();
        done();
    });

    it('Get all appointment with authen, Role Admin', () => {
        return request
            .get('/appointment/')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen, Role Admin', () => {
        return request
            .get('/appointment/search')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen and txtSearch, Role Admin', () => {
        return request
            .get('/appointment/search?txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by departmentId with authen, Role Admin', () => {
        return request
            .get('/appointment/search?departmentId=1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by departmentId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/appointment/search?departmentId=1&txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by hospitalId with authen, Role Admin', () => {
        return request
            .get('/appointment/search?hospitalId=1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by hospitalId and txtSearch with authen, Role Admin', () => {
        return request
            .get('/appointment/search?hospitalId=1&txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get appointment by ID with authen, Role Admin', () => {
        return request
            .get('/appointment/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create appointment with authen, Role Admin', () => {
        return request
            .post('/appointment/')
            .send({ medicalExaminationId: 1, patientId: '1', doctorId: '1', appointmentTime: '2020-08-25', place: 'Hanoi' })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update appointment with authen, Role Admin', () => {
        return request
            .put('/appointment/')
            .send({ id: 1, medicalExaminationId: 1, patientId: '1', doctorId: '1', appointmentTime: '2020-08-26', place: 'HCM' })
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active appointment with authen, Role Admin', () => {
        return request
            .put('/appointment/setActive/1')
            .set('Cookie', 'access_token=' + access_token_admin)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE STAFF
    it('Get all appointment with authen, Role Staff', () => {
        return request
            .get('/appointment/')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen, Role Staff', () => {
        return request
            .get('/appointment/search')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen and txtSearch, Role Staff', () => {
        return request
            .get('/appointment/search?txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by departmentId with authen, Role Staff', () => {
        return request
            .get('/appointment/search?departmentId=1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment by departmentId and txtSearch with authen, Role Staff', () => {
        return request
            .get('/appointment/search?departmentId=1&txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Get appointment by ID with authen, Role Staff', () => {
        return request
            .get('/appointment/1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Create appointment with authen, Role Staff', () => {
        return request
            .post('/appointment/')
            .send({ medicalExaminationId: 1, patientId: '1', doctorId: '1', appointmentTime: '2020-08-25', place: 'Hanoi' })
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Update appointment with authen, Role Staff', () => {
        return request
            .put('/appointment/')
            .send({ id: 1, medicalExaminationId: 1, patientId: '1', doctorId: '1', appointmentTime: '2020-08-26', place: 'HCM' })
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Set active appointment with authen, Role Staff', () => {
        return request
            .put('/appointment/setActive/1')
            .set('Cookie', 'access_token=' + access_token_staff)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE DOCTOR
    it('Get all appointment with authen, Role Doctor', () => {
        return request
            .get('/appointment/')
            .set('Cookie', 'access_token=' + access_token_doctor)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen, Role Doctor', () => {
        return request
            .get('/appointment/search')
            .set('Cookie', 'access_token=' + access_token_doctor)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen and txtSearch, Role Doctor', () => {
        return request
            .get('/appointment/search?txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_doctor)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });


    //ROLE PATIENT
    it('Get all appointment with authen, Role Patient', () => {
        return request
            .get('/appointment/')
            .set('Cookie', 'access_token=' + access_token_patient)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen, Role Patient', () => {
        return request
            .get('/appointment/search')
            .set('Cookie', 'access_token=' + access_token_patient)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

    it('Search appointment with authen and txtSearch, Role Patient', () => {
        return request
            .get('/appointment/search?txtSearch=doctor')
            .set('Cookie', 'access_token=' + access_token_patient)
            .set('Accept', 'application/json')
            .then(response => {
                expect(response.status).toBe(200);
            });
    });

});