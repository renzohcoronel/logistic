import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './../models/package.entity';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { WarehouseModule } from './../warehouse/warehouse.module';
import { Customer } from './../models/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Customer]), WarehouseModule],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackagesModule {}
