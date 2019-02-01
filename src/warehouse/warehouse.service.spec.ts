import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistanceServiceMock } from './../mocks/distance.service.mock';
import { Package } from '../models/package.entity';
import { Warehouse } from '../models/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';
import { WarehouseRepositoryMock } from './../mocks/warehouse.repository.mock';

describe('WarehouseService', async () => {
  let m: TestingModule;
  let warehouseService: WarehouseService;
  let warehousesRepository: WarehouseRepositoryMock


  beforeEach(async () => {
     m = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(WarehouseRepository),
          useClass: WarehouseRepositoryMock
        },
        {
          provide: DistanceService,
          useClass: DistanceServiceMock,
        },
        
        WarehouseService,
      ],
    }).compile();

    warehouseService = await m.get<WarehouseService>(WarehouseService);
    warehousesRepository = await m.get<WarehouseRepository>(getRepositoryToken(WarehouseRepository));

  });

  describe('getNearestWarehouse', () => {
    it('should return an object of warehouse', async () => {

      
      var result = {id: 2, name:"WH02", city: 'Buenos Aires', maxLimit:100, isDelayedAllow:false, packages:[]};
       
      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toBe(
        result,
      );

    });
  });
});
