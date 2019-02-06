import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Package, Status } from './../models/package.entity';
import { Warehouse} from '../models/warehouse.entity';
import { WarehouseService } from './../warehouse/warehouse.service';
import { PackageService } from './../package/package.service';
import { Repository } from 'typeorm';
import { DistanceService } from '../warehouse/distanceGoogle.service';
import { Customer } from '../models/customer.entity';
import { WarehouseDTO } from './../dtos/warehouse.dto';
import { CustomerDTO } from './../dtos/customer.dto';

import {
  distanServiceMock,
  warehouseRepositoryMock,
  packagesRepository,
} from './../mocks/mocks';

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
          useValue: packagesRepository,
        },
        {
          provide: getRepositoryToken(Warehouse),
          useValue: warehouseRepositoryMock,
        },
        {
          provide: DistanceService,
          useValue: distanServiceMock,
        },
        WarehouseService,
        PackageService,
      ],
      imports: [],
    }).compile();

    warehouseService = m.get<WarehouseService>(WarehouseService);
    packageRespository = m.get<Repository<Package>>(
      getRepositoryToken(Package),
    );
    packageService = m.get<PackageService>(PackageService);
  });

  describe('savePackage', () => {
    it('should save a new package', async () => {
      const nearestWarehouse = Object.assign(new Warehouse(), {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 70,
        action: 'ACCEPT',
        packages: [],
      });

      const packageSaved = Object.assign(new Package(), {
        id: 11,
        from: 'Cordoba',
        customer: Object.assign(new Customer(), {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        }),
        to: 'Avellaneda',
        warehouse: Object.assign(new Warehouse(), {
          id: 1,
          name: 'WH01',
          city: 'Buenos Aires',
        }),
        status: Status.RECEIVED,
      });

      const packageDTO = {
        id: 11,
        customer: Object.assign(new CustomerDTO(), {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        }),
        from: 'Cordoba',
        to: 'Avellaneda',
        warehouse: new WarehouseDTO(),
        status: null,
      };

      const packageDTOSend = {
        id: 11,
        customer: Object.assign(new CustomerDTO(), {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        }),
        from: 'Cordoba',
        to: 'Avellaneda',
        warehouse: Object.assign(new WarehouseDTO(), {
          id: 1,
          city: 'Buenos Aires',
          name: 'WH01',
        }),
        status: Status.RECEIVED,
      };

      warehouseService.getNearestWarehouse = jest.fn(() => nearestWarehouse);

      packageRespository.save = jest.fn(() => packageSaved);
      packageRespository.create = jest.fn(() => new Customer());
      expect(await packageService.savePackage(packageDTO)).toEqual(
        packageDTOSend,
      );
    });

  });
});
