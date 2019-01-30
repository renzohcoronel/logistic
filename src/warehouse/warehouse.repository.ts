import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Warehouse } from "../models/warehouse.entity";

@Injectable()
export class WarehouseRepository {

    constructor(@InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>){      
    }

    async getWarehouses():Promise<Warehouse[]> {
        console.log("[WarehouseRepository] getWarehouses")
        return this.warehouseRepository.find({ relations: ["packages"] });
     }

}