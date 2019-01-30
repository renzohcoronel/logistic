import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { Warehouse } from '../models/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class WarehouseService {
  
    constructor( private warehouseRepository: WarehouseRepository,
    private distanceService: DistanceService){      
    }

    async getNearestWarehouse(to:String): Promise<Warehouse>{
        return new Promise<Warehouse> (async (resolve, reject)=>{

        const warehouses = await this.warehouseRepository.getWarehouses();
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
   
        let result = warehouseDistances.reduce((prev, curr)=>{ 
            return prev.distance < curr.distance ? prev : curr;
        });

        let whSelected = result.warehouse;

    
        if(whSelected.packages.length < whSelected.maxLimit ){
              if(whSelected.packages.length * 100 / whSelected.packages.length < 0.95 ){
                  resolve(whSelected);
                
              } else if( whSelected.isDelayedAllow){
                  resolve(whSelected);
              } else {
                  reject({
                      id: whSelected.id,
                      name: whSelected.name,
                      city: whSelected.city,
                      message:'it warehouse is not allow delay'
                  } )
              }
        } else {
            reject(
                {
                    id: whSelected.id,
                    name: whSelected.name,
                    city: whSelected.city,
                    message: 'it warehouse is completed'
                })
        }
        
  
    });
    }

   

}
