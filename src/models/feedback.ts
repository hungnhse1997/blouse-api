import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { MedicalExamination } from './medical-examination';

@Entity('feedback')
export class Feedback extends BaseEntity {
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
        type: 'tinyint',
        width: 1,
        name: 'rating'
    })
    rating: number;

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