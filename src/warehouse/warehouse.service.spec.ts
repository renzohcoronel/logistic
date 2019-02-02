import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistanceServiceMock } from './../mocks/distance.service.mock';
import { Package } from '../models/package.entity';
import { Warehouse, ActionWhenLimit } from '../models/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';
import { WarehouseRepositoryMock } from './../mocks/warehouse.repository.mock';

describe('WarehouseService', async () => {
  let m: TestingModule;
  let warehouseService: WarehouseService;
  let warehousesRepository: WarehouseRepositoryMock;
  let distanceService: DistanceService;

  beforeEach(async () => {
    m = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(WarehouseRepository),
          useClass: WarehouseRepositoryMock,
        },
        {
          provide: DistanceService,
          useClass: DistanceServiceMock,
        },

        WarehouseService,
      ],
    }).compile();

    warehouseService = await m.get<WarehouseService>(WarehouseService);
    warehousesRepository = await m.get<WarehouseRepository>(
      getRepositoryToken(WarehouseRepository),
    );
    distanceService = await m.get<DistanceService>(DistanceService);
  });

  describe('getNearestWarehouse', () => {
    it('should return an object of warehouse ', async () => {
      const result = {
        id: 2,
        name: 'WH02',
        city: 'Buenos Aires',
        maxLimit: 100,
        actionWhenLimit: 'ACCEPT',
        packages: [],
      };

      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toBe(
        result,
      );
    });

    it('nearest', async () => {
      warehousesRepository.getWarehouses = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              actionWhenLimit: ActionWhenLimit.NARBY_NEXT_WAREHOUSE,
              packages: new Array(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 10,
              actionWhenLimit: ActionWhenLimit.ACCEPT,
              packages: new Array(1),
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1)
        .mockResolvedValueOnce(10);

      const result =  {
        id: 2,
        name: 'WH02',
        city: 'Rosario',
        maxLimit: 10,
        actionWhenLimit: ActionWhenLimit.ACCEPT,
        packages: new Package()[2],
      };

      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toEqual(
        result);
    });

    it('exception from distanceService', async () => {
      warehousesRepository.getWarehouses = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              actionWhenLimit: ActionWhenLimit.ACCEPT,
              packages: new Array(),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 2,
              actionWhenLimit: ActionWhenLimit.ACCEPT,
              packages: new Array(),
            },
          ],
      );

      distanceService.getDistance = jest
        .fn().mockResolvedValue(1)
        .mockRejectedValue('');

      expect(warehouseService.getNearestWarehouse('Avellaneda')).rejects.toBe('');
    });

    it('delayed', async () => {
      warehousesRepository.getWarehouses = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              actionWhenLimit: ActionWhenLimit.ACCEPT_DELAYED,
              packages: new Array(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 2,
              actionWhenLimit: ActionWhenLimit.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1)
        .mockResolvedValueOnce(10);

      const result =  {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 21,
        actionWhenLimit: ActionWhenLimit.ACCEPT_DELAYED,
        packages: new Array(20),
      };

      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toEqual(
        result);
    });

    it('its 95% occupped', async () => {
      warehousesRepository.getWarehouses = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              actionWhenLimit: ActionWhenLimit.ACCEPT,
              packages: new Array(20),
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1);

      expect(warehouseService.getNearestWarehouse('Avellaneda')).rejects.toEqual({
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        message: 'warehouse is 95% occupied, it  will delayed delivery',
      });
    });

  });
});
