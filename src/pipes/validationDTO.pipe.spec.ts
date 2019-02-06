import { ValidationDTO } from './validationDTO.pipe';
import { PackageDTO, Status } from '../dtos/package.dto';
import { ArgumentMetadata } from '@nestjs/common';

describe('ValidationDTO', async () => {
  let validationDTO: ValidationDTO;

  beforeEach(() => {
    validationDTO = new ValidationDTO();
  });

  describe('validationDto', () => {
    it('transform valid properties', async done => {
      const value = {
        id: null,
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
        amount: 0,
        dateOfDelivery: '',
        warehouse: null,
        status: Status.RECEIVED,
      };

      expect(
        validationDTO.transform(value, {
          type: 'body',
          metatype: PackageDTO,
        }),
      ).resolves.toBe(value);

      done();
    });

    it('transform valid properties', async done => {
      const value = {
        id: null,
        customer: {
          id: 1,
          name: 'Renzo',
          surname: 'Coronel',
          adress: 'Calle 62',
          phone: '2314619368',
          email: 'renzo.h.coronel@gmail.com',
        },
        from: 'Cordoba',
        to: 0,
        amount: 0,
        dateOfDelivery: '',
        warehouse: null,
        status: Status.RECEIVED,
      };

      expect(
        validationDTO.transform(value, {
          type: 'body',
          metatype: PackageDTO,
        }),
      ).rejects.toThrowError();
      done();
    });

  });
});
