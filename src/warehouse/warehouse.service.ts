import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { Warehouse, ActionWhenLimit } from '../models/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private distanceService: DistanceService,
  ) {}

  async getNearestWarehouse(to: String): Promise<Warehouse> {
    return new Promise<Warehouse>(async (resolve, reject) => {
      const warehouses = await this.warehouseRepository.find({
        relations: ['packages'],
      });
      let warehouseDistances = [];

      let warehousePromise = warehouses.map(async warehouse => {
        await this.distanceService
          .getDistance([warehouse.city], [to.toString()])
          .then(value => {
            console.log(
              `[WarehouseService ] ${
                warehouse.city
              } - ${to} Distance: ${value}`,
            );
            warehouseDistances.push({ warehouse: warehouse, distance: value });
          })
          .catch(err => {
            console.log(err.error_message);
          });
      });

      await Promise.all(warehousePromise);

      // search nearest warehouse
      let result = warehouseDistances.sort((prev, curr) => {
        return prev.distance < curr.distance ? prev : curr;
      });
      
      /**
       * if a warehouse reaches the limit, search the next nearest warehouse
       */

      result.forEach(wh => {
        let whSelected = wh.warehouse;
        const percentage =
          (whSelected.packages.length * 100) / whSelected.maxLimit;
        console.log('[WarehouseService] percentage ', percentage);

        if (whSelected.packages.length < whSelected.maxLimit) {
          if (percentage < 95) {
            resolve(whSelected);
          } else if (
            whSelected.actionWhenLimit === ActionWhenLimit.ACCEPT_DELAYED
          ) {
            resolve(whSelected);
          } else {
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

  async changeWarehouseActionLimit(idWarehouse,value:ActionWhenLimit): Promise<any>{
    return await this.warehouseRepository.update(idWarehouse,{ actionWhenLimit: value });
  }
}
