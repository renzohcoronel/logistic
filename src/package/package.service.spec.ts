import { Repository } from 'typeorm';
import { Warehouse } from './../models/warehouse.entity';
import { PackageService } from './package.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { Package } from '../models/package.entity';
import { PackageDTO } from '../dtos/package.dto';
import { DistanceService } from '../warehouse/distanceGoogle.service';

describe('WarehouseService', () => {
  let packageService: PackageService;
  let packageRespository: Repository<Package>;
  let warehouseService: WarehouseService;
  let distanceService: DistanceService;
  let warehouseRepository: Repository<Warehouse>;

  beforeEach(() => {
    packageRespository = new Repository<Package>();
    warehouseService = new WarehouseService(
      warehouseRepository,
      distanceService,
    );
    packageService = new PackageService(packageRespository, warehouseService);
  });

  describe('savePackage', () => {
    it('should return an object of package', async () => {
      let warehouse = {
        id: 2,
        city: 'Buenos Aires',
        maxLimit: 200,
        isDelayedAllow: false,
        packages: [],
      };
      let packageDto: PackageDTO = new PackageDTO();
      packageDto.id = null;
      packageDto.from = 'Córdoba';
      packageDto.to = 'Avellaneda';
      packageDto.customer = {
        id: 21,
        name: 'Alberto ',
        surname: 'Perez',
        adress: 'string',
        phone: 'string',
        email: 'string',
      };
      packageDto.warehouse = null;
      packageDto.status = null;

      let packageSaved = {
        id: 1,
        from: 'Córdoba',
        to: 'Avellaneda',
        customer: {
          id: 21,
          name: 'Alberto ',
          surname: 'Perez',
          adress: 'string',
          phone: 'string',
          email: 'string',
        },
        warehouse: warehouse,
        status: 'RECEIVED',
      };
      jest
        .spyOn(warehouseService, 'getNearestWarehouse')
        .mockImplementation(() => warehouse);
      jest
        .spyOn(packageRespository, 'save')
        .mockImplementation(() => packageSaved);

      expect(await packageService.savePackage(packageDto)).toBe(packageSaved);
    });
  });
});
