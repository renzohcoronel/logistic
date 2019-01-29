import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { resolve } from 'url';
import { throws } from 'assert';

@Injectable()
export class WarehouseService {
  
    constructor(@InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private distanceService: DistanceService){      
    }

    async getNearestWarehouse(to:String): Promise<Warehouse>{
        return new Promise<Warehouse> (async (resolve, reject)=>{

       
        const warehouses = await this.getWarehouses();
        let warehouseDistances = [];
        
        let warehousePromise = warehouses.map( async warehouse => {
           
           await this.distanceService.getDistance([warehouse.city], [to.toString()]).then(value =>  {
            console.log(`[WarehouseService ] ${warehouse.city} - ${to} Distance: ${value}`);
            warehouseDistances.push({ warehouse: warehouse, distance: value});  

           }).catch(err =>{
                console.log(err.error_message);
           });      
        });

        await Promise.all(warehousePromise);

        console.log(`[ Warehouses distances ]`);
    
        let value = warehouseDistances.reduce((a, b) => Math.min(a.distance, b.distance)); 
        console.log("MIMIUM VALUE :");
        resolve(value);
  
    });
    }

    async getWarehouses():Promise<Warehouse[]> {
       return this.warehouseRepository.find();
    }

}
