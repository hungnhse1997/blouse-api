import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Department } from './department';
import { User } from './user';
import { MedicalExamination } from './medical-examination';
import { FavoritedDoctor } from './favorited-doctor';
import { Appointment } from './appointment';

@Entity('doctor')
export class Doctor extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(type => Department, department => department.doctors)
    @JoinColumn({ name: 'department_id' })
    department: Department;
    @Column({ name: 'department_id' })
    departmentId: number;

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

    @OneToMany(type => MedicalExamination, medicalExamination => medicalExamination.doctor)
    medicalExaminations: MedicalExamination[];

    @OneToMany(type => FavoritedDoctor, favoritedDoctor => favoritedDoctor.doctor)
    favoritedDoctors: FavoritedDoctor[];

    @OneToMany(type => Appointment, appointment => appointment.doctor)
    appointments: Appointment[];

}