import { Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityRepository } from "typeorm";
import { Warehouse } from "../models/warehouse.entity";

@EntityRepository(Warehouse)
export class WarehouseRepository extends Repository<Warehouse>{

  
    async getWarehouses():Promise<Warehouse[]> {
        console.log("[WarehouseRepository] getWarehouses")
        return this.find({ relations: ["packages"] });
     }

}