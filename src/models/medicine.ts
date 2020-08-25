import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Length, MaxLength } from 'class-validator';
import { MedicineMedicalRecord } from './medicine-medical-record'

@Entity('medicine')
export class Medicine extends BaseEntity {
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
        name: 'active_material'
    })
    activeMaterial: string;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'classification'
    })
    @Length(1, 255)
    classification: string;

    @Column({
        type: 'text',
        default: null,
        name: 'concentration'
    })
    concentration: string;

    @Column({
        type: 'text',
        default: null,
        name: 'excipient'
    })
    excipient: string;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'preparation'
    })
    @Length(1, 255)
    preparation: string;

    @Column({
        type: 'text',
        default: null,
        name: 'packaging'
    })
    packaging: string;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'lifespan'
    })
    @Length(1, 255)
    lifespan: string;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'made_by'
    })
    @Length(1, 255)
    madeBy: string;

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

    @OneToMany(type => MedicineMedicalRecord, medicineMedicalRecord => medicineMedicalRecord.medicine)
    medicineMedicalRecords: MedicineMedicalRecord[];
}