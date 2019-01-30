import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistanceServiceMock } from './../mocks/distance.service.mock';
import { Package } from '../models/package.entity';
import { WarehouseRepository } from './warehouse.repository';
import { RespositoryWarehouseMook } from './../mocks/warehouse.repository.mock';

describe('WarehouseService', () => {
  let warehouseService: WarehouseService;
  let distanceService: DistanceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: Repository,
          useValue: RespositoryWarehouseMook,
        },
        {
          provide: DistanceService,
          useClass: DistanceServiceMock,
        },
        WarehouseService,
      ],
    }).compile();

    warehouseService = module.get<WarehouseService>(WarehouseService);
  });

  describe('getNearestWarehouse', async () => {
    it('should return an object of warehouse', async () => {
      
      var result = {id: 2, name:"WH02", city: 'Buenos Aires', maxLimit:100, isDelayedAllow:false, packages:[]};

      expect(await warehouseService.getNearestWarehouse('Avellaneda')).toBe(
        result,
      );
    });
  });
});
