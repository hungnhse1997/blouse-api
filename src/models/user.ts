import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IsEmail, IsPhoneNumber, Length, MaxLength } from 'class-validator';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: 'varchar',
        length: '255',
        name: 'full_name',
        default: null
    })
    @Length(1, 255)
    fullName: string;

    @Column({
        type: 'varchar',
        length: '255',
        name: 'title',
        default: null
    })
    title: string;

    @Column({
        type: 'tinyint',
        width: 1,
        name: 'gender',
        default: null
    })
    gender: number;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
        name: 'phone',
        default: null
    })
    @MaxLength(20)
    @IsPhoneNumber('VN', {
        message: 'Số điện thoại của bạn không hợp lệ!'
    })
    phoneNumber: string;

    @Column({
        type: 'date',
        name: 'date_of_birth',
        default: null
    })
    dateOfBirth: Date;

    @Column({
        type: 'varchar',
        length: 255,
        name: 'address',
        default: null
    })
    @MaxLength(255)
    address: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        name: 'email'
    })
    @MaxLength(255)
    @IsEmail()
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        default: null,
        name: 'username'
    })
    @Length(6, 255)
    username: string;

    @Column({
        type: 'varchar',
        length: 255,
        default: null,
        name: 'password'
    })
    @Length(6, 255)
    password: string;

    @Column({
        type: 'text',
        name: 'avatar',
        default: null
    })
    avatar: string;

    @Column({
        type: 'varchar',
        length: 12,
        name: 'role'
    })
    @Length(4, 12)
    role: string;

    @Column({
        type: 'tinyint',
        width: 1,
        name: 'is_verified',
        default: 0
    })
    isVerified: number;

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