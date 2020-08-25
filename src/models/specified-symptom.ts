import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Symptom } from './symptom';
import { Department } from './department';

@Entity('specified_symptom')
export class SpecifiedSymptom extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => Department, department => department.specifiedSymptoms)
    @JoinColumn({ name: 'department_id' })
    department: Department;
    @Column({ name: 'department_id' })
    departmentId: number;

    @ManyToOne(type => Symptom, symptom => symptom.specifiedSymptoms)
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