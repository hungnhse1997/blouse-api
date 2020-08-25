import { createConnection, Connection } from "typeorm";
import config from '../config';
import { Feedback } from './feedback';
import { ReportSymptom } from './report-symptom';
import { MedicalReport } from './medical-report';
import { SpecifiedSymptom } from './specified-symptom';
import { Symptom } from './symptom';
import { Department } from './department';
import { Staff } from './staff';
import { Hospital } from './hospital';
import { Doctor } from './doctor';
import { User } from './user';
import { Appointment } from './appointment';
import { MedicalRecord } from './medical-record';
import { PaymentHistory } from './payment-history';
import { Patient } from './patient';
import { MedicalExamination } from './medical-examination';
import { Admin } from './admin';
import { FavoritedDoctor } from './favorited-doctor';
import { Medicine } from './medicine';
import { MedicineMedicalRecord } from './medicine-medical-record';

export class DatabaseManager {
    static connection: Connection;
    
    static async init() {
        if (DatabaseManager.connection) return;
        DatabaseManager.connection = await createConnection({
            name: 'default',
            type: 'mysql',
            host: config.MYSQL_HOST,
            port: config.MYSQL_PORT,
            username: config.MYSQL_USER,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DATABASE,
            ssl: {
                ca: config.AZURE_MYSQL_SSL
            },
            entities: [
                Admin,
                Patient,
                User,
                Doctor,
                Hospital,
                Staff,
                Department,
                Symptom,
                MedicalReport,
                ReportSymptom,
                MedicalExamination,
                Feedback,
                Appointment,
                MedicalRecord,
                PaymentHistory,
                SpecifiedSymptom,
                FavoritedDoctor,
                Medicine,
                MedicineMedicalRecord
            ],
            // synchronize: true
        })
    }
    
    static async close() {
        if (!DatabaseManager.connection) return;
        await DatabaseManager.connection.close();
        DatabaseManager.connection = null;
    }
}