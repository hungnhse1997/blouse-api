import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Length } from 'class-validator';
import { SpecifiedSymptom } from './specified-symptom';
import { ReportSymptom } from './report-symptom';

@Entity('symptom')
export class Symptom extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'name'
    })
    @Length(1, 255)
    name: string;

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

    @OneToMany(type => SpecifiedSymptom, specifiedSymptom => specifiedSymptom.department)
    specifiedSymptoms: SpecifiedSymptom[];

    @OneToMany(type => ReportSymptom, reportSymptom => reportSymptom.symptom)
    reportSymptoms: ReportSymptom[];
}
