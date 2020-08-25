import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { PaymentHistory } from './payment-history';
import { Appointment } from './appointment';
import { User } from './user';

@Entity('admin')
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: string

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