import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
import { Package } from './package.entity';

@Entity('customer')
  export class Customer {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    surname: string;
    @Column()
    adress: string;
    @Column()
    phone: string;
    @Column()
    email: string;

    @OneToMany(type => Package, pkg => pkg.customer)
    packages: Package[];

  }