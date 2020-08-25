import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Hospital } from './hospital';
import { PaymentHistory } from './payment-history';
import { Appointment } from './appointment';
import { User } from './user';

@Entity('staff')
export class Staff extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(type => Hospital, hospital => hospital.staffs)
    @JoinColumn({name: 'hospital_id'})
    hospital: Hospital;
    @Column({name: 'hospital_id'})
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
}