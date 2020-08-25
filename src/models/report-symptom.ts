import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MedicalReport } from './medical-report';
import { Symptom } from './symptom';

@Entity('report_symptom')
export class ReportSymptom extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => MedicalReport, medicalReport => medicalReport.reportSymptoms)
    @JoinColumn({ name: 'medical_report_id' })
    medicalReport: MedicalReport;
    @Column({ name: 'medical_report_id' })
    medicalReportId: number;

    @ManyToOne(type => Symptom, symptom => symptom.reportSymptoms)
    @JoinColumn({ name: 'symptom_id' })
    symptom: Symptom;
    @Column({ name: 'symptom_id' })
    symptomId: number;

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
}