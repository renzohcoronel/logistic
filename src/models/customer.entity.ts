import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
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
  
  
  
  }