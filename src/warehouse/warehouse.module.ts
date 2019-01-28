import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { DistanceService } from './distanceGoogle.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse])
  ],
  controllers: [],
  providers: [DistanceService,WarehouseService],
  exports: [ WarehouseService ]
})
export class WarehouseModule {}
