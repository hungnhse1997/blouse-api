import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsEmail, IsPhoneNumber, Length, MaxLength } from 'class-validator';
import { Hospital } from './hospital';
import { Doctor } from './doctor';
import { SpecifiedSymptom } from './specified-symptom';
import { MedicalExamination } from './medical-examination';

@Entity('department')
export class Department extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '255',
        default :null,
        name: 'name'
    })
    @Length(1, 255)
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        default :null,
        name: 'address'
    })
    @MaxLength(255)
    address: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
        default :null,
        name: 'phone'
    })
    @MaxLength(20)
    @IsPhoneNumber('VN', {
        message: 'Số điện thoại không hợp lệ!'
    })
    phoneNumber: string;

    @Column({
        type: 'varchar',
        length: 255,
        default :null,
        name: 'website'
    })
    @MaxLength(255)
    website: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        default :null,
        name: 'email'
    })
    @MaxLength(255)
    @IsEmail()
    email: string;

    @Column({
        type: 'text',
        default :null,
        name: 'description'
    })
    description: string;

    @ManyToOne(type => Hospital, hospital => hospital.departments)
    @JoinColumn({ name: 'hospital_id' })
    hospital: Hospital;
    @Column({ name: 'hospital_id' })
    hospitalId: number;

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

    @OneToMany(type => Doctor, doctor => doctor.department)
    doctors: Doctor[];

    @OneToMany(type => SpecifiedSymptom, specifiedSymptom => specifiedSymptom.department)
    specifiedSymptoms: SpecifiedSymptom[];

    // @OneToMany(type => MedicalExamination, medicalExamination => medicalExamination.department)
    // medicalExaminations: MedicalExamination[];
}