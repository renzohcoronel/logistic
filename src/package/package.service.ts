import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Package, Status } from './../models/package.entity';
import { PackageDTO } from './../dtos/package.dto';
import { WarehouseService } from './../warehouse/warehouse.service';
import { Customer } from './../models/customer.entity';
import { Action } from './../models/warehouse.entity';
import { CONSTANTS } from './../const/const';

@Injectable()
export class PackageService {
  private readonly logger = new Logger(PackageService.name);

  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private warehouseService: WarehouseService,
  ) {}

  async savePackage(packageDto: PackageDTO): Promise<PackageDTO> {
    return new Promise<PackageDTO>(async (resolve, rejected) => {
      let nearbyWarehouse = null;

      const { from, to, customer } = packageDto;

      try {
        nearbyWarehouse = await this.warehouseService.getNearestWarehouse(
          packageDto.to,
        );

        let newPackage = new Package();
        newPackage.from = from;
        newPackage.customer = new Customer();
        newPackage.customer.id = customer.id;
        newPackage.to = to;

        newPackage.amount = nearbyWarehouse.distance / CONSTANTS.FACTOR_AMOUNT;

        const dateOfDelivery = new Date();
        newPackage.dateOfDelivery =
          nearbyWarehouse.action === Action.ACCEPT_DELAYED
            ? moment(dateOfDelivery)
                .add(1, 'days')
                .toDate()
            : dateOfDelivery;

        newPackage.warehouse = nearbyWarehouse;
        newPackage.status = Status.RECEIVED;

        newPackage = await this.packageRepository.save(newPackage);

        this.logger.log(`Package: ${newPackage.id}`);

        packageDto.id = newPackage.id;
        packageDto.warehouse.id = newPackage.warehouse.id;
        packageDto.warehouse.city = newPackage.warehouse.city;
        packageDto.warehouse.name = newPackage.warehouse.name;
        packageDto.amount = newPackage.amount;
        packageDto.dateOfDelivery = moment(newPackage.dateOfDelivery).format(
          'YYYY-MM-DD',
        );
        packageDto.status = newPackage.status;

        resolve(packageDto);
      } catch (error) {
        rejected(error);
      }
    });
  }
}
