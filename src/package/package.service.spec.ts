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


describe('PackageService', async () => {
  let modulePackages: TestingModule;
  let warehouseService: WarehouseService;
  let packageRespository: Repository<Package>;
  let packageService: PackageService;

  beforeEach(async () => {
    modulePackages = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Package),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Warehouse),
          useClass: Repository,
        },
        DistanceService,
        WarehouseService,
        PackageService,
      ],
      imports: [],
    }).compile();

    warehouseService = modulePackages.get<WarehouseService>(WarehouseService);
    packageRespository = modulePackages.get<Repository<Package>>(
      getRepositoryToken(Package),
    );
    packageService = modulePackages.get<PackageService>(PackageService);
  });

  describe('savePackage', () => {
    it('should save a new package', async (done) => {
      const nearestWarehouse = Object.assign(new Warehouse(), {
        id: 1,
        name: 'WH01',
        city: 'Buenos Aires',
        maxLimit: 100,
        maxOccupied: 95,
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
        amount: 100.0,
        dateOfDelivery: '2019-02-06',
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
        amount: null,
        dateOfDelivery: null,
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
        amount: 100.0,
        dateOfDelivery: '2019-02-06',
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

      expect(packageService.savePackage(packageDTO)).resolves.toEqual(
        packageDTOSend,
      );
      done();
    });

  });
});
