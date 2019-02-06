import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Warehouse, Action } from '../models/warehouse.entity';
import { distanServiceMock, warehouseRepositoryMock } from './../mocks/mocks';

describe('WarehouseService', async () => {
  let m: TestingModule;
  let warehouseService: WarehouseService;
  let warehousesRepository: Repository<Warehouse>;
  let distanceService: DistanceService;

  beforeEach(async () => {
    m = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Warehouse),
          useValue: warehouseRepositoryMock,
        },
        {
          provide: DistanceService,
          useValue: distanServiceMock,
        },

        WarehouseService,
      ],
    }).compile();

    warehouseService = await m.get<WarehouseService>(WarehouseService);
    warehousesRepository = await m.get<Repository<Warehouse>>(
      getRepositoryToken(Warehouse),
    );
    distanceService = await m.get<DistanceService>(DistanceService);
  });

  describe('getNearestWarehouse', () => {
    it('should return an object of warehouse ', async (done) => {
      const result = {
        id: 2,
        name: 'WH02',
        city: 'Buenos Aires',
        maxLimit: 100,
        action: 'ACCEPT',
        packages: [],
      };

      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toBe(
        result,
      );
      done();
    });

    it('nearest', async (done) => {
      warehousesRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              action: Action.NARBY_NEXT_WAREHOUSE,
              packages: new Array(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 10,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1)
        .mockResolvedValueOnce(10);

      const result = {
        id: 2,
        name: 'WH02',
        city: 'Rosario',
        maxLimit: 10,
        action: Action.ACCEPT,
        packages: [],
      };

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).resolves.toEqual(result);
      done();
    });

    it('exception from distanceService', async (done) => {
      warehousesRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              action: Action.ACCEPT,
              packages: new Array(1),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 2,
              action: Action.ACCEPT,
              packages: new Array(1),
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1)
        .mockRejectedValue('');

      expect(warehouseService.getNearestWarehouse('Avellaneda')).rejects.toBe(
        '',
      );

      done();
    });

    it('delayed', async (done) => {
      warehousesRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              action: Action.ACCEPT_DELAYED,
              packages: new Array(20),
            },
            {
              id: 2,
              name: 'WH02',
              city: 'Rosario',
              maxLimit: 2,
              action: Action.ACCEPT,
              packages: [],
            },
          ],
      );

      distanceService.getDistance = jest
        .fn()
        .mockResolvedValue(1)
        .mockResolvedValueOnce(10);

      const result = {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 21,
        action: Action.ACCEPT_DELAYED,
        packages: new Array(20),
      };

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).resolves.toEqual(result);
      done();
    });

    it('its 95% occupped', async (done) => {
      warehousesRepository.find = jest.fn(
        async () =>
          await [
            {
              id: 1,
              name: 'WH01',
              city: 'Buenos Aires',
              maxLimit: 21,
              action: Action.ACCEPT,
              packages: new Array(20),
            },
          ],
      );

      distanceService.getDistance = jest.fn().mockResolvedValue(1);

      expect(
        warehouseService.getNearestWarehouse('Avellaneda'),
      ).rejects.toEqual({
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        message: 'warehouse is 95% occupied, it  will delayed delivery',
      });
      done();
    });

    it('update warehouse params action', async (done) => {
      warehousesRepository.findOneOrFail = jest.fn(async () => {
        const wh = new Warehouse();
        wh.id = 1;
        wh.name = 'WH01';
        wh.city = 'Buenos Aires';
        wh.maxLimit = 100;
        wh.action = Action.ACCEPT;
        return wh;
      });

      warehousesRepository.save = jest.fn(async () => {
        const wh = new Warehouse();
        wh.id = 1;
        wh.name = 'WH01';
        wh.city = 'Buenos Aires';
        wh.maxLimit = 100;
        wh.action = Action.ACCEPT_DELAYED;
        return wh;
      });

      const whModified = new Warehouse();
      whModified.id = 1;
      whModified.name = 'WH01';
      whModified.city = 'Buenos Aires';
      whModified.maxLimit = 100;
      whModified.action = Action.ACCEPT_DELAYED;

      expect(
        warehouseService.changeWarehouseAction(
          1,
          Action.ACCEPT_DELAYED,
        ),
      ).resolves.toEqual(whModified);
      done();
    });
  });
});
