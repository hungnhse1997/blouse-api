import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { MedicineMedicalRecord } from './medicine-medical-record'
import { MedicalExamination } from './medical-examination';

@Entity('medical_record')
export class MedicalRecord extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @OneToOne(type => MedicalExamination)
    @JoinColumn({ name: 'medical_examination_id' })
    medicalExamination: MedicalExamination;
    @Column({ name: 'medical_examination_id' })
    medicalExaminationId: number;

    @Column({
        type: 'text',
        name: 'description'
    })
    description: string;

    @Column({
        type: 'text',
        name: 'pathology'
    })
    pathology: string;

    @Column({
        type: 'text',
        name: 'treatment'
    })
    treatment: string;

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

    @OneToMany(type => MedicineMedicalRecord, medicineMedicalRecord => medicineMedicalRecord.medicalRecord)
    medicineMedicalRecords: MedicineMedicalRecord[];

}