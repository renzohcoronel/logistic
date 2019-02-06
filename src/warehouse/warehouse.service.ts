import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistanceService } from './distanceGoogle.service';
import { Warehouse, Action } from '../models/warehouse.entity';

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

      const warehousePromise = warehouses.map(async wh => {
        await this.distanceService
          .getDistance([wh.city], [to.toString()])
          .then(({ distance, duration }) => {
            this.logger.log(
              ` ${wh.city} - ${to} Distance: ${distance} Duration: ${duration}`,
            );
            if (!(distance === undefined || duration === undefined)){
              warehouseDistances.push({ ...wh, distance, duration });
            }
          })
          .catch(err => {
            this.logger.log(err.error_message);
            reject(err);
          });
      });

      await Promise.all(warehousePromise);

      // search nearest warehouse
      const result = warehouseDistances.sort((prev, curr) => {
        this.logger.log(`${prev.distance} - ${curr.distance}`);
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
          } else if (warehouse.action === Action.NARBY_NEXT_WAREHOUSE) {
            /* dejo seguir el bucle para el proximo elemento.
             */
          } else {
            reject({
              id: warehouse.id,
              name: warehouse.name,
              city: warehouse.city,
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

  async changeWarehouseAction(idWarehouse, value: Action): Promise<Warehouse> {
    const wh = await this.warehouseRepository.findOneOrFail(idWarehouse);
    wh.action = value;
    return await this.warehouseRepository.save(wh);
  }
}
