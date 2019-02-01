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
  let distanceService: DistanceService;


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
    distanceService = await m.get<DistanceService>(DistanceService);

  });

  describe('getNearestWarehouse', () => {
 

    it('should return an object of warehouse ', async () => {

      
      var result = {id: 2, name:"WH02", city: 'Buenos Aires', maxLimit:100, actionWhenLimit:'ACCEPT', packages:[]};
       
      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toBe(
        result,
      );

    });

    it('should return an object of warehouse nearest', async () => {

      warehousesRepository.getWarehouses = jest.fn(async ()=> await [
        {id: 1, name:"WH01", city: 'Buenos Aires', maxLimit:1,  actionWhenLimit:'NARBY_NEXT_WAREHOUSE',  packages:[ new Package()]},
        {id: 2, name:"WH02", city: 'Rosario', maxLimit:2,  actionWhenLimit:'ACCEPT',  packages:[]}
      ])


      distanceService.getDistance = jest.fn().mockReturnValue(1).mockReturnValueOnce(3);

      var result = {id: 2, name:"WH02", city: 'Rosario', maxLimit:2,  actionWhenLimit:'ACCEPT',  packages:[]}
       
      expect(warehouseService.getNearestWarehouse('Avellaneda')).resolves.toBe(
        result,
      );

    });

  

  });

  
});
