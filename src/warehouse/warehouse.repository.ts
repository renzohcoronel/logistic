import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Warehouse } from "../models/warehouse.entity";

@Component()
export class WarehouseRepository {

    constructor(@InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>){      
    }

    async getWarehouses():Promise<Warehouse[]> {
        return this.warehouseRepository.find({ relations: ["packages"] });
     }

}