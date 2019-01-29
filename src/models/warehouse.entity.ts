import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
import { Package } from './package.entity';
  
  @Entity('wharehouse')
  export class Warehouse {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;
  
    @Column('int')
    maxLimit: number;

    @Column('boolean')
    isDelayedAllow: boolean;

    @OneToMany(type => Package, _package => _package.warehouse)
    packages: Package[];
  
  
  }