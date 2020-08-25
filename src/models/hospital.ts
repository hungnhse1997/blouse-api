import { MedicalExamination } from './medical-examination';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsPhoneNumber, Length, MaxLength } from 'class-validator';
import { Staff } from './staff';
import { Department } from './department';

@Entity('hospital')
export class Hospital extends BaseEntity {
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
        type: 'varchar',
        length: 255,
        default: null,
        name: 'address'
    })
    @MaxLength(255)
    address: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
        default: null,
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
        default: null,
        name: 'website'
    })
    @MaxLength(255)
    website: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        default: null,
        name: 'email'
    })
    @MaxLength(255)
    @IsEmail()
    email: string;

    @Column({
        type: 'date',
        name: 'established_date',
        default: null
    })
    establishedDate: Date;

    @Column({
        type: 'text',
        default: null,
        name: 'description'
    })
    description: string;

    @Column({
        type: 'varchar',
        length: 255,
        name: 'logo',
        default: null
    })
    logo: string;

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

    @OneToMany(type => Staff, staff => staff.hospital)
    staffs: Staff[];

    @OneToMany(type => Department, department => department.hospital)
    departments: Department[];
}