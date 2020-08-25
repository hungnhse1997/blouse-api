import { createConnection, Connection } from "typeorm";
import config from '../src/config';
import { Feedback } from '../src/models/feedback';
import { ReportSymptom } from '../src/models/report-symptom';
import { MedicalReport } from '../src/models/medical-report';
import { SpecifiedSymptom } from '../src/models/specified-symptom';
import { Symptom } from '../src/models/symptom';
import { Department } from '../src/models/department';
import { Staff } from '../src/models/staff';
import { Hospital } from '../src/models/hospital';
import { Doctor } from '../src/models/doctor';
import { User } from '../src/models/user';
import { Appointment } from '../src/models/appointment';
import { MedicalRecord } from '../src/models/medical-record';
import { PaymentHistory } from '../src/models/payment-history';
import { Patient } from '../src/models/patient';
import { MedicalExamination } from '../src/models/medical-examination';
import { Admin } from '../src/models/admin';
import { FavoritedDoctor } from '../src/models/favorited-doctor';
import { Medicine } from '../src/models/medicine';
import { MedicineMedicalRecord } from '../src/models/medicine-medical-record';
import { Constant } from "../src/utils/constant";

export class DatabaseManager {
    static connection: Connection;
    
    static async init() {
        if (DatabaseManager.connection) return;
        DatabaseManager.connection = await createConnection({
            name: 'default',
            type: 'mysql',
            host: "localhost",
            port: 3306,
            username: "root",
            password: "Hung1997",
            database: "blouse_official",
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
            //synchronize: true
        })
    }
    static async clearData() {
        if (!DatabaseManager.connection) return;
        const connection = DatabaseManager.connection;
        const deleteQuery = connection.createQueryBuilder().delete();

        await deleteQuery.from(MedicineMedicalRecord).execute();
        await deleteQuery.from(Medicine).execute();
        await deleteQuery.from(MedicalRecord).execute();
        await deleteQuery.from(Feedback).execute();
        await deleteQuery.from(Appointment).execute();
        await deleteQuery.from(PaymentHistory).execute();
        await deleteQuery.from(MedicalExamination).execute();

        await deleteQuery.from(ReportSymptom).execute();
        await deleteQuery.from(SpecifiedSymptom).execute();
        await deleteQuery.from(Symptom).execute();
        await deleteQuery.from(MedicalReport).execute();

        await deleteQuery.from(FavoritedDoctor).execute();

        await deleteQuery.from(Patient).execute();
        await deleteQuery.from(Doctor).execute();
        await deleteQuery.from(Staff).execute();
        await deleteQuery.from(Admin).execute();
        await deleteQuery.from(User).execute();

        await deleteQuery.from(Department).execute();
        await deleteQuery.from(Hospital).execute();
    }
    static async insertData() {
        if (!DatabaseManager.connection) {
            return;
        }

        let hospital = new Hospital();
        hospital.id = 1;
        hospital.name = 'Bạch Mai';
        hospital.createdAt = (new Date());
        hospital.modifiedAt = (new Date());
        await Hospital.save(hospital);

        let department = new Department();
        department.id = 1;
        department.name = 'Tim mạch';
        department.hospitalId = hospital.id;
        department.createdAt = (new Date());
        department.modifiedAt = (new Date());
        await Department.save(department);

        let userAdmin = new User();
        userAdmin.id = '1';
        userAdmin.email = 'admin@gmail.com';
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.role = Constant.ADMIN;
        userAdmin.isVerified = Constant.ONE;
        userAdmin.createdAt = (new Date());
        userAdmin.modifiedAt = (new Date());
        await User.save(userAdmin);

        let userSatff = new User();
        userSatff.id = '2';
        userSatff.email = 'staff@gmail.com';
        userSatff.username = 'staff';
        userSatff.password = 'staff';
        userSatff.role = Constant.STAFF;
        userSatff.isVerified = Constant.ONE;
        userSatff.createdAt = (new Date());
        userSatff.modifiedAt = (new Date());
        await User.save(userSatff);

        let userDoctor = new User();
        userDoctor.id = '3';
        userDoctor.email = 'doctor@gmail.com';
        userDoctor.username = 'doctor';
        userDoctor.password = 'doctor';
        userDoctor.role = Constant.DOCTOR;
        userDoctor.isVerified = Constant.ONE;
        userDoctor.createdAt = (new Date());
        userDoctor.modifiedAt = (new Date());
        await User.save(userDoctor);

        let userPatient = new User();
        userPatient.id = '4';
        userPatient.email = 'patient@gmail.com';
        userPatient.username = 'patient';
        userPatient.password = 'patient';
        userPatient.role = Constant.PATIENT;
        userPatient.isVerified = Constant.ONE;
        userPatient.createdAt = (new Date());
        userPatient.modifiedAt = (new Date());
        await User.save(userPatient);

        let admin = new Admin();
        admin.id = '1';
        admin.userId = userAdmin.id;
        admin.createdAt = (new Date());
        admin.modifiedAt = (new Date());
        await Admin.save(admin);

        let staff = new Staff();
        staff.id = '1';
        staff.userId = userSatff.id;
        staff.hospitalId = hospital.id;
        staff.createdAt = (new Date());
        staff.modifiedAt = (new Date());
        await Staff.save(staff);

        let doctor = new Doctor();
        doctor.id = '1';
        doctor.userId = userDoctor.id;
        doctor.departmentId = department.id;
        doctor.createdAt = (new Date());
        doctor.modifiedAt = (new Date());
        await Doctor.save(doctor);

        let patient = new Patient();
        patient.id = '1';
        patient.userId = userPatient.id;
        patient.createdAt = (new Date());
        patient.modifiedAt = (new Date());
        await Patient.save(patient);

        let favoritedDoctor = new FavoritedDoctor();
        favoritedDoctor.id = 1;
        favoritedDoctor.patientId = patient.id;
        favoritedDoctor.doctorId = doctor.id;
        favoritedDoctor.createdAt = (new Date());
        favoritedDoctor.modifiedAt = (new Date());
        await FavoritedDoctor.save(favoritedDoctor);

        let medicalReport = new MedicalReport();
        medicalReport.id = 1;
        medicalReport.patientId = patient.id;
        medicalReport.description = 'Đau tim';
        medicalReport.createdAt = (new Date());
        medicalReport.modifiedAt = (new Date());
        await MedicalReport.save(medicalReport);

        let symptom = new Symptom();
        symptom.id = 1;
        symptom.name = 'Đau tim';
        symptom.description = 'Đau vùng ngực trái'
        symptom.createdAt = (new Date());
        symptom.modifiedAt = (new Date());
        await Symptom.save(symptom);

        let specifiedSymptom = new SpecifiedSymptom();
        specifiedSymptom.id = 1;
        specifiedSymptom.departmentId = department.id;
        specifiedSymptom.symptomId = symptom.id;
        specifiedSymptom.createdAt = (new Date());
        specifiedSymptom.modifiedAt = (new Date());
        await SpecifiedSymptom.save(specifiedSymptom);

        let reportSymptom = new ReportSymptom();
        reportSymptom.id = 1;
        reportSymptom.medicalReportId = medicalReport.id;
        reportSymptom.symptomId = symptom.id;
        reportSymptom.createdAt = (new Date());
        reportSymptom.modifiedAt = (new Date());
        await ReportSymptom.save(reportSymptom);

        let medicalExamination = new MedicalExamination();
        medicalExamination.id = 1;
        medicalExamination.patientId = patient.id;
        medicalExamination.doctorId = doctor.id;
        medicalExamination.createdAt = (new Date());
        medicalExamination.modifiedAt = (new Date());
        await MedicalExamination.save(medicalExamination);

        let paymentHistory = new PaymentHistory();
        paymentHistory.id = 1;
        paymentHistory.patientId = patient.id;
        paymentHistory.medicalExaminationId = medicalExamination.id;
        paymentHistory.createdAt = (new Date());
        paymentHistory.modifiedAt = (new Date());
        await PaymentHistory.save(paymentHistory);

        let appointment = new Appointment();
        appointment.id = 1;
        appointment.medicalExaminationId = medicalExamination.id;
        appointment.patientId = patient.id;
        appointment.doctorId = doctor.id;
        appointment.appointmentTime = (new Date());
        appointment.place = 'Phòng 404, Tầng 4, Tòa nhà H, Bệnh viện Bạch Mai, Hà Nội';
        appointment.createdAt = (new Date());
        appointment.modifiedAt = (new Date());
        await Appointment.save(appointment);

        let feedback = new Feedback();
        feedback.id = 1;
        feedback.medicalExaminationId = medicalExamination.id;
        feedback.rating = 5;
        feedback.createdAt = (new Date());
        feedback.modifiedAt = (new Date());
        await Feedback.save(feedback);

        let medicalRecord = new MedicalRecord();
        medicalRecord.id = 1;
        medicalRecord.medicalExaminationId = medicalExamination.id;
        medicalRecord.description = 'Bệnh tim bẩm sinh';
        medicalRecord.pathology = 'Tim bẩm sinh';
        medicalRecord.treatment = 'Mổ thay tim';
        medicalRecord.createdAt = (new Date());
        medicalRecord.modifiedAt = (new Date());
        await MedicalRecord.save(medicalRecord);

        let medicine = new Medicine();
        medicine.id = 1;
        medicine.name = 'Glyceryl Trinitrat';
        medicine.createdAt = (new Date());
        medicine.modifiedAt = (new Date());
        await Medicine.save(medicine);

        let medicineMedicalRecord = new MedicineMedicalRecord();
        medicineMedicalRecord.id = 1;
        medicineMedicalRecord.medicalRecordId = medicalRecord.id;
        medicineMedicalRecord.medicineId = medicine.id;
        medicineMedicalRecord.quantity = 50;
        medicineMedicalRecord.unit = 'Viên';
        medicineMedicalRecord.note = 'Ngày uống 2 viên,sáng tối, sau ăn';
        await MedicineMedicalRecord.save(medicineMedicalRecord);
    }
    
    static async close() {
        if (!DatabaseManager.connection) return;
        await DatabaseManager.connection.close();
        DatabaseManager.connection = null;
    }
}