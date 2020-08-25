import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { MedicalExamination } from './medical-examination';
import { Patient } from './patient';

@Entity('payment_history')
export class PaymentHistory extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => Patient, patient => patient.payments)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
    @Column({ name: 'patient_id' })
    patientId: string

    @OneToOne(type => MedicalExamination)
    @JoinColumn({ name: 'medical_examination_id' })
    medicalExamination: MedicalExamination;
    @Column({ name: 'medical_examination_id' })
    medicalExaminationId: number;

    @Column({
        type: 'double',
        name: 'amount',
        default: null
    })
    amount: string;

    @Column({
        type: 'int',
        width: 1,
        default: 0,
        name: 'status'
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

    @Column({
        type: 'datetime',
        name: 'purchased_at',
    })
    purchasedAt: Date;
}