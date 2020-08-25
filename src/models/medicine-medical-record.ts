import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne , JoinColumn} from 'typeorm';
import { Length, MaxLength } from 'class-validator';
import { MedicalRecord } from './medical-record';
import { Medicine } from './medicine';

@Entity('medicine_medical_record')
export class MedicineMedicalRecord extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ManyToOne(type => MedicalRecord, medicalRecord => medicalRecord.medicineMedicalRecords)
    @JoinColumn({ name: 'medicalRecord_id' })
    medicalRecord: MedicalRecord;
    @Column({ name: 'medicalRecord_id' })
    medicalRecordId: number

    @ManyToOne(type => Medicine, medicine => medicine.medicineMedicalRecords)
    @JoinColumn({ name: 'medicine_id' })
    medicine: Medicine;
    @Column({ name: 'medicine_id' })
    medicineId: number

    @Column({
        type: 'int',
        name: 'quantity'
    })
    @Length(1, 255)
    quantity: number;

    @Column({
        type: 'varchar',
        length: '255',
        name: 'unit'
    })
    @Length(1, 255)
    unit: string;

    @Column({
        type: 'varchar',
        length: '255',
        name: 'note'
    })
    @Length(1, 255)
    note: string;
    
}