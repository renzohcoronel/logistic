import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Warehouse, Action } from '../models/warehouse.entity';
import { Package } from '../models/package.entity';
import { CONSTANTS, MESSAGES } from '../const/const';

describe('WarehouseService', async () => {
  let warehouseModule: TestingModule;
  let warehouseService: WarehouseService;
  let distanceService: DistanceService;
  let warehouseRepository: Repository<Warehouse>;

  beforeEach(async () => {
    warehouseModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Warehouse),
          useClass: Repository,
        },
        DistanceService,
        WarehouseService,
      ],
    }).compile();

    warehouseService = await warehouseModule.get<WarehouseService>(
      WarehouseService,
    );
    distanceService = await warehouseModule.get<DistanceService>(
      DistanceService,
    );
    warehouseRepository = await warehouseModule.get<Repository<Warehouse>>(
      getRepositoryToken(Warehouse),
    );
  });

  describe('getNearestWarehouse', () => {
    it('should return an object of warehouse ', async done => {
      warehouseRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 10,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest.fn().mockResolvedValue({
        duration: 100,
        distance: 7093,
      });

      const result = {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 21,
        maxOccupied: 95,
        duration: 100,
        distance: 7093,
        action: Action.ACCEPT,
        packages: [],
      };

      expect(warehouseService.getNearestWarehouse('Avellaneda'))
        .resolves.toEqual(result)
        ;
      done();
    });

    it('nearest', async done => {
      warehouseRepository.find = jest.fn(
        async (...args) =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              maxOccupied: 95,
              action: Action.NARBY_NEXT_WAREHOUSE,
              packages: new Array<Package>(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 10,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest.fn().mockResolvedValue({
        duration: 100,
        distance: 7093,
      });

      const result = {
        id: 2,
        name: 'WH02',
        city: 'Rosario',
        maxLimit: 10,
        maxOccupied: 95,
        duration: 100,
        distance: 7093,
        action: Action.ACCEPT,
        packages: [],
      };

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).resolves.toEqual(result);
      expect(warehouseRepository.find).toBeCalledTimes(1);
      expect(warehouseRepository.find).toBeCalledWith({
        relations: ['packages'],
      });
      done();
    });

    it('exception from distanceService', async (done) => {
      warehouseRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 10,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest
      .fn().mockRejectedValue({});

      expect(warehouseService.getNearestWarehouse('Avellaneda')).rejects.toEqual(
        { message: MESSAGES.DISTANCE_SERVICE_ERROR},
      );

      done();
    });

    it('delayed', async (done) => {
      warehouseRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              maxOccupied: 95,
              action: Action.ACCEPT_DELAYED,
              packages: new Array<Package>(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 2,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest.fn().mockResolvedValue({
        duration: 100,
        distance: 7093,
      });

      const result = {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 21,
        maxOccupied: 95,
        duration: 100,
        distance: 7093,
        action: Action.ACCEPT_DELAYED,
        packages: new Array(20),
      };

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).resolves.toEqual(result);
      done();
    });

    it('its 95% occupped', async (done) => {
      warehouseRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              maxOccupied: 95,
              action: Action.ACCEPT,
              packages: new Array(20),
            },
          ],
      );

      distanceService.getDistance = jest.fn().mockResolvedValue({
        duration: 100,
        distance: 7093,
      });

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).rejects.toEqual({
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        message: MESSAGES.WAREHOUSE_IS_OCCUPIED,
      });
      done();
    });

    it('update warehouse params action', async (done) => {
      warehouseRepository.findOneOrFail = jest.fn(async () => {
        const warehouse = new Warehouse();
        warehouse.id = 1;
        warehouse.name = 'WH01';
        warehouse.city = 'Buenos Aires';
        warehouse.maxLimit = 100;
        warehouse.action = Action.ACCEPT;
        return await warehouse;
      });

      warehouseRepository.save = jest.fn(async () => {
        const warehouse = new Warehouse();
        warehouse.id = 1;
        warehouse.name = 'WH01';
        warehouse.city = 'Buenos Aires';
        warehouse.maxLimit = 100;
        warehouse.action = Action.ACCEPT_DELAYED;
        return await warehouse;
      });

      const warehouseModified = new Warehouse();
      warehouseModified.id = 1;
      warehouseModified.name = 'WH01';
      warehouseModified.city = 'Buenos Aires';
      warehouseModified.maxLimit = 100;
      warehouseModified.action = Action.ACCEPT_DELAYED;

      expect(
        warehouseService.changeWarehouseAction(
          1,
          Action.ACCEPT_DELAYED,
        )).resolves.toEqual(warehouseModified);
      done();
    });

  });
});
