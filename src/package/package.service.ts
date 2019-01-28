import { Injectable, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from 'models/package.entity';
import { PackageDTO } from 'dtos/package.dto';
import { WarehouseService } from 'warehouse/warehouse.service';

@Injectable()
export class PackageService {
  
    constructor(@InjectRepository(Package)
    private readonly packageRespository: Repository<Package>,
    private warehouseService: WarehouseService){       
    }

    async savePackage(_package:PackageDTO): Promise<PackageDTO> {
        
        console.log("[Package ] ", _package);

        let wharehouse = await this.warehouseService.getNearestWarehouse(_package.to);

        let newPackage = new Package();
        newPackage.customer = _package.customer;
        newPackage.from = _package.from;
        newPackage.to = _package.to;
        newPackage.warehouse = wharehouse;
        newPackage.status = _package.status;

        newPackage = await this.packageRespository.save(newPackage);
        
        _package.id = newPackage.id;

        return _package;
    }

}
