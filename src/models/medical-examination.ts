import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Patient } from './patient';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import { MedicalReport } from './medical-report';
import { Hospital } from './hospital';
import { Department } from './department';

@Entity('medical_examination')
export class MedicalExamination extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => Patient, patient => patient.medicalExaminations)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
    @Column({ name: 'patient_id' })
    patientId: string

    // @ManyToOne(type => Department, department => department.medicalExaminations)
    // @JoinColumn({ name: 'department_id' })
    // department: Department;
    // @Column({ name: 'department_id' })
    // departmentId: string;

    @ManyToOne(type => Doctor, doctor => doctor.medicalExaminations)
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;
    @Column({ name: 'doctor_id' })
    doctorId: string;

    // @OneToOne(type => MedicalReport)
    // @JoinColumn({ name: 'medical_report_id' })
    // medicalReport: MedicalReport;
    // @Column({ name: 'medical_report_id', default: null })
    // medicalReportId: number;

    @Column({
        type: 'tinyint',
        width: 1,
        name: 'status',
        default: 0
    })
    status: number;

    @Column({
        type: 'tinyint',
        width: 1,
        name: 'is_ative',
        default: 1
    })
    isActive: number;

    @Column({
        type: 'datetime',
        name: 'created_at',
    })
    createdAt: Date;

    @Column({
        type: 'datetime',
        name: 'modified_at',
    })
    modifiedAt: Date;

    @OneToOne(type => Appointment, appointment => appointment.medicalExamination)
    appointment: Appointment;
}