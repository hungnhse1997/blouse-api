import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Length } from 'class-validator';
import { Patient } from './patient'
import { Doctor } from './doctor'
import { MedicalExamination } from './medical-examination';

@Entity('appointment')
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @OneToOne(type => MedicalExamination, medicalExamination => medicalExamination.appointment)
    @JoinColumn({ name: 'medical_examination_id' })
    medicalExamination: MedicalExamination;
    @Column({ name: 'medical_examination_id' })
    medicalExaminationId: number;

    @ManyToOne(type => Patient, patient => patient.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
    @Column({ name: 'patient_id' })
    patientId: string

    @ManyToOne(type => Doctor, doctor => doctor.appointments)
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;
    @Column({ name: 'doctor_id' })
    doctorId: string;

    @Column({
        type: 'date',
        default: null,
        name: 'appointment_time'
    })
    appointmentTime: Date;

    @Column({
        type: 'varchar',
        length: '255',
        default: null,
        name: 'place'
    })
    @Length(1, 255)
    place: string;

    @Column({
        type: 'tinyint',
        width: 1,
        name: 'status',
        default: 0
    })
    status: number;

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