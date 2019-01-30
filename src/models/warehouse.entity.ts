import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
import { Package } from './package.entity';

export enum ActionWhenLimit {
  ACCEPT ="ACCEPT",
  ACCEPT_DELAYED ="ACCEPT_DELAYED",
  NARBY_NEXT_WAREHOUSE = "NARBY_NEXT_WAREHOUSE"
}
  
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

    @Column('enum', { enum: ActionWhenLimit })
    actionWhenLimit: ActionWhenLimit;

    @OneToMany(type => Package, _package => _package.warehouse)
    packages: Package[];
  
  
  }