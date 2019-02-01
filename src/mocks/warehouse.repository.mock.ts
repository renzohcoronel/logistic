import { Warehouse } from "../models/warehouse.entity";

export class WarehouseRepositoryMock {

    async getWarehouses():Promise<Warehouse[]> {
        return new Promise<Warehouse[]>((resolve, rejected)=>{
           return [
                {id: 2, name:"WH02", city: 'Buenos Aires', maxLimit:1,  actionWhenLimit:'ACCEPT',  packages:[]}
              ];
        });
        
    }
}