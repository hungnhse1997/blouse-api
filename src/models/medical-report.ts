import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Patient } from './patient';
import { ReportSymptom } from './report-symptom';

@Entity('medical_report')
export class MedicalReport extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => Patient, patient => patient.medicalReports)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
    @Column({ name: 'patient_id' })
    patientId: string

    @Column({
        type: 'text',
        default: null,
        name: 'description'
    })
    description: string;

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

    @OneToMany(type => ReportSymptom, reportSymptom => reportSymptom.medicalReport)
    reportSymptoms: ReportSymptom[];
}