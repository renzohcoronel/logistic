import {
  Injectable,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from 'models/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Package, Status } from 'models/package.entity';
import { PackageDTO } from 'dtos/package.dto';
import { WarehouseService } from 'warehouse/warehouse.service';
import { Customer } from 'models/customer.entity';


@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRespository: Repository<Package>,
    private warehouseService: WarehouseService,
  ) {}

  async savePackage(packageDto: PackageDTO): Promise<PackageDTO> {
    console.log('[Package ] ', packageDto);

    let warehouse = await this.warehouseService.getNearestWarehouse(
      packageDto.to,
    );
    console.log(`[ warehouse selected ] ->  ${warehouse}`);
    let newPackage = this.packageRespository.create();
    newPackage.from = packageDto.from;
    newPackage.customer = packageDto.customer;
    newPackage.to = packageDto.to;
    newPackage.warehouse = warehouse? warehouse: null;
    newPackage.status = Status.RECEIVED;

    console.log(`[ Package new ] -> `, newPackage);

    newPackage = await this.packageRespository.save(newPackage,{});
    

    packageDto.id = newPackage.id;
    packageDto.status = newPackage.status;

    return packageDto;
  }
}
