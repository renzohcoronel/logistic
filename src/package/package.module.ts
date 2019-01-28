import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { Package } from 'models/package.entity';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { WarehouseModule } from 'warehouse/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package]),
    WarehouseModule
  ],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackagesModule {}
