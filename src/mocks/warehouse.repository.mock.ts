import { Warehouse } from "../models/warehouse.entity";

export class RespositoryWarehouseMook {

    async getWarehouses():Promise<Warehouse[]> {
        return new Promise<Warehouse[]>(async (resolve, rejected)=>{
           return await [
                {id: 2, name:"WH02", city: 'Buenos Aires', maxLimit:100, isDelayedAllow:false, packages:[]},
                {id: 3, name:"WH01", city: 'La Plata', maxLimit:100, isDelayedAllow:false, packages:[]},
              ];
        });
        
    }
}