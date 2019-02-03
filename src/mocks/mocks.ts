import { ActionWhenLimit } from './../models/warehouse.entity';

export const distanServiceMock = jest.fn(async () => ({
  getDistance: async () => {
    new Promise((resolve, reject) => resolve(2));
  },
}))();

export const warehouseRepositoryMock = jest.fn(async () => ({
  getWarehouses: async () => {
    [
      {
        id: 2,
        name: 'WH02',
        city: 'Buenos Aires',
        maxLimit: 100,
        actionWhenLimit: ActionWhenLimit.ACCEPT,
        packages: [],
      },
    ];
  },
}))();

export const packagesRepository = jest.fn(async () => ({}));
