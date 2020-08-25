import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn , OneToOne} from 'typeorm';
import { Patient } from './patient';
import { Doctor } from './doctor';

@Entity('favorited_doctor')
export class FavoritedDoctor extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => Patient, patient => patient.favoritedDoctors)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
    @Column({ name: 'patient_id' })
    patientId: string

    @ManyToOne(type => Doctor, doctor => doctor.favoritedDoctors)
    @JoinColumn({name: 'doctor_id'})
    doctor: Doctor;
    @Column({name: 'doctor_id'})
    doctorId: string;

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