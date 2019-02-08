import {
  Controller,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import {
  ApiImplicitQuery,
  ApiImplicitParam,
  ApiOperation,
} from '@nestjs/swagger';
import { WarehouseDTO } from './../dtos/warehouse.dto';
import { Action } from './../models/warehouse.entity';

@Controller('api')
export class WarehouseController {
  private readonly logger = new Logger(WarehouseController.name);

  constructor(private serviceWarehouse: WarehouseService) {}

  @ApiOperation({
    title: 'Update warehouse decision action when it is 95% occupied ',
  })
  @ApiImplicitParam({ name: 'id', description: 'id of the warehouses' })
  @ApiImplicitQuery({
    name: 'action',
    enum: Object.keys(Action),
  })
  @Put('warehouse/:id')
  async updateWarehouseActionLimit(@Param() params, @Query() query) {
    return new Promise<WarehouseDTO>((resolve, reject) =>
      this.serviceWarehouse
        .changeWarehouseAction(params.id, query.action)
        .then(({id, city, name}) => {
          const warehouseDto = new WarehouseDTO();
          warehouseDto.id = id;
          warehouseDto.city = city;
          warehouseDto.name = name;

          this.logger.log(`Updated warehouse ${warehouseDto.name}`);

          resolve(warehouseDto);
        })
        .catch(e => {
          reject(
            new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: e.message,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }),
    );
  }
}
