import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, OneToOne, Repository, EntityRepository } from 'typeorm';
import { MedicalReport } from './medical-report';
import { PaymentHistory } from './payment-history';
import { User } from './user';
import { MedicalExamination } from './medical-examination';
import { FavoritedDoctor } from './favorited-doctor';
import { Appointment } from './appointment';

@Entity('patient')
export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User;
    @Column({name: 'user_id'})
    userId: string


    @Column({
        type: 'tinyint',
        width: 1,
        name: 'is_active',
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

    @OneToMany(type => MedicalReport, medicalReport => medicalReport.patient)
    medicalReports: MedicalReport[];

    @OneToMany(type => PaymentHistory, paymentHistory => paymentHistory.patient)
    payments: PaymentHistory[];

    @OneToMany(type => MedicalExamination, medicalExamination => medicalExamination.patient)
    medicalExaminations: MedicalExamination[];

    @OneToMany(type => FavoritedDoctor, favoritedDoctor => favoritedDoctor.patient)
    favoritedDoctors: FavoritedDoctor[];

    @OneToMany(type => Appointment, appointment => appointment.patient)
    appointments: Appointment[];

}