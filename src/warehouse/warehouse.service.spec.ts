import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {RespositoryWarehouse} from './../mocks/warehouse.repository.mock';
import {DistanceServiceMock} from './../mocks/distance.service.mock';


describe('WarehouseService', () => {
    let warehouseService: WarehouseService;
    let distanceService: DistanceService;
  
    beforeEach(async () => {

      const module = await Test.createTestingModule({
        controllers: [],
        components:[WarehouseService],
        providers: [
          {
            provide: DistanceService,
            useClass: DistanceServiceMock
          },
          WarehouseService,
          {
            provide: Repository,
            useValue: RespositoryWarehouse,
          },
        ],
      }).compile();
   
      warehouseService = module.get<WarehouseService>(WarehouseService);

    });
  
    describe('getNearestWarehouse', () => {
      it('should return an object of warehouse', async () => {
    
        let distances= [
          {
            warehouse: 
            {
              id: 2,
              city: 'Buenos Aires',
              maxLimit:200, 
              isDelayedAllow:false, 
              packages:[]
            },
            distance: 50 
          }
        ];
        
      
        expect(await warehouseService.getNearestWarehouse("Avellaneda")).toBe(distances);
      });
    });
  });