import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { Warehouse, Action } from '../models/warehouse.entity';
import { MESSAGES, CONSTANTS } from './../const/const';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private distanceService: DistanceService,
  ) {}

  async getNearestWarehouse(to: string): Promise<Warehouse> {
    return new Promise<Warehouse>(async (resolve, reject) => {
      const warehouses = await this.warehouseRepository.find({
        relations: ['packages'],
      });
      const warehouseDistances = [];

      const warehousePromise = warehouses.map(async warehouse => {
        await this.distanceService
          .getDistance([warehouse.city], [to.toString()])
          .then(({ distance, duration }) => {
            this.logger.log(
              ` ${warehouse.city} - ${to} Distance: ${distance} Duration: ${duration}`,
            );
            if (!(distance === undefined || duration === undefined)){
              warehouseDistances.push({ ...warehouse, distance, duration });
            }
          })
          .catch(err => {
            this.logger.log(err.error_message);
            reject({
              message: MESSAGES.DISTANCE_SERVICE_ERROR,
            });
          });
      });

      await Promise.all(warehousePromise);

      // search nearest warehouse
      const result = warehouseDistances.sort((prev, curr) => {
        return prev.distance - curr.distance;
      });

      /**
       * if a warehouse reaches the limit, search the next nearest warehouse
       */
      result.forEach(warehouse => {
        const percentageOccupied =
          (warehouse.packages.length * 100) / warehouse.maxLimit;

        if (warehouse.packages.length <= warehouse.maxLimit) {
          if (percentageOccupied < warehouse.maxOccupied) {
            resolve(warehouse);
          } else if (warehouse.action === Action.ACCEPT_DELAYED) {
            resolve(warehouse);
          } else if (warehouse.action === Action.NEARBY_NEXT_WAREHOUSE) {
            /* the warehouse not accept more package. Search the next warehouse
             */
          } else {
            reject({
              id: warehouse.id,
              name: warehouse.name,
              city: warehouse.city,
              message: MESSAGES.WAREHOUSE_IS_OCCUPIED,
            });
          }
        }
      });

      // if all warehouses are complete
      reject({
        message: MESSAGES.ALL_WAREHOUSES_COMPLETED,
      });
    });
  }

  async changeWarehouseAction(idWarehouse, value: Action): Promise<Warehouse> {
    const wh = await this.warehouseRepository.findOneOrFail(idWarehouse);
    wh.action = value;
    return await this.warehouseRepository.save(wh);
  }
}
