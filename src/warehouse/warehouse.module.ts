import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { DistanceService } from './distanceGoogle.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './warehouse.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, WarehouseRepository])
  ],
  controllers:[ WarehouseController]
  ,
  providers: [
    DistanceService,
    WarehouseService],
  exports: [ WarehouseService ]
})
export class WarehouseModule {}
