import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { resolve } from 'url';

@Injectable()
export class WarehouseService {
  
    constructor(@InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private distanceService: DistanceService){      
    }

    async getNearestWarehouse(to:String): Promise<Warehouse>{
        return new Promise<Warehouse> (async (resolve, reject)=>{

       
        const warehouses = await this.getWarehouses();
        let warehouse_distances = [];
        
        let warehousePromise = warehouses.map( async _warehouse => {
           let distance =  await this.distanceService.getDistance([_warehouse.city], [to.toString()]);
           console.log(`[WarehouseService ] ${_warehouse.city} - ${to} Distance: ${distance}`);
           warehouse_distances.push({ warehouse: _warehouse, distance: distance});
        });

        await Promise.all(warehousePromise);

        console.log(warehouse_distances);

      
        return null;
  
    });
    }

    async getWarehouses():Promise<Warehouse[]> {
       return this.warehouseRepository.find();
    }

}
