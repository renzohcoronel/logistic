import {
  Injectable,
  UseInterceptors,
  ClassSerializerInterceptor,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from './../models/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Package, Status } from './../models/package.entity';
import { PackageDTO } from 'dtos/package.dto';
import { WarehouseService } from './../warehouse/warehouse.service';
import { Customer } from './../models/customer.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRespository: Repository<Package>,
    private warehouseService: WarehouseService,
  ) {}

  async savePackage(packageDto: PackageDTO): Promise<PackageDTO> {
    return new Promise<PackageDTO>(async (resolve, rejected) => {

      let wh = null
      try {
        wh = await this.warehouseService.getNearestWarehouse(packageDto.to);
        
        
        let newPackage = this.packageRespository.create();
        newPackage.from = packageDto.from;
        newPackage.customer = new Customer();
        newPackage.customer.id = packageDto.customer.id;
        newPackage.to = packageDto.to;
        newPackage.warehouse = wh ? wh : null;
        newPackage.status = Status.RECEIVED;
  
        newPackage = await this.packageRespository.save(newPackage);

  
        packageDto.id = newPackage.id;
        packageDto.warehouse.id = newPackage.warehouse.id;
        packageDto.warehouse.city = newPackage.warehouse.city;
        packageDto.warehouse.name = newPackage.warehouse.name;
        packageDto.status = newPackage.status;

  
        resolve(packageDto);
        
        
      } catch (error) {
        rejected(error);
        
      }
        

     
    });
  }
}
