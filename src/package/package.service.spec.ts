import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Package, Status } from './../models/package.entity';
import { Warehouse } from '../models/warehouse.entity';
import { WarehouseRepositoryMock } from './../mocks/warehouse.repository.mock';
import { PackageRespositoryMock } from '../mocks/package.repository.mock';
import { WarehouseService } from './../warehouse/warehouse.service';
import { PackageService } from './../package/package.service';
import { Repository } from 'typeorm';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import { DistanceService } from '../warehouse/distanceGoogle.service';
import { DistanceServiceMock } from '../mocks/distance.service.mock';
import { Customer } from '../models/customer.entity';
import { WarehouseDTO } from './../dtos/warehouse.dto';

describe('PackageService', async () => {
  let m: TestingModule;
  let warehouseService: WarehouseService;
  let packageRespository: Repository<Package>;
  let packageService: PackageService;

  beforeEach(async () => {

    m = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Package),
          useClass: PackageRespositoryMock,
        },
        {
            provide: getRepositoryToken(WarehouseRepository),
            useClass: WarehouseRepositoryMock
          },
          {
            provide: DistanceService,
            useClass: DistanceServiceMock,
          }
        , WarehouseService,
        PackageService,
      ],
     imports :[  ]
    }).compile();

    warehouseService = m.get<WarehouseService>(WarehouseService);
    packageRespository = m.get<Repository<Package>>(
      getRepositoryToken(Package),
    );
    packageService = m.get<PackageService>(PackageService);
  });

  describe('savePackage', () => {
    it('should return an object of warehouse', async () => {
      const nearestWarehouse = {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 70,
        actionWhenLimit: 'ACCEPT',
        packages: [],
      };

      const packageSaved = {
        id: 11,
        from: 'Cordoba',
        customer: {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        },
        to: 'Avellaneda',
        warehouse: {
          id: 1,
          name: 'WH01',
          city: 'Buenos Aires',
        },
        status: 'RECEIVED',
      };

      const packageDTO = {
        id: 11,
        customer: {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        },
        from: 'Cordoba',
        to: 'Avellaneda',
        warehouse: new WarehouseDTO(),
        status: null,
      };

      const packageDTOSend = {
        id: 11,
        customer: {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        },
        from: 'Cordoba',
        to: 'Avellaneda',
        warehouse: Object.assign(new WarehouseDTO(), { id: 1, city: 'Buenos Aires', name: 'WH01' }),
        status: 'RECEIVED',
      };

     warehouseService.getNearestWarehouse = jest.fn(()=> nearestWarehouse);

     packageRespository.save = jest.fn(()=> packageSaved);
     packageRespository.create = jest.fn(()=> new Customer())
  
      expect(await packageService.savePackage(packageDTO)).toEqual(
        packageDTOSend
      );
    });
  });
});
