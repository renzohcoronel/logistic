import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Customer } from './customer.entity';

export enum Status {
  RECEIVED = 'RECEIVED',
  DELIVERED = 'DELIVERED',
}

@Entity('package')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: number;

  @Column({ type: 'date', nullable: true })
  dateOfDelivery: Date;

  @ManyToOne(type => Customer, customer => customer.packages)
  customer: Customer;

  @ManyToOne(type => Warehouse, warehouse => warehouse.packages)
  warehouse: Warehouse;

  @Column('enum', { enum: Status })
  status: Status;
}
