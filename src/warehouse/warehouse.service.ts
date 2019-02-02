import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { Warehouse, ActionWhenLimit } from '../models/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(
    @InjectRepository(WarehouseRepository)
    private readonly warehouseRepository: WarehouseRepository,
    private distanceService: DistanceService,
  ) {}

  async getNearestWarehouse(to: string): Promise<Warehouse> {
    return new Promise<Warehouse>(async (resolve, reject) => {
      const warehouses = await this.warehouseRepository.getWarehouses();
      const warehouseDistances = [];

      const warehousePromise = warehouses.map(async wh => {
        await this.distanceService
          .getDistance([wh.city], [to.toString()])
          .then(value => {
            this.logger.log(` ${wh.city} - ${to} Distance: ${value}`);
            warehouseDistances.push({ warehouse: wh, distance: value });
          })
          .catch(err => {
            this.logger.log(err.error_message);
            reject(err);
          });
      });

      await Promise.all(warehousePromise);

      // search nearest warehouse
      const result = warehouseDistances.sort((prev, curr) => {
        return prev.distance < curr.distance ? prev : curr;
      });

      /**
       * if a warehouse reaches the limit, search the next nearest warehouse
       */

      result.forEach(wh => {
        const whSelected = wh.warehouse;
        const percentage =
          (whSelected.packages.length * 100) / whSelected.maxLimit;
        this.logger.log(
          ` Warehouse ${whSelected.name} Occupied %${percentage}`,
        );

        if (whSelected.packages.length <= whSelected.maxLimit) {
          if (percentage < 95) {
            resolve(whSelected);
          } else if (whSelected.actionWhenLimit === ActionWhenLimit.ACCEPT_DELAYED) {
            resolve(whSelected);
          }  else if (whSelected.actionWhenLimit === ActionWhenLimit.NARBY_NEXT_WAREHOUSE){
          }else {
            reject({
              id: whSelected.id,
              name: whSelected.name,
              city: whSelected.city,
              message: 'warehouse is 95% occupied, it  will delayed delivery',
            });
          }
        }
      });

      // if all warehouses are complete
      reject({
        message: 'warehouses are complete',
      });
    });
  }

  async changeWarehouseActionLimit(
    idWarehouse,
    value: ActionWhenLimit,
  ): Promise<any> {
    return await this.warehouseRepository.update(idWarehouse, {
      actionWhenLimit: value,
    });
  }
}
