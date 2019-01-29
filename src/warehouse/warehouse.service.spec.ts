import { DistanceService } from './distanceGoogle.service';
import { WarehouseService } from './warehouse.service';
import { Repository } from 'typeorm';
import { Warehouse } from './../models/warehouse.entity';


describe('WarehouseService', () => {
    let warehouseService: WarehouseService;
    let distanceService: DistanceService;
    let warehouseRepository:  Repository<Warehouse>
  
    beforeEach(() => {
      distanceService = new DistanceService();
      warehouseRepository = new Repository<Warehouse>();
      warehouseService = new WarehouseService(warehouseRepository,distanceService);
    });
  
    describe('findAll', () => {
      it('should return an object of warehouse', async () => {
        let warehouses = [
          {id: 2, city: 'Buenos Aires', maxLimit:200, isDelayedAllow:false, packages:[]},
          {id: 3, city: 'La Plata', maxLimit:100, isDelayedAllow:false, packages:[]},
          {id: 4, city: 'Rosario', maxLimit:150, isDelayedAllow:false, packages:[]}
        ]

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
        
        jest.spyOn(warehouseRepository, 'find').mockImplementation(() => warehouses);
        jest.spyOn(distanceService, 'getDistance').mockImplementation(() => distances);

        let warehouseExpected = new Warehouse();
        warehouseExpected.id = 2;
        warehouseExpected.city = 'Buenos Aires';
        warehouseExpected.maxLimit = 200;
        warehouseExpected.isDelayedAllow = false;
        warehouseExpected.packages = [];

        expect(await warehouseService.getNearestWarehouse("Avellaneda")).toBe(warehouseExpected);
      });
    });
  });